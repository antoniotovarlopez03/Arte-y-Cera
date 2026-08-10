'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * La cesta: referencias de piezas que se van guardando mientras se navega
 * por el catálogo (botón «Añadir a la cesta» en la galería), para pedirlas
 * todas juntas en un único mensaje sin tener que decidir en la primera foto
 * que se mira. Vive en localStorage porque tiene que sobrevivir a navegar
 * entre fichas y colecciones, cosa que el estado de React no hace.
 *
 * Un simple array de referencias, no de piezas enteras: el catálogo ya
 * vive en cada página que lo necesita, así que solo hace falta guardar el
 * código y buscarlo allí donde se use.
 */
const CLAVE = 'arteycera-cesta';

function leer(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const bruto = window.localStorage.getItem(CLAVE);
    if (!bruto) return [];
    const valor: unknown = JSON.parse(bruto);
    return Array.isArray(valor) ? valor.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

/** Evento propio además de «storage»: «storage» solo avisa a las OTRAS
 *  pestañas, nunca a la que hizo el cambio, y aquí el icono de la cesta y
 *  el botón de la galería tienen que enterarse en la misma pestaña. */
const EVENTO = 'arteycera-cesta-cambiada';

function escribir(refs: string[]) {
  window.localStorage.setItem(CLAVE, JSON.stringify(refs));
  window.dispatchEvent(new Event(EVENTO));
}

export function useCesta() {
  // Siempre arranca vacía: en el servidor no hay localStorage, y leerlo de
  // entrada en el cliente antes de que React hidrate daría un contenido
  // distinto al que se renderizó y provocaría un desajuste de hidratación.
  const [refs, setRefs] = useState<string[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRefs(leer());
    const actualizar = () => setRefs(leer());
    window.addEventListener(EVENTO, actualizar);
    window.addEventListener('storage', actualizar);
    return () => {
      window.removeEventListener(EVENTO, actualizar);
      window.removeEventListener('storage', actualizar);
    };
  }, []);

  const añadir = useCallback((ref: string) => {
    const actuales = leer();
    if (!actuales.includes(ref)) escribir([...actuales, ref]);
  }, []);

  const quitar = useCallback((ref: string) => {
    escribir(leer().filter((r) => r !== ref));
  }, []);

  const vaciar = useCallback(() => escribir([]), []);

  return { refs, añadir, quitar, vaciar };
}
