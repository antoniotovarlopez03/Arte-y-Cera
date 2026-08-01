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

/** Segundos por pieza. Cinco piezas = veintidós segundos de vuelta completa. */
const SEGUNDOS = 4.5;

/** Píxeles de arrastre a partir de los cuales se cuenta como gesto. */
const UMBRAL_GESTO = 45;

/**
 * Carrusel de la portada.
 *
 * Va pasando las mejores piezas del catálogo —una por familia— y cada una
 * enlaza a su ficha con la foto abierta, así que la portada deja de ser un
 * escaparate y pasa a ser el primer paso del encargo.
 *
 * Lo que lo separa de un pase de fotos de plantilla:
 *
 * · **Barras de progreso**, no puntos. Se ve cuántas piezas hay, en cuál estás y
 *   cuánto falta para el cambio. Saberlo quita la sensación de que la web decide
 *   por ti, que es lo que hace odiar los carruseles.
 * · **La foto respira**: un acercamiento lentísimo (1 → 1,06) mientras está
 *   activa. No se ve moverse, se nota.
 * · **Se maneja como se espera**: flechas del teclado, arrastre con el dedo y
 *   clic en cualquier barra para saltar.
 *
 * Y lo que WCAG exige de cualquier cosa que se mueva sola, que casi ningún
 * carrusel trae:
 *
 * · **Botón de pausa** (WCAG 2.2.2). Sin él, quien lee despacio pierde el
 *   contenido a media frase.
 * · **Respeta `prefers-reduced-motion`**: no arranca, y entonces el botón de
 *   pausa ni se dibuja, porque no habría nada que pausar.
 * · **Se para al pasar el ratón o al entrar el foco**, para que el enlace no
 *   cambie debajo del cursor.
 * · Las zonas de pulsación de las barras miden 24 px de alto aunque la barra se
 *   vea de 3 px: por debajo de eso, Lighthouse (y los dedos) protestan.
 *
 * Y una de rendimiento: solo la primera foto se carga de entrada, que es el LCP
 * de la web. Las demás se montan a partir del segundo y medio.
 */
export function CarruselPortada({ diapositivas }: { diapositivas: Diapositiva[] }) {
  const [indice, setIndice] = useState(0);
  const [pausadoAMano, setPausadoAMano] = useState(false);
  const [detenidoPorPuntero, setDetenidoPorPuntero] = useState(false);
  /** Hasta qué diapositiva se ha montado ya. Empieza en 0: solo la primera. */
  const [montadas, setMontadas] = useState(0);
  const region = useRef<HTMLDivElement>(null);
  const inicioGesto = useRef<number | null>(null);

  // Con useSyncExternalStore y no con un efecto, para no meter un setState
  // dentro de un efecto (la regla de los hooks avisa, y con razón).
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
    (destino: number) => {
      const siguiente = (destino + total) % total;
      setIndice(siguiente);
      // Se deja montada también la de después, para que no llegue en blanco.
      setMontadas((m) => Math.max(m, Math.min(siguiente + 1, total - 1)));
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
      className="relative touch-pan-y lg:h-full"
      onMouseEnter={() => setDetenidoPorPuntero(true)}
      onMouseLeave={() => setDetenidoPorPuntero(false)}
      onFocusCapture={() => setDetenidoPorPuntero(true)}
      onBlurCapture={(e) => {
        if (!region.current?.contains(e.relatedTarget as Node)) setDetenidoPorPuntero(false);
      }}
      // Flechas del teclado cuando el foco está dentro: es lo que intenta
      // cualquiera que llegue aquí tabulando.
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          ir(indice + 1);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          ir(indice - 1);
        }
      }}
      // Arrastre con el dedo. Con eventos de puntero, así que vale igual para
      // ratón; el umbral evita que un clic tembloroso cuente como gesto.
      onPointerDown={(e) => {
        inicioGesto.current = e.clientX;
      }}
      onPointerUp={(e) => {
        const desde = inicioGesto.current;
        inicioGesto.current = null;
        if (desde === null) return;
        const recorrido = e.clientX - desde;
        if (Math.abs(recorrido) < UMBRAL_GESTO) return;
        ir(indice + (recorrido < 0 ? 1 : -1));
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
              draggable={false}
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

        {/* Un velo por arriba y por abajo. No es decoración: los controles y la
            etiqueta son texto claro sobre una foto que no se sabe de qué color
            va a ser, y sin esto el contraste depende de la suerte. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-verde-profundo/55 to-transparent"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-verde-profundo/55 to-transparent"
        />
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
      <div className="absolute top-3 right-4 left-4 flex items-center gap-3 sm:left-auto sm:w-72">
        <ul role="list" className="flex flex-1 items-center gap-2">
          {diapositivas.map((d, i) => (
            <li key={d.ref} className="flex-1">
              <button
                type="button"
                onClick={() => ir(i)}
                aria-label={`Ver la pieza ${i + 1} de ${total}: ${d.categoria}`}
                aria-current={i === indice ? 'true' : undefined}
                // La barra se ve de 3 px pero el botón mide 24 de alto: por
                // debajo de eso no se acierta con el dedo (WCAG 2.5.8).
                className="group flex h-6 w-full items-center"
              >
                <span className="block h-[3px] w-full overflow-hidden rounded-full bg-cream/35 group-hover:bg-cream/55">
                  <span
                    className="block h-full origin-left rounded-full bg-cream"
                    style={
                      i < indice
                        ? { transform: 'scaleX(1)' }
                        : i === indice
                          ? {
                              animation: `progreso ${SEGUNDOS}s linear forwards`,
                              animationPlayState: enMarcha ? 'running' : 'paused',
                              // Parado del todo (o sin movimiento), la barra se
                              // queda llena: marca dónde estás, no cuánto falta.
                              transform: enMarcha ? undefined : 'scaleX(1)',
                            }
                          : { transform: 'scaleX(0)' }
                    }
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* El botón de pausa solo existe si hay algo que pausar. Con
            prefers-reduced-motion el pase no arranca, así que WCAG 2.2.2 ya está
            cumplido sin control y ofrecer uno sería mentir: diría «Pausar»
            mientras el icono muestra «reproducir», y pulsarlo no haría nada. Las
            barras siguen estando para moverse a mano. */}
        {!reducirMovimiento && (
          <button
            type="button"
            onClick={() => setPausadoAMano((v) => !v)}
            aria-label={pausadoAMano ? 'Reanudar el pase de fotos' : 'Pausar el pase de fotos'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-verde-profundo/70 text-cream backdrop-blur-sm hover:bg-verde-profundo"
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
