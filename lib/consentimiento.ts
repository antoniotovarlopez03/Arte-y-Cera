'use client';

import { site } from '@/lib/site';

/**
 * Consentimiento de cookies para Microsoft Clarity.
 *
 * Clarity graba cómo se mueve la gente por la web (clics, scroll, mapas de
 * calor) y deja cookies propias, así que la LSSI (art. 22.2) obliga a pedir
 * permiso ANTES de cargarlo. Por eso el script no va en el layout: solo se
 * inyecta cuando el visitante pulsa «Aceptar», y la decisión se guarda en
 * localStorage para no volver a preguntar en cada página.
 *
 * Además se manda a Clarity la señal de consentimiento (consentv2), que
 * Microsoft exige para las visitas del Espacio Económico Europeo.
 */

export type Eleccion = 'aceptadas' | 'rechazadas';

const CLAVE = 'arteycera-cookies';

/** Evento propio para que el aviso se vuelva a abrir desde la página de
 *  cookies sin recargar (mismo motivo que en la cesta: «storage» no avisa
 *  a la propia pestaña). */
export const EVENTO_REABRIR = 'arteycera-cookies-reabrir';

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };

declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

export function leerEleccion(): Eleccion | null {
  try {
    const valor = window.localStorage.getItem(CLAVE);
    return valor === 'aceptadas' || valor === 'rechazadas' ? valor : null;
  } catch {
    return null;
  }
}

export function guardarEleccion(eleccion: Eleccion) {
  try {
    window.localStorage.setItem(CLAVE, eleccion);
  } catch {
    // Navegación privada sin almacenamiento: se pregunta en cada visita.
  }
}

export function borrarEleccion() {
  try {
    window.localStorage.removeItem(CLAVE);
  } catch {
    // Igual que arriba.
  }
}

/** El fragmento oficial de Clarity, sin el <script> inline: cola de
 *  llamadas mientras carga y el tag asíncrono de su CDN. */
export function cargarClarity() {
  if (document.getElementById('clarity-tag')) return;

  const cola: ClarityFn = function (...args: unknown[]) {
    (cola.q = cola.q || []).push(args);
  };
  window.clarity = window.clarity || cola;

  const tag = document.createElement('script');
  tag.id = 'clarity-tag';
  tag.async = true;
  tag.src = `https://www.clarity.ms/tag/${site.clarityId}`;
  document.head.appendChild(tag);

  window.clarity('consentv2', { ad_Storage: 'denied', analytics_Storage: 'granted' });
}

/** Retirar el permiso: Clarity borra sus cookies y deja de grabar. */
export function retirarClarity() {
  window.clarity?.('consentv2', { ad_Storage: 'denied', analytics_Storage: 'denied' });
  window.clarity?.('consent', false);
}
