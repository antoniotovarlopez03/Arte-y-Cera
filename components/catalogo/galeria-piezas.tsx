'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconoCesta, IconoSobre, IconoWhatsapp } from '@/components/iconos';
import type { Pieza } from '@/lib/catalogo/esquemas';
import { useCesta } from '@/lib/cesta';
import { whatsappUrl } from '@/lib/site';
import { clasesBoton, cx } from '@/lib/ui';

/**
 * Galería de piezas de una línea.
 *
 * Tres cosas que no hacía la web original y que aquí son el centro:
 *
 * 1. Cada foto lleva su referencia a la vista (CP-E-18). Este negocio recibe
 *    los encargos por WhatsApp señalando una foto; con un código, el cliente
 *    puede decir exactamente cuál quiere.
 * 2. La pieza abierta se refleja en la URL (?pieza=CP-E-18), así que el enlace
 *    que comparte una novia con su madre abre justo esa vela.
 * 3. El visor es un <div> con position:fixed, no un <dialog> nativo. Antes lo
 *    era, pero el navegador integrado de WhatsApp (donde llega buena parte de
 *    las visitas, porque así se comparten las fotos) no calcula bien su alto
 *    a pantalla completa: quedaba un hueco por el que se veía la página de
 *    detrás, y ni fijando la altura a mano se arreglaba. `position:fixed;
 *    inset:0` es más tosco —el foco atrapado y el cierre con Escape hay que
 *    montarlos a mano, más abajo— pero no depende de que el navegador calcule
 *    bien nada: siempre ocupa toda la pantalla, la tenga del tamaño que la
 *    tenga en ese instante.
 *
 * La vista grande nunca amplía una foto por encima de su tamaño real: con los
 * originales recuperados del WordPress eso permite llegar a 1200 px, y las seis
 * que siguen a 300 px se muestran pequeñas en lugar de pixeladas.
 */
export function GaleriaPiezas({
  piezas,
  nombreLinea,
}: {
  piezas: Pieza[];
  /** Solo para el título accesible del visor. El acabado de cada foto sale de
   *  `pieza.lineaNombre`, porque en la página de colección van mezcladas. */
  nombreLinea: string;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  /** La foto que tenía el foco al abrir el visor, para devolvérselo al cerrar. */
  const disparador = useRef<HTMLElement | null>(null);
  const [indice, setIndice] = useState<number | null>(null);
  const { refs: refsCesta, añadir: añadirACesta, quitar: quitarDeCesta } = useCesta();

  const abrir = useCallback((i: number, origen?: HTMLElement) => {
    disparador.current = origen ?? null;
    setIndice(i);
  }, []);
  const cerrar = useCallback(() => setIndice(null), []);

  // Al llegar con ?pieza=REF en la URL, se abre esa pieza. Se lee de
  // window.location en lugar de useSearchParams para no forzar el renderizado
  // dinámico de una página que puede ser estática.
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get('pieza');
    if (!ref) return;
    const i = piezas.findIndex((p) => p.ref === ref);
    // La regla avisa de los setState dentro de efectos, y con razón; este es la
    // excepción que la propia regla contempla: sincronizar con algo de fuera de
    // React (la URL) al montar. No se puede leer en el render porque el
    // servidor no conoce los parámetros de la petición en una página estática,
    // y hacerlo provocaría un desajuste de hidratación.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (i >= 0) setIndice(i);
  }, [piezas]);

  // Sin <dialog>, el scroll de la página de detrás no se bloquea solo: hay que
  // apagarlo a mano mientras el visor está abierto. Y el foco entra en el
  // visor al abrir y vuelve a la foto que lo abrió al cerrar (o se queda donde
  // el navegador decida si se abrió solo, por el ?pieza= de la URL).
  useEffect(() => {
    if (indice === null) return;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    contenedor.current?.focus();
    return () => {
      document.body.style.overflow = overflowPrevio;
      disparador.current?.focus();
    };
  }, [indice]);

  // Trampa de foco: con un <dialog> nativo la pone el navegador; aquí hay que
  // impedir a mano que Tab / Mayús+Tab saquen el foco del visor mientras está
  // abierto, o se iría a los enlaces de la página de detrás sin que se note
  // (el fondo sigue siendo visible bajo el visor, solo que tapado).
  useEffect(() => {
    if (indice === null) return;
    const elemento = contenedor.current;
    if (!elemento) return;
    const alPulsarTab = (evento: KeyboardEvent) => {
      if (evento.key !== 'Tab') return;
      const focusables = elemento.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];
      if (!primero || !ultimo) return;
      if (evento.shiftKey && document.activeElement === primero) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primero.focus();
      }
    };
    document.addEventListener('keydown', alPulsarTab);
    return () => document.removeEventListener('keydown', alPulsarTab);
  }, [indice]);

  // La URL sigue a la pieza abierta con replaceState: no queremos llenar el
  // historial de pasos ni provocar una navegación de Next por cada flecha.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (indice === null) url.searchParams.delete('pieza');
    else url.searchParams.set('pieza', piezas[indice]!.ref);
    window.history.replaceState(null, '', url);
  }, [indice, piezas]);

  const mover = useCallback(
    (paso: number) => {
      setIndice((actual) => {
        if (actual === null) return actual;
        return (actual + paso + piezas.length) % piezas.length;
      });
    },
    [piezas.length],
  );

  const pieza = indice === null ? null : piezas[indice]!;
  const anchoMaximo = pieza ? Math.min(pieza.ancho, 1200) : 1200;

  return (
    <>
      {/* Columnas CSS en vez de rejilla, para que cada foto conserve SU proporción.
          Antes todas iban recortadas a 4:5 y eso se comía la composición que él
          eligió al disparar: una foto apaisada de dos velas se quedaba en una
          vertical con media pieza fuera. Sus fotos son cuadradas, 3:4, 4:3 y
          algún recorte, y ninguna se hizo para recortarse otra vez.

          Es CSS puro: no entra JavaScript, y siguen funcionando la carga
          perezosa, el visor y el enlace ?pieza=. Las tarjetas de categoría y
          de línea SÍ mantienen el recorte 4:5, porque ahí lo que hace legible la
          comparación entre colecciones es que todas midan igual.

          Ojo con el orden: en columnas CSS el contenido cae por columnas, no por
          filas, así que lo que se lee de izquierda a derecha no es consecutivo.
          Para una galería de piezas sin orden semántico da igual, y el foco del
          teclado sigue el orden del DOM (comprobado tabulando). */}
      <ul role="list" className="columns-2 gap-4 sm:columns-3 sm:gap-6 xl:columns-4">
        {piezas.map((p, i) => (
          <li key={p.ref} className="mb-4 break-inside-avoid sm:mb-6">
            <button
              type="button"
              onClick={(e) => abrir(i, e.currentTarget)}
              className="group relative block w-full cursor-zoom-in overflow-hidden rounded-lg bg-cream text-left"
            >
              <Image
                src={p.src}
                alt={p.alt}
                width={p.ancho}
                height={p.alto}
                sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 340px"
                quality={90}
                className="w-full transition-transform duration-500 ease-suave group-hover:scale-[1.03]"
              />
              <span className="absolute bottom-0 left-0 rounded-tr-lg bg-verde-profundo/85 px-2 py-1 font-mono text-[0.68rem] tracking-wide text-cream">
                {p.ref}
              </span>
              <span className="sr-only">
                Ver {p.lineaNombre} {p.ref} en grande
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* El visor recibe el foco al abrirse (de ahí que funcionen las
          flechas), pero no es un control: el anillo de foco rodearía todo el
          visor sin aportar nada, así que se le quita con outline-none. Los
          botones de dentro sí lo llevan.

          El fondo se queda en negro cálido y NO pasa al verde de la marca: un
          velo verde le cambia la percepción del color a la foto que hay encima,
          y aquí lo único que importa es cómo se ve la vela.

          position:fixed + inset-0, no <dialog>: ver el porqué en el comentario
          de arriba del componente. z-50 para quedar por encima de la cabecera
          (z-40) y de la barra fija de precio de la ficha en móvil (z-30). */}
      {pieza && (
        <div
          ref={contenedor}
          role="dialog"
          aria-modal="true"
          aria-label={`${nombreLinea}: piezas en grande`}
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              mover(1);
            }
            if (e.key === 'ArrowLeft') {
              e.preventDefault();
              mover(-1);
            }
            if (e.key === 'Escape') {
              e.preventDefault();
              cerrar();
            }
          }}
          // Clic en el fondo oscuro (fuera del contenido) también cierra.
          onClick={(e) => {
            if (e.target === contenedor.current) cerrar();
          }}
          className="fixed inset-0 z-50 flex flex-col bg-ink text-cream outline-none"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 p-4 sm:p-6">
            <p className="font-mono text-sm tracking-wide text-ivory">
              {pieza.ref}
              <span className="ml-3 font-sans text-cream/60">
                · {pieza.lineaNombre} · {indice! + 1} de {piezas.length}
              </span>
            </p>
            <button
              type="button"
              onClick={cerrar}
              aria-label="Cerrar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream/30 text-cream hover:bg-cream/10"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Esta franja es la que puede no caber entera (foto grande + tres
              botones + nota, en un móvil bajo): por eso es ella, y no todo el
              visor, la que hace scroll. min-h-full en el envoltorio de dentro
              es lo que la centra cuando sí cabe entera SIN dejar de poder
              hacer scroll cuando no cabe — con max-height o con
              justify-center puesto aquí mismo, lo que sobra por arriba deja de
              alcanzarse con el dedo. */}
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="mx-auto flex min-h-full w-full flex-col justify-center gap-4">
              {/* min-w-0 en la foto es lo que evita que las flechas se corten:
                  por defecto, un elemento dentro de un flex no encoge nunca
                  por debajo de su tamaño natural (aquí, hasta 1600 px), así
                  que sin esto la foto empujaba las flechas fuera de la
                  pantalla en vez de dejarles sitio. */}
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <FlechaGaleria direccion="anterior" onClick={() => mover(-1)} />
                <Image
                  src={pieza.src}
                  alt={pieza.alt}
                  width={pieza.ancho}
                  height={pieza.alto}
                  sizes="(max-width: 640px) 84vw, 1100px"
                  quality={90}
                  priority
                  style={{ maxWidth: `${anchoMaximo}px` }}
                  className="h-auto min-w-0 max-h-[45dvh] w-full rounded-lg object-contain shadow-alzada sm:max-h-[70dvh]"
                />
                <FlechaGaleria direccion="siguiente" onClick={() => mover(1)} />
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex flex-wrap justify-center gap-3">
                  <a
                    href={whatsappUrl(
                      `Hola, me interesa la pieza ${pieza.ref} (${pieza.lineaNombre}) que he visto en la web.`,
                    )}
                    target="_blank"
                    rel="noopener"
                    className={clasesBoton('whatsapp')}
                  >
                    <IconoWhatsapp className="h-4 w-4" />
                    Preguntar por la {pieza.ref}
                  </a>
                  {/* Mismo destino que "Un atajo" antes de quitarlo: la página de
                      contacto lee ?pieza= y deja esta foto ya elegida en el
                      selector, sin que quien pregunta tenga que volver a decir
                      cuál es. */}
                  <Link
                    href={{ pathname: '/contacto', query: { pieza: pieza.ref } }}
                    className={clasesBoton('secundario')}
                  >
                    <IconoSobre className="h-4 w-4" />
                    Pedir por correo
                  </Link>
                  {/* No cierra el visor: para pedir varias piezas hace falta poder
                      seguir mirando fotos después de añadir esta, como en una
                      tienda. Al llegar al formulario de contacto, la cesta entera
                      aparece ya elegida (ver lib/cesta.ts). */}
                  <button
                    type="button"
                    onClick={() =>
                      refsCesta.includes(pieza.ref)
                        ? quitarDeCesta(pieza.ref)
                        : añadirACesta(pieza.ref)
                    }
                    className={clasesBoton(
                      refsCesta.includes(pieza.ref) ? 'primario' : 'secundario',
                    )}
                  >
                    <IconoCesta className="h-4 w-4" />
                    {refsCesta.includes(pieza.ref) ? 'En tu cesta ✓' : 'Añadir a la cesta'}
                  </button>
                </div>
                <p className="text-center text-xs text-cream/60">
                  {refsCesta.length > 0
                    ? `${refsCesta.length} ${refsCesta.length === 1 ? 'pieza' : 'piezas'} en tu cesta. Sigue mirando o `
                    : 'Cada pieza se pinta por encargo: esta foto es el punto de partida, no un artículo en stock. '}
                  {refsCesta.length > 0 && (
                    <Link
                      href="/contacto"
                      className="underline decoration-cream/40 underline-offset-4"
                    >
                      ve al formulario
                    </Link>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FlechaGaleria({
  direccion,
  onClick,
}: {
  direccion: 'anterior' | 'siguiente';
  onClick: () => void;
}) {
  const anterior = direccion === 'anterior';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={anterior ? 'Pieza anterior' : 'Pieza siguiente'}
      className={cx(
        'flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cream/30 text-cream hover:bg-cream/10',
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <path
          d={anterior ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
