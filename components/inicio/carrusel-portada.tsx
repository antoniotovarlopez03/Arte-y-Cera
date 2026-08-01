'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

export type Diapositiva = {
  ref: string;
  src: string;
  alt: string;
  ancho: number;
  alto: number;
  href: string;
  categoria: string;
  linea: string;
};

const SEGUNDOS = 6;

/**
 * Carrusel de la portada.
 *
 * Va pasando las mejores piezas del catálogo —una por familia— y cada una
 * enlaza a su ficha con la foto abierta, así que la portada deja de ser un
 * escaparate y pasa a ser el primer paso del encargo.
 *
 * Tres cosas que un carrusel que se mueve solo tiene que traer de serie, y que
 * casi ninguno trae:
 *
 * 1. **Botón de pausa.** WCAG 2.2.2 lo exige para cualquier cosa que se mueva
 *    sola más de cinco segundos. No es un extra: sin él, quien lee despacio o
 *    usa un lector de pantalla pierde el contenido a media frase.
 * 2. **Respeta `prefers-reduced-motion`.** A quien ha pedido que las cosas no
 *    se muevan, no se le mueven: el carrusel arranca parado y se maneja a mano.
 * 3. **Se para al pasar el ratón o al entrar el foco con el tabulador.** Si no,
 *    el enlace que ibas a pulsar cambia debajo del cursor.
 *
 * Y una de rendimiento: solo la primera foto se carga de entrada (es el LCP de
 * la web). Las demás se montan más tarde, cuando ya no compiten con ella.
 */
export function CarruselPortada({ diapositivas }: { diapositivas: Diapositiva[] }) {
  const [indice, setIndice] = useState(0);
  const [pausadoAMano, setPausadoAMano] = useState(false);
  const [detenidoPorPuntero, setDetenidoPorPuntero] = useState(false);
  /** Hasta qué diapositiva se ha montado ya. Empieza en 0: solo la primera. */
  const [montadas, setMontadas] = useState(0);
  const region = useRef<HTMLDivElement>(null);

  // Se lee con useSyncExternalStore y no con un efecto para no meter un
  // setState dentro de un efecto (la regla de los hooks avisa, y con razón).
  const reducirMovimiento = useSyncExternalStore(
    (avisar) => {
      const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
      consulta.addEventListener('change', avisar);
      return () => consulta.removeEventListener('change', avisar);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    // En el servidor no se puede saber; se asume que no, y al hidratar se
    // corrige. Es el único valor que no rompe nada si acierta al revés.
    () => false,
  );

  const total = diapositivas.length;
  const enMarcha = !pausadoAMano && !detenidoPorPuntero && !reducirMovimiento && total > 1;

  const ir = useCallback(
    (siguiente: number) => {
      const destino = (siguiente + total) % total;
      setIndice(destino);
      // Se monta también la de después, para que no llegue en blanco.
      setMontadas((m) => Math.max(m, Math.min(destino + 1, total - 1)));
    },
    [total],
  );

  useEffect(() => {
    if (!enMarcha) return;
    const reloj = setInterval(() => setIndice((i) => (i + 1) % total), SEGUNDOS * 1000);
    return () => clearInterval(reloj);
  }, [enMarcha, total]);

  // La segunda foto se monta un segundo y medio después de arrancar: para
  // entonces la primera ya ha pintado y no le quita ancho de banda al LCP.
  useEffect(() => {
    if (total < 2) return;
    const espera = setTimeout(() => setMontadas((m) => Math.max(m, 1)), 1500);
    return () => clearTimeout(espera);
  }, [total]);

  // Al cambiar de diapositiva se deja montada la siguiente.
  useEffect(() => {
    if (indice + 1 > montadas && indice + 1 < total) {
      const espera = setTimeout(() => setMontadas(indice + 1), 0);
      return () => clearTimeout(espera);
    }
  }, [indice, montadas, total]);

  const actual = diapositivas[indice]!;

  return (
    <div
      ref={region}
      role="group"
      aria-roledescription="carrusel"
      aria-label="Piezas destacadas"
      className="relative lg:h-full"
      onMouseEnter={() => setDetenidoPorPuntero(true)}
      onMouseLeave={() => setDetenidoPorPuntero(false)}
      onFocusCapture={() => setDetenidoPorPuntero(true)}
      onBlurCapture={(e) => {
        if (!region.current?.contains(e.relatedTarget as Node)) setDetenidoPorPuntero(false);
      }}
    >
      <div className="relative aspect-4/5 w-full overflow-hidden sm:aspect-16/10 lg:h-full lg:min-h-[min(86svh,44rem)] lg:aspect-auto">
        {diapositivas.map((d, i) => {
          if (i > montadas) return null;
          const activa = i === indice;
          return (
            <Image
              key={d.ref}
              src={d.src}
              alt={activa ? d.alt : ''}
              width={d.ancho}
              height={d.alto}
              sizes="(max-width: 1024px) 100vw, 58vw"
              quality={90}
              priority={i === 0}
              aria-hidden={!activa}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-suave ${
                activa ? 'opacity-100' : 'opacity-0'
              }`}
            />
          );
        })}
      </div>

      {/* La etiqueta de la pieza: cambia con la foto y entra en su ficha con
          esa vela ya abierta. Es lo que convierte el carrusel en catálogo. */}
      <Link
        href={actual.href}
        className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 rounded-full bg-verde-profundo/85 px-4 py-2.5 text-sm text-cream backdrop-blur-sm transition-colors hover:bg-verde-profundo sm:right-auto sm:w-auto sm:gap-5"
      >
        <span>
          <span className="font-mono tracking-wide text-gold-light">{actual.ref}</span>
          <span className="ml-2.5 text-cream/70">
            {actual.categoria} · {actual.linea}
          </span>
        </span>
        <span className="shrink-0 font-medium">Ver esta pieza</span>
      </Link>

      {/* Controles ARRIBA a la derecha, no abajo. La esquina inferior derecha es
          del botón flotante de WhatsApp, que es fijo y va por encima: ya se comió
          la barra de la ficha en móvil y el «Ver esta pieza» de la portada, y no
          hay tercera. Ver la nota en app/globals.css. */}
      <div className="absolute top-4 right-4 flex items-center gap-3">
        <ul role="list" className="flex items-center gap-1.5">
          {diapositivas.map((d, i) => (
            <li key={d.ref}>
              <button
                type="button"
                onClick={() => ir(i)}
                aria-label={`Ver la pieza ${i + 1} de ${total}: ${d.categoria}`}
                aria-current={i === indice ? 'true' : undefined}
                className={`block h-2.5 rounded-full transition-all ${
                  i === indice ? 'w-7 bg-cream' : 'w-2.5 bg-cream/45 hover:bg-cream/70'
                }`}
              />
            </li>
          ))}
        </ul>

        {/* El botón de pausa solo existe si hay algo que pausar. Con
            prefers-reduced-motion el pase no arranca, así que WCAG 2.2.2 ya está
            cumplido sin control y ofrecer uno sería mentir: decía «Pausar»
            mientras el icono mostraba «reproducir», y pulsarlo no habría hecho
            nada porque el pase está bloqueado igualmente. Los puntos siguen
            estando para moverse a mano, que es lo que se espera ahí. */}
        {!reducirMovimiento && (
          <button
            type="button"
            onClick={() => setPausadoAMano((v) => !v)}
            aria-label={pausadoAMano ? 'Reanudar el pase de fotos' : 'Pausar el pase de fotos'}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-verde-profundo/85 text-cream backdrop-blur-sm hover:bg-verde-profundo"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              {pausadoAMano ? (
                <path d="M8 5l11 7-11 7z" />
              ) : (
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
