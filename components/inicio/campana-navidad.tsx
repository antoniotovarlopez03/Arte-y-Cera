import Image from 'next/image';
import Link from 'next/link';
import { IconoFlecha, IconoWhatsapp } from '@/components/iconos';
import { CAMPANA_NAVIDAD, campanaActiva } from '@/content/campanas';
import { piezaPorRef } from '@/lib/catalogo';
import { whatsappUrl } from '@/lib/site';
import { clasesBoton } from '@/lib/ui';

/* La campaña de Navidad: lo primero que se ve al abrir la web mientras dura.
   El toque navideño es deliberadamente discreto, en la paleta de siempre: una
   estrella dorada trazada a mano, una ramita de acebo y una nevada de puntos
   finísimos. Lo que brilla son las tres velas.
   Fuera de las fechas de content/campanas.ts devuelve null y no deja rastro. */

function Estrella({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path
        d="M32 3 L36 27 L60 32 L36 37 L32 61 L28 37 L4 32 L28 27 Z"
        fill="currentColor"
        opacity=".95"
      />
      <path d="M32 14 L34 30 L50 32 L34 34 L32 50 L30 34 L14 32 L30 30 Z" fill="#0e332d" opacity=".25" />
      <path
        d="M14 14 L29 29 M50 14 L35 29 M14 50 L29 35 M50 50 L35 35"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity=".6"
      />
    </svg>
  );
}

function Acebo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 60" aria-hidden="true" className={className}>
      <path
        d="M44 32 C34 18 18 14 6 18 C12 22 10 28 16 30 C12 34 16 40 22 38 C24 44 32 42 34 38 C38 40 42 36 44 32Z"
        fill="#2f6b4f"
        stroke="#d4b06a"
        strokeWidth="1"
      />
      <path
        d="M46 32 C56 18 72 14 84 18 C78 22 80 28 74 30 C78 34 74 40 68 38 C66 44 58 42 56 38 C52 40 48 36 46 32Z"
        fill="#255a42"
        stroke="#d4b06a"
        strokeWidth="1"
      />
      <circle cx="42" cy="38" r="5" fill="#a3282b" />
      <circle cx="51" cy="37" r="5" fill="#b8332f" />
      <circle cx="46.5" cy="45" r="5" fill="#8e2226" />
      <circle cx="40.5" cy="36.5" r="1.4" fill="#fffdf9" opacity=".7" />
    </svg>
  );
}

export function CampanaNavidad() {
  if (!campanaActiva(CAMPANA_NAVIDAD)) return null;

  const piezas = CAMPANA_NAVIDAD.refs.map((ref) => {
    const { pieza, linea } = piezaPorRef(ref);
    return { ...pieza, href: `${linea.href}?pieza=${pieza.ref}`, precio: linea.precios[0]?.importe };
  });
  const { linea } = piezaPorRef(CAMPANA_NAVIDAD.refs[0]);
  const mensaje = `Hola, me gustaría encargar una vela de Navidad. Me interesa la ${CAMPANA_NAVIDAD.refs.join(', la ')}.`;

  return (
    <section
      aria-labelledby="titulo-navidad"
      className="relative overflow-hidden bg-verde-profundo text-dorado"
      style={{
        // Nevada: dos capas de puntos diminutos y desfasados, casi transparentes
        backgroundImage:
          'radial-gradient(circle, rgba(255,253,249,.16) 1px, transparent 1.6px), radial-gradient(circle, rgba(212,176,106,.14) 1px, transparent 1.6px)',
        backgroundSize: '46px 46px, 73px 73px',
        backgroundPosition: '0 0, 23px 31px',
      }}
    >
      {/* Halo cálido detrás de la estrella */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-dorado/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-5 pt-14 pb-16 lg:pt-16 lg:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <Estrella className="mx-auto h-11 w-11 text-dorado drop-shadow-[0_0_14px_rgba(212,176,106,.55)]" />
          <p className="mt-4 text-xs tracking-[0.22em] text-dorado/85 uppercase">{CAMPANA_NAVIDAD.rotulo}</p>
          <h2
            id="titulo-navidad"
            className="mt-3 font-display text-[clamp(2.4rem,5vw,3.8rem)] leading-[1.05] font-bold text-blanco"
          >
            {CAMPANA_NAVIDAD.titulo}
            <span className="mt-1 block font-semibold text-dorado italic">{CAMPANA_NAVIDAD.subtitulo}</span>
          </h2>
          <span className="filete mx-auto mt-6" />
          <p className="mt-6 text-lg leading-relaxed text-dorado/85">{CAMPANA_NAVIDAD.texto}</p>
        </div>

        <ul role="list" className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-3 sm:gap-7">
          {piezas.map((pieza, i) => (
            <li key={pieza.ref} className={i === 1 ? 'sm:-translate-y-5' : ''}>
              <Link
                href={pieza.href}
                className="group relative block rounded-[1.25rem] border border-dorado/35 bg-verde p-2.5 shadow-[0_24px_50px_rgba(0,0,0,.35)] transition-transform duration-500 ease-suave hover:-translate-y-1.5"
              >
                <Image
                  src={pieza.src}
                  alt={pieza.alt}
                  width={pieza.ancho}
                  height={pieza.alto}
                  sizes="(max-width: 640px) 90vw, 30vw"
                  quality={85}
                  priority={i === 0}
                  // Las fotos apaisadas (montajes con varias vistas de la vela) se
                  // enseñan enteras sobre fondo claro en lugar de recortarlas.
                  className={`aspect-[3/4] w-full rounded-[0.9rem] ${pieza.ancho > pieza.alto * 0.9 ? 'bg-[#f3f1ec] object-contain' : 'object-cover'}`}
                />
                <span className="absolute top-5 left-5 rounded-full bg-verde-profundo/85 px-3 py-1 font-mono text-[0.7rem] tracking-wider text-dorado backdrop-blur-sm">
                  {pieza.ref}
                </span>
                {pieza.precio ? (
                  <span className="absolute right-5 bottom-5 rounded-full bg-ivory px-3 py-1 text-sm font-semibold text-verde-profundo">
                    {pieza.precio} €
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-12 flex flex-col items-center gap-5">
          <Acebo className="h-9 w-14" />
          <div className="flex flex-wrap justify-center gap-3">
            <a href={whatsappUrl(mensaje)} target="_blank" rel="noopener" className={clasesBoton('whatsapp')}>
              <IconoWhatsapp className="h-4 w-4" />
              Encargar mi vela de Navidad
            </a>
            <Link href={linea.href} className={clasesBoton('secundario')}>
              Ver toda la colección
              <IconoFlecha className="h-4 w-4" />
            </Link>
          </div>
          <p className="text-sm text-dorado/75">Hechas a mano en Granada · Envío a toda España</p>
        </div>
      </div>

      {/* Remate inferior: un hilo dorado que separa la campaña de la portada de siempre */}
      <div aria-hidden="true" className="h-px bg-gradient-to-r from-transparent via-dorado/50 to-transparent" />
    </section>
  );
}
