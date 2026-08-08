'use client';

import Image from 'next/image';
import { useMemo, useRef, useState } from 'react';

export type PiezaSelector = {
  ref: string;
  src: string;
  alt: string;
  ancho: number;
  alto: number;
  lineaNombre: string;
  categoriaNombre: string;
  /** Si la categoría es de una sola línea, «Qué te interesa» solo lleva su
   *  nombre (sin « · línea»). Hace falta para formar el mismo texto aquí. */
  esFicha: boolean;
};

/** El mismo texto que ve «Qué te interesa» para esta pieza, para poder
 *  comparar los dos campos y mantenerlos sincronizados en los dos sentidos. */
export function interesDePieza(p: Pick<PiezaSelector, 'categoriaNombre' | 'lineaNombre' | 'esFicha'>): string {
  return p.esFicha ? p.categoriaNombre : `${p.categoriaNombre} · ${p.lineaNombre}`;
}

/**
 * Elegir una foto en vez de copiar un código.
 *
 * El campo de texto libre ("escribe la referencia") pedía copiar algo como
 * CP-E-18 desde otra pestaña, y eso es justo lo que a un cliente le cuesta.
 * Aquí se elige con un clic sobre la foto, en una ventana con buscador entre
 * las 160+ piezas del catálogo. El resultado sigue siendo la misma
 * referencia de siempre, solo que la escribe el clic, no la persona.
 */
export function SelectorPieza({
  piezas,
  valorInicial,
  interesSeleccionado,
  onElegir,
}: {
  piezas: PiezaSelector[];
  valorInicial?: string;
  /** El valor actual de «Qué te interesa». Si coincide con alguna pieza, el
   *  buscador abre mostrando solo esas, en vez del catálogo entero. */
  interesSeleccionado?: string;
  /** Además de guardar la elección, avisa al formulario para que pueda
   *  marcar en «Qué te interesa» la categoría de la foto elegida. */
  onElegir?: (pieza: PiezaSelector) => void;
}) {
  const dialogo = useRef<HTMLDialogElement>(null);
  const [busqueda, setBusqueda] = useState('');
  const [soloDelInteres, setSoloDelInteres] = useState(false);
  const [elegida, setElegida] = useState<PiezaSelector | undefined>(() =>
    valorInicial ? piezas.find((p) => p.ref === valorInicial) : undefined,
  );

  const piezasDelInteres = useMemo(
    () => (interesSeleccionado ? piezas.filter((p) => interesDePieza(p) === interesSeleccionado) : []),
    [piezas, interesSeleccionado],
  );

  const filtradas = useMemo(() => {
    const base = soloDelInteres && piezasDelInteres.length > 0 ? piezasDelInteres : piezas;
    const q = busqueda.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (p) =>
        p.ref.toLowerCase().includes(q) ||
        p.lineaNombre.toLowerCase().includes(q) ||
        p.categoriaNombre.toLowerCase().includes(q),
    );
  }, [piezas, piezasDelInteres, soloDelInteres, busqueda]);

  function abrir() {
    setBusqueda('');
    // Si ya se ha dicho qué interesa, el buscador abre mostrando solo esas
    // piezas; con una elegida sin coincidencias en el catálogo actual, se
    // deja ver todo en vez de una pantalla vacía.
    setSoloDelInteres(piezasDelInteres.length > 0);
    dialogo.current?.showModal();
  }

  function elegir(pieza: PiezaSelector) {
    setElegida(pieza);
    onElegir?.(pieza);
    dialogo.current?.close();
  }

  return (
    <div>
      {/* El valor que de verdad viaja con el formulario. Nombre "referencia"
       *  a propósito: en el servidor (acciones.ts) es el mismo campo que
       *  antes rellenaba quien escribía a mano, no hace falta tocar nada
       *  más ahí. */}
      <input type="hidden" name="referencia" value={elegida?.ref ?? ''} />

      <span className="block text-sm text-ink-soft">Foto de la pieza que te gusta (opcional)</span>

      {elegida ? (
        <div className="mt-1.5 flex items-center gap-3 rounded-xl border border-sand bg-white-warm p-3">
          <Image
            src={elegida.src}
            alt={elegida.alt}
            width={64}
            height={64}
            sizes="64px"
            className="h-16 w-16 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm text-verde">{elegida.ref}</p>
            <p className="truncate text-xs text-ink-soft">
              {elegida.categoriaNombre} · {elegida.lineaNombre}
            </p>
          </div>
          <button
            type="button"
            onClick={abrir}
            className="shrink-0 text-sm font-medium text-verde underline decoration-gold underline-offset-4"
          >
            Cambiar
          </button>
          <button
            type="button"
            onClick={() => setElegida(undefined)}
            aria-label="Quitar la pieza elegida"
            className="shrink-0 text-sm text-ink-soft underline underline-offset-4 hover:text-terracotta"
          >
            Quitar
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={abrir}
          className="mt-1.5 w-full rounded-xl border border-dashed border-sand bg-white-warm px-4 py-3 text-left text-sm text-ink-soft transition-colors hover:border-gold-deep hover:text-verde"
        >
          Elegir una foto del catálogo →
        </button>
      )}

      {/* <dialog> nativo, igual que el visor de fotos del catálogo: el
       *  navegador atrapa el foco y cierra con Escape sin código nuestro. */}
      <dialog
        ref={dialogo}
        onClick={(e) => {
          if (e.target === dialogo.current) dialogo.current?.close();
        }}
        aria-label="Elegir la pieza que te gusta"
        className="m-auto max-h-[85dvh] w-full max-w-3xl rounded-pieza bg-ivory p-0 outline-none backdrop:bg-ink/75"
      >
        <div className="flex max-h-[85dvh] flex-col">
          {soloDelInteres && piezasDelInteres.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sand bg-cream/60 px-4 py-2.5 text-sm">
              <span className="text-ink-soft">
                Viendo solo <span className="font-medium text-ink">{interesSeleccionado}</span>
              </span>
              <button
                type="button"
                onClick={() => setSoloDelInteres(false)}
                className="font-medium text-verde underline decoration-gold underline-offset-4"
              >
                Ver todo el catálogo
              </button>
            </div>
          )}
          <div className="flex items-center gap-3 border-b border-sand p-4">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Busca por referencia o celebración (por ejemplo «bautizo»)"
              autoFocus
              className="w-full rounded-xl border border-sand bg-white-warm px-4 py-2.5 text-sm text-ink"
            />
            <button
              type="button"
              onClick={() => dialogo.current?.close()}
              aria-label="Cerrar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sand text-ink hover:bg-cream"
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

          <div className="overflow-y-auto p-4">
            {filtradas.length === 0 ? (
              <p className="py-10 text-center text-sm text-ink-soft">
                No hay ninguna pieza que coincida con esa búsqueda.
              </p>
            ) : (
              <ul role="list" className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {filtradas.map((p) => (
                  <li key={p.ref}>
                    <button
                      type="button"
                      onClick={() => elegir(p)}
                      className="group relative block w-full cursor-pointer overflow-hidden rounded-lg bg-cream"
                    >
                      <Image
                        src={p.src}
                        alt={p.alt}
                        width={200}
                        height={200}
                        sizes="140px"
                        className="aspect-square w-full object-cover transition-transform duration-300 ease-suave group-hover:scale-105"
                      />
                      <span className="absolute right-0 bottom-0 left-0 truncate bg-verde-profundo/85 px-1.5 py-1 text-center font-mono text-[0.65rem] text-cream">
                        {p.ref}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
}
