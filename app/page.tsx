import Image from 'next/image';
import Link from 'next/link';
import { TarjetaCategoria } from '@/components/catalogo/tarjeta-categoria';
import { DatosEstructurados } from '@/components/datos-estructurados';
import { IconoWhatsapp } from '@/components/iconos';
import { categorias } from '@/lib/catalogo';
import { jsonLdNegocio } from '@/lib/seo';
import { site, whatsappUrl } from '@/lib/site';
import { clasesBoton } from '@/lib/ui';

/* La foto del hero es una pieza real del taller (toallas bordadas con su vela
   pintada). Se descarta la portada anterior, generada con IA: en un oficio que
   vende trabajo hecho a mano, la primera imagen tiene que ser trabajo real. */
const HERO = {
  src: '/images/colecciones/toallas-bautizo-vela/toallas-bautizo-vela-03.jpeg',
  alt: 'Dos toallas de bautizo bordadas con los nombres Lorenzo y María, junto a sus velas pintadas a mano',
  ancho: 826,
  alto: 1100,
};

const PASOS = [
  {
    titulo: 'Elige una pieza',
    texto:
      'Mira las colecciones y quédate con la referencia de la que más te guste. También puedes venir con tu propia idea.',
  },
  {
    titulo: 'Hablamos',
    texto:
      'Por WhatsApp o por email concretamos los colores, el nombre, la fecha y el motivo. Sin compromiso.',
  },
  {
    titulo: 'La pintamos',
    texto:
      'Se pinta a mano, solo para ti. Te enseñamos cómo va quedando antes de darla por terminada.',
  },
  {
    titulo: 'Te llega a casa',
    texto: 'Se embala con cuidado y se envía a cualquier punto de España.',
  },
];

export default function PaginaInicio() {
  return (
    <>
      <DatosEstructurados datos={jsonLdNegocio()} />

      {/* ===== Portada ===== */}
      <section className="border-b border-sand/60 bg-cream/40">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div>
            <p className="rotulo">
              Hecho a mano · Pieza única
            </p>
            <h1 className="mt-3 font-display text-4xl leading-[1.08] font-bold sm:text-5xl lg:text-6xl">
              Velas pintadas a mano, una a una
            </h1>
            <span className="filete mt-6" />
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
              Cirios pascuales, velas de bautizo, velas de mesa para bodas y toallas bordadas. Cada
              pieza se pinta por encargo, con tus colores, tu nombre y tu fecha.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/colecciones" className={clasesBoton('primario')}>
                Ver colecciones
              </Link>
              <Link href="/contacto" className={clasesBoton('secundario')}>
                Pedir presupuesto
              </Link>
            </div>

            <p className="mt-6 text-sm text-ink-soft">
              {site.zona} · {site.tiempoRespuesta}
            </p>
          </div>

          <div className="relative">
            <Image
              src={HERO.src}
              alt={HERO.alt}
              width={HERO.ancho}
              height={HERO.alto}
              sizes="(max-width: 1024px) 92vw, 520px"
              quality={90}
              priority
              className="aspect-4/5 w-full rounded-pieza object-cover shadow-pieza"
            />
          </div>
        </div>
      </section>

      {/* ===== Colecciones ===== */}
      <section
        className="mx-auto max-w-6xl px-5 py-16 lg:py-20"
        aria-labelledby="titulo-colecciones"
      >
        <div className="max-w-2xl">
          <p className="rotulo">Catálogo</p>
          <h2
            id="titulo-colecciones"
            className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl"
          >
            Elige la celebración
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            Seis colecciones, con los precios a la vista y todas las piezas que hemos pintado en
            cada una.
          </p>
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <TarjetaCategoria key={categoria.slug} categoria={categoria} />
          ))}
        </div>
      </section>

      {/* ===== Cómo se encarga ===== */}
      <section className="bg-verde-profundo text-cream" aria-labelledby="titulo-pasos">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.14em] text-gold uppercase">Cómo funciona</p>
            <h2
              id="titulo-pasos"
              className="mt-2 font-display text-3xl font-semibold text-ivory sm:text-4xl"
            >
              Encargar una vela, paso a paso
            </h2>
          </div>

          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((paso, i) => (
              <li key={paso.titulo}>
                <p className="font-display text-3xl font-bold text-gold">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-ivory">
                  {paso.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Cierre ===== */}
      <section className="mx-auto max-w-3xl px-5 py-16 text-center lg:py-24">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">
          ¿Tienes una fecha en mente?
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Cuéntanos qué celebras y te decimos qué se puede hacer y en cuánto tiempo. Si ya has visto
          una pieza que te gusta, dinos su referencia.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={whatsappUrl('Hola, os escribo desde la web de Arte y Cera.')}
            target="_blank"
            rel="noopener"
            className={clasesBoton('whatsapp')}
          >
            <IconoWhatsapp className="h-4 w-4" />
            Escribir por WhatsApp
          </a>
          <Link href="/contacto" className={clasesBoton('secundario')}>
            Rellenar el formulario
          </Link>
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          O por correo:{' '}
          <a
            href={`mailto:${site.email}`}
            className="text-ink underline decoration-gold underline-offset-4"
          >
            {site.email}
          </a>
        </p>
      </section>
    </>
  );
}
