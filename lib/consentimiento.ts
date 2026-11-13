'use client';

import { site } from '@/lib/site';

/**
 * Consentimiento de cookies para Microsoft Clarity y Google Analytics (vía
 * Google Tag Manager, más abajo).
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

/* ------------------------------------------------------------------
   Google Tag Manager (y la etiqueta de Google Analytics que va dentro).

   GTM sí se carga desde el layout en cada visita, pero antes se fija el modo
   de consentimiento v2 de Google con todo en «denied» (app/layout.tsx). Con
   eso Analytics no deja cookies ni guarda identificadores: como mucho manda
   pings sin cookies. Solo al pulsar «Aceptar» se pasa analytics_storage a
   «granted». Los permisos de publicidad se quedan siempre denegados porque
   esta web no hace publicidad y el aviso no lo pide.
   ------------------------------------------------------------------ */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
  // GTM espera el objeto `arguments`, no un array: así lo hace el fragmento
  // oficial de Google, y con un array normal el comando se ignora.
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

export function concederAnaliticaGoogle() {
  gtag('consent', 'update', { analytics_storage: 'granted' });
}

/** Retirar el permiso: se vuelve a «denied» y se borran las cookies _ga que
 *  Analytics hubiera dejado mientras estuvo concedido. */
export function retirarAnaliticaGoogle() {
  gtag('consent', 'update', { analytics_storage: 'denied' });
  try {
    const dominio = window.location.hostname.replace(/^www\./, '');
    for (const cookie of document.cookie.split(';')) {
      const nombre = (cookie.split('=')[0] ?? '').trim();
      if (!nombre.startsWith('_ga')) continue;
      for (const d of ['', `; domain=.${dominio}`, `; domain=${window.location.hostname}`]) {
        document.cookie = `${nombre}=; Max-Age=0; path=/${d}`;
      }
    }
  } catch {
    // Sin acceso a cookies no hay nada que borrar.
  }
}
