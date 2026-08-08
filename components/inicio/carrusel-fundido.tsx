'use client';

import Image from 'next/image';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { SEGUNDOS } from './carrusel-portada';

export type FotoFundido = {
  ref: string;
  src: string;
  alt: string;
  ancho: number;
  alto: number;
};

/**
 * Carrusel de fundido para fotos sueltas fuera de la portada: mismo fundido
 * (700 ms), misma deriva (el acercamiento lentísimo) y misma duración por
 * foto (`SEGUNDOS`, importado de CarruselPortada) para que el "modo vídeo"
 * se sienta igual en toda la web.
 *
 * Va sin enlace a ficha ni sin flechas de teclado/arrastre: aquí las fotos
 * son ilustrativas, no un catálogo que recorrer, así que ese peso no hace
 * falta. Conserva las barras de progreso y el botón de pausa (WCAG 2.2.2 lo
 * exige para cualquier cosa que avance sola) y respeta
 * `prefers-reduced-motion` igual que el de la portada.
 */
export function CarruselFundido({
  piezas,
  className = '',
}: {
  piezas: FotoFundido[];
  className?: string;
}) {
  const [indice, setIndice] = useState(0);
  const [pausado, setPausado] = useState(false);

  const reducirMovimiento = useSyncExternalStore(
    (avisar) => {
      const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
      consulta.addEventListener('change', avisar);
      return () => consulta.removeEventListener('change', avisar);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false,
  );

  const total = piezas.length;
  const enMarcha = !pausado && !reducirMovimiento && total > 1;

  useEffect(() => {
    if (!enMarcha) return;
    const reloj = setInterval(() => setIndice((i) => (i + 1) % total), SEGUNDOS * 1000);
    return () => clearInterval(reloj);
  }, [enMarcha, total]);

  return (
    <div className={`relative aspect-[3/2] w-full overflow-hidden ${className}`}>
      {piezas.map((p, i) => {
        const activa = i === indice;
        return (
          <Image
            key={p.ref}
            src={p.src}
            alt={activa ? p.alt : ''}
            width={p.ancho}
            height={p.alto}
            sizes="(max-width: 1024px) 92vw, 560px"
            quality={90}
            priority={i === 0}
            aria-hidden={!activa}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-suave ${
              activa ? 'opacity-100' : 'opacity-0'
            }`}
            style={
              activa && !reducirMovimiento
                ? {
                    animation: `deriva ${SEGUNDOS + 2}s ease-out forwards`,
                    animationPlayState: enMarcha ? 'running' : 'paused',
                  }
                : undefined
            }
          />
        );
      })}

      {total > 1 && (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/35 to-transparent"
          />
          <div className="absolute top-3 right-3 left-3 flex items-center gap-3">
            <ul role="list" className="flex flex-1 items-center gap-2">
              {piezas.map((p, i) => (
                <li key={p.ref} className="flex-1">
                  <span className="block h-[3px] w-full overflow-hidden rounded-full bg-white/35">
                    <span
                      className="block h-full origin-left rounded-full bg-white"
                      style={
                        i < indice
                          ? { transform: 'scaleX(1)' }
                          : i === indice
                            ? {
                                animation: `progreso ${SEGUNDOS}s linear forwards`,
                                animationPlayState: enMarcha ? 'running' : 'paused',
                                transform: enMarcha ? undefined : 'scaleX(1)',
                              }
                            : { transform: 'scaleX(0)' }
                      }
                    />
                  </span>
                </li>
              ))}
            </ul>

            {!reducirMovimiento && (
              <button
                type="button"
                onClick={() => setPausado((v) => !v)}
                aria-label={pausado ? 'Reanudar el pase de fotos' : 'Pausar el pase de fotos'}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-verde-profundo/70 text-cream backdrop-blur-sm hover:bg-verde-profundo"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                  {pausado ? <path d="M8 5l11 7-11 7z" /> : <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />}
                </svg>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
