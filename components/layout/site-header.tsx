'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';

/**
 * Lo mínimo que la cabecera necesita de cada colección. Llega como prop desde
 * app/layout.tsx, que es servidor: importar aquí el catálogo metería zod y las
 * 162 piezas en el bundle del navegador para pintar seis enlaces.
 */
export type EntradaMenu = {
  slug: string;
  nombre: string;
  /** Nombre corto para la barra: «Bautizo» en vez de «Velas de bautizo». */
  nombreMenu: string;
  href: string;
  desde: string;
  piezas: number;
  portada: { src: string; alt: string; ancho: number; alto: number };
};

/**
 * Qué colecciones van sueltas en la barra, antes del desplegable, y en qué
 * orden. Elegidas a mano por slug (no las N primeras del catálogo) porque
 * «toallas-de-bautizo» va aquí junto a «cirios-pascuales» aunque no sea
 * contigua en el catálogo (entre medias está «velas-de-navidad»).
 */
const ATAJOS = ['velas-de-bautizo', 'velas-de-mesa-y-boda', 'cirios-pascuales', 'toallas-de-bautizo'];

/**
 * Cabecera.
 *
 * El menú nombra los productos, no la abstracción. Antes ponía «Colecciones»,
 * que es palabra de museo: quien llega buscando una vela de bautizo no busca
 * una colección, busca su celebración. Ahora se despliegan las seis con su foto
 * y su precio desde, que es además como lo tenía Antonio en su WordPress (el
 * menú eran «Cirios Pascuales», «Velas de bautizo», «Velas mesa y bodas»).
 *
 * Y «Inicio» desaparece del menú: para eso está el logotipo, y ese hueco vale
 * más para un producto.
 */
export function SiteHeader({ colecciones }: { colecciones: EntradaMenu[] }) {
  const pathname = usePathname();
  const [movilAbierto, setMovilAbierto] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(false);
  const idPanel = useId();
  const contenedorPanel = useRef<HTMLDivElement>(null);
  const botonPanel = useRef<HTMLButtonElement>(null);

  // Escape cierra lo que esté abierto. Si era el panel de escritorio, el foco
  // vuelve a su botón: si no, se quedaría en la nada y habría que tabular desde
  // el principio de la página.
  useEffect(() => {
    if (!movilAbierto && !panelAbierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMovilAbierto(false);
      if (panelAbierto) {
        setPanelAbierto(false);
        botonPanel.current?.focus();
      }
    };
    document.addEventListener('keydown', alPulsar);
    return () => document.removeEventListener('keydown', alPulsar);
  }, [movilAbierto, panelAbierto]);

  // Clic fuera del panel de escritorio. No cierra con «blur» porque el foco se
  // mueve entre los enlaces de dentro y se cerraría al tabular.
  useEffect(() => {
    if (!panelAbierto) return;
    const alClicar = (e: MouseEvent) => {
      if (!contenedorPanel.current?.contains(e.target as Node)) setPanelAbierto(false);
    };
    document.addEventListener('mousedown', alClicar);
    return () => document.removeEventListener('mousedown', alClicar);
  }, [panelAbierto]);

  const enCatalogo = pathname.startsWith('/colecciones');
  const enTaller = pathname.startsWith('/taller');

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-ivory/90 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5">
        {/* El rótulo se escribe «Arte & Cera», así que el aria-label tiene que
            contener ese texto tal cual y no «Arte y Cera»: si el nombre accesible
            no incluye lo que se ve, quien maneja el navegador por voz dice el
            rótulo y no pasa nada (WCAG 2.5.3, «Label in Name»). Lo encontró
            Lighthouse; axe no trae esa regla activada por defecto. */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Arte & Cera, inicio">
          <Image
            src="/images/logo/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
            priority
          />
          <span className="font-display text-xl font-bold tracking-tight text-verde">
            Arte <span className="text-gold-ink">&amp;</span> Cera
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-6 md:flex">
          {/* Las colecciones elegidas como atajo (ver ATAJOS), sueltas y con el
              nombre corto: quien llega buscando una vela de bautizo pulsa
              «Bautizo» y ya está, sin pasar por ningún desplegable ni por la
              palabra «colecciones». A partir de lg, que es donde caben. */}
          {ATAJOS.map((slug) => colecciones.find((c) => c.slug === slug))
            .filter((coleccion): coleccion is EntradaMenu => coleccion !== undefined)
            .map((coleccion) => (
            <Link
              key={coleccion.slug}
              href={coleccion.href}
              aria-current={pathname === coleccion.href ? 'page' : undefined}
              className={`hidden text-[0.95rem] transition-colors hover:text-verde lg:block ${
                pathname === coleccion.href
                  ? 'font-medium text-verde underline decoration-gold decoration-2 underline-offset-8'
                  : 'text-ink-soft'
              }`}
            >
              {coleccion.nombreMenu}
            </Link>
          ))}

          <div className="relative" ref={contenedorPanel}>
            <button
              ref={botonPanel}
              type="button"
              onClick={() => setPanelAbierto((v) => !v)}
              aria-expanded={panelAbierto}
              aria-controls={idPanel}
              className={`flex items-center gap-1.5 text-[0.95rem] transition-colors hover:text-verde ${
                enCatalogo
                  ? 'font-medium text-verde underline decoration-gold decoration-2 underline-offset-8'
                  : 'text-ink-soft'
              }`}
            >
              Todas las colecciones
              <svg
                viewBox="0 0 24 24"
                className={`h-4 w-4 transition-transform ${panelAbierto ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {panelAbierto && (
              <div
                id={idPanel}
                className="absolute top-full left-1/2 z-50 mt-4 w-[38rem] -translate-x-1/2 rounded-pieza border border-sand bg-ivory p-3 shadow-alzada"
              >
                {/* Al grano: el nombre entero bien legible, el precio desde en
                    verde y cuántas piezas hay. Con eso se decide sin entrar. */}
                <ul role="list" className="grid grid-cols-2 gap-1">
                  {colecciones.map((coleccion) => (
                    <li key={coleccion.slug}>
                      <Link
                        href={coleccion.href}
                        onClick={() => setPanelAbierto(false)}
                        className="flex items-center gap-3.5 rounded-lg p-2.5 transition-colors hover:bg-cream"
                      >
                        <Image
                          src={coleccion.portada.src}
                          alt=""
                          width={coleccion.portada.ancho}
                          height={coleccion.portada.alto}
                          sizes="64px"
                          quality={90}
                          className="h-16 w-16 shrink-0 rounded-md object-cover"
                        />
                        <span className="min-w-0">
                          <span className="block font-display text-lg leading-tight font-semibold text-verde">
                            {coleccion.nombre}
                          </span>
                          <span className="mt-1 block text-sm text-ink-soft">
                            <span className="font-medium text-verde">desde {coleccion.desde}</span>
                            {' · '}
                            {coleccion.piezas} modelos
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/colecciones"
                  onClick={() => setPanelAbierto(false)}
                  className="mt-2 block rounded-lg border-t border-sand px-2 pt-3 pb-1 text-sm text-ink-soft hover:text-verde"
                >
                  Ver todas las colecciones →
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/taller"
            aria-current={enTaller ? 'page' : undefined}
            className={`text-[0.95rem] transition-colors hover:text-verde ${
              enTaller
                ? 'font-medium text-verde underline decoration-gold decoration-2 underline-offset-8'
                : 'text-ink-soft'
            }`}
          >
            El taller
          </Link>

          {/* «Escríbenos» y no «Pedir presupuesto»: para un cirio de 260 € vale,
              pero para una vela de bautizo de 20 € suena a obra, y es justo la
              que más se vende. Además es lo que dice él: «no dudes en
              contactarnos». */}
          <Link
            href="/contacto"
            className="rounded-full bg-verde px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-verde-profundo"
          >
            Escríbenos
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMovilAbierto((v) => !v)}
          aria-expanded={movilAbierto}
          aria-controls="menu-movil"
          aria-label={movilAbierto ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-sand text-ink md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            {movilAbierto ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* En móvil no hay desplegable dentro del desplegable: las seis colecciones
          van listadas directamente. Un menú de seis cosas no necesita niveles. */}
      {movilAbierto && (
        <nav
          id="menu-movil"
          aria-label="Principal"
          className="max-h-[70dvh] overflow-y-auto border-t border-sand/70 bg-ivory px-5 pb-5 md:hidden"
        >
          <ul className="flex flex-col">
            {colecciones.map((coleccion) => (
              <li key={coleccion.slug}>
                <Link
                  href={coleccion.href}
                  onClick={() => setMovilAbierto(false)}
                  className="flex items-center justify-between gap-3 border-b border-sand/50 py-3.5"
                >
                  <span className="text-base text-ink">{coleccion.nombre}</span>
                  <span className="shrink-0 text-sm text-ink-soft">desde {coleccion.desde}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/taller"
                onClick={() => setMovilAbierto(false)}
                className="block border-b border-sand/50 py-3.5 text-base text-ink"
              >
                El taller
              </Link>
            </li>
          </ul>
          <Link
            href="/contacto"
            onClick={() => setMovilAbierto(false)}
            className="mt-5 block rounded-full bg-verde px-5 py-3 text-center text-sm font-medium text-ivory"
          >
            Escríbenos
          </Link>
        </nav>
      )}
    </header>
  );
}
