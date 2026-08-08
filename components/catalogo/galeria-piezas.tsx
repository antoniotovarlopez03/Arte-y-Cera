'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { IconoSobre, IconoWhatsapp } from '@/components/iconos';
import type { Pieza } from '@/lib/catalogo/esquemas';
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
 * 3. Se usa <dialog> nativo: el navegador se encarga del foco atrapado, de
 *    devolver el foco al salir y de cerrar con Escape. Menos código nuestro y
 *    accesibilidad de verdad.
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
  const dialogo = useRef<HTMLDialogElement>(null);
  const [indice, setIndice] = useState<number | null>(null);

  const abrir = useCallback((i: number) => setIndice(i), []);
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
    if (i >= 0) abrir(i);
  }, [piezas, abrir]);

  // El estado de React manda y el <dialog> lo sigue. Antes esto iba al revés
  // (abrir/cerrar el elemento y escuchar su evento «close»), pero ese evento no
  // llega en todos los navegadores y el modal se quedaba con la pieza vieja
  // dentro y la URL sin limpiar. Con una sola fuente de verdad no puede pasar.
  useEffect(() => {
    const elemento = dialogo.current;
    if (!elemento) return;
    if (indice === null && elemento.open) elemento.close();
    if (indice !== null && !elemento.open) elemento.showModal();
  }, [indice]);

  // Escape en un <dialog> modal dispara «cancel» y cierra el elemento por su
  // cuenta: se cancela para que el cierre pase siempre por el estado.
  useEffect(() => {
    const elemento = dialogo.current;
    if (!elemento) return;
    const alCancelar = (evento: Event) => {
      evento.preventDefault();
      cerrar();
    };
    elemento.addEventListener('cancel', alCancelar);
    return () => elemento.removeEventListener('cancel', alCancelar);
  }, [cerrar]);

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
          perezosa, el <dialog> y el enlace ?pieza=. Las tarjetas de categoría y
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
              onClick={() => abrir(i)}
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

      {/* El diálogo recibe el foco al abrirse (de ahí que funcionen las
          flechas), pero no es un control: el anillo de foco rodearía todo el
          modal sin aportar nada, así que se le quita con outline-none. Los
          botones de dentro sí lo llevan.

          El fondo se queda en negro cálido y NO pasa al verde de la marca: un
          velo verde le cambia la percepción del color a la foto que hay encima,
          y aquí lo único que importa es cómo se ve la vela. */}
      <dialog
        ref={dialogo}
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
          if (e.target === dialogo.current) cerrar();
        }}
        aria-label={`${nombreLinea}: piezas en grande`}
        className="m-auto max-h-dvh w-full max-w-5xl bg-transparent p-0 text-cream outline-none backdrop:bg-ink/92"
      >
        {pieza && (
          <div className="flex max-h-dvh flex-col gap-4 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-sm tracking-wide text-gold-light">
                {pieza.ref}
                <span className="ml-3 font-sans text-cream/60">
                  · {pieza.lineaNombre} · {indice! + 1} de {piezas.length}
                </span>
              </p>
              <button
                type="button"
                onClick={cerrar}
                aria-label="Cerrar"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/30 text-cream hover:bg-cream/10"
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
                className="h-auto max-h-[78dvh] w-full rounded-lg object-contain shadow-alzada"
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
                  className={clasesBoton('contorno-claro')}
                >
                  <IconoSobre className="h-4 w-4" />
                  Pedir por correo
                </Link>
              </div>
              <p className="text-center text-xs text-cream/60">
                Cada pieza se pinta por encargo: esta foto es el punto de partida, no un artículo en
                stock.
              </p>
            </div>
          </div>
        )}
      </dialog>
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
