import Image from 'next/image';
import Link from 'next/link';
import { TarjetaCategoria } from '@/components/catalogo/tarjeta-categoria';
import { CarruselFundido } from '@/components/inicio/carrusel-fundido';
import { CarruselPortada } from '@/components/inicio/carrusel-portada';
import { DatosEstructurados } from '@/components/datos-estructurados';
import { IconoFlecha, IconoWhatsapp } from '@/components/iconos';
import { categorias, muestraDelCatalogo, piezaPorRef } from '@/lib/catalogo';
import { jsonLdNegocio } from '@/lib/seo';
import { site, whatsappUrl } from '@/lib/site';
import { clasesBoton } from '@/lib/ui';

/* Las piezas que van pasando en la portada: una por familia (mesa y boda,
   cirios, bautizo, pack y Navidad), elegidas mirándolas una a una entre las
   recuperadas a 1200-1600 px. Todas son piezas reales del catálogo y cada una
   enlaza a su ficha, así que la portada no es un escaparate: es el primer paso
   del encargo.

   Se referencian por su código y no por su ruta: si alguna sale del catálogo,
   el build avisa en lugar de dejar la portada rota. */
const REFS_PORTADA = ['MB-E-01', 'CP-E-02', 'CP-B-02', 'PK-03', 'NV-03'] as const;

/* Las cuatro piezas que pasan en «Nuestro oficio», en el mismo formato de
   fundido que la portada y con su misma duración (ver CarruselFundido). */
const REFS_TALLER = ['MB-B-01', 'CP-B-09', 'BZ-E-20', 'TB-03'] as const;

/* Alineación de la portada: el texto arranca en la misma vertical que el
   contenido del resto de la web (un contenedor de 72rem con 1.25rem de aire),
   pero la sección es de ancho completo para que la foto llegue al borde
   derecho de la pantalla. De ahí el max(): por debajo de 72rem+aire se queda
   en el margen normal y no se pega al borde. */
const SANGRADO = 'lg:pl-[max(1.25rem,calc(50vw_-_36rem_+_1.25rem))]';

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
  const totalPiezas = categorias.reduce((n, c) => n + c.totalPiezas, 0);
  const diapositivas = REFS_PORTADA.map((ref) => {
    const { pieza, linea } = piezaPorRef(ref);
    return {
      ref: pieza.ref,
      src: pieza.src,
      alt: pieza.alt,
      ancho: pieza.ancho,
      alto: pieza.alto,
      href: `${linea.href}?pieza=${pieza.ref}`,
      categoria: linea.categoria.nombre,
      linea: linea.nombre,
    };
  });
  const fotosTaller = REFS_TALLER.map((ref) => piezaPorRef(ref).pieza);
  const muestra = muestraDelCatalogo(12);

  return (
    <>
      <DatosEstructurados datos={jsonLdNegocio()} />

      {/* ===== Portada =====
          El panel va en verde profundo y la foto ocupa más de la mitad: sobre
          fondo oscuro, una vela pintada a mano con estos colores se ve como en
          una galería, y el texto en marfil da 12:1 de contraste, más que antes.
          Nada de esto se mueve ni aparece al hacer scroll: el efecto lo pone la
          pieza, no una animación. */}
      <section className="bg-verde-profundo text-cream">
        <div className="lg:grid lg:grid-cols-[0.86fr_1.14fr] lg:items-stretch">
          <div className={`px-5 py-16 lg:py-28 lg:pr-14 ${SANGRADO}`}>
            <p className="text-xs tracking-[0.14em] text-gold uppercase">
              Hecho a mano · Pieza única
            </p>

            {/* Titular y entradilla son suyos, del WordPress que se hizo él mismo.
                Dicen en dos frases lo que yo decía en cuatro, y lo dicen como él
                habla; solo se les corrige la ortografía. */}
            <h1 className="mt-4 font-display text-[clamp(2.4rem,4.4vw,3.6rem)] leading-[1.08] font-bold text-ivory">
              Velas pintadas a mano para un momento muy especial
            </h1>
            <span className="filete mt-7" />
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/80 sm:text-xl">
              Desde los colores hasta los detalles grabados, cada elemento puede ser adaptado a tu
              estilo y necesidades.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/colecciones" className={clasesBoton('claro')}>
                Ver nuestros modelos
              </Link>
              <Link href="/contacto" className={clasesBoton('contorno-claro')}>
                Pedir presupuesto
              </Link>
            </div>

            <p className="mt-7 text-sm text-cream/60">
              {site.zona} · {site.tiempoRespuesta}
            </p>
          </div>

          {/* El pase de piezas. El detalle ampliado que había aquí se retira:
              con el carrusel, un primer plano fijo de una sola pieza dejaría de
              corresponderse con la foto en cuanto pasara la primera. */}
          <CarruselPortada diapositivas={diapositivas} />
        </div>
      </section>

      {/* ===== Colecciones ===== */}
      <section
        className="bg-morado text-cream"
        aria-labelledby="titulo-colecciones"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
        <div className="max-w-2xl">
          <p className="rotulo text-gold">Catálogo</p>
          <h2 id="titulo-colecciones" className="mt-3 font-display text-[2.75rem] font-semibold text-white-warm sm:text-[3.5rem]">
            Elige la celebración
          </h2>
          <span className="filete mt-6" />
          <p className="mt-6 text-lg leading-relaxed text-cream/75">
            Seis colecciones y {totalPiezas} piezas ya pintadas, con los precios a la vista. Ninguna
            se repite: sirven para que veas el estilo y nos digas cuál te gusta.
          </p>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <TarjetaCategoria key={categoria.slug} categoria={categoria} oscuro />
          ))}
        </div>
        </div>
      </section>

      {/* ===== Muestra del catálogo =====
          Una tira a sangre con piezas de todas las colecciones, sin pies ni
          botones. No repite las portadas que están justo encima: aquí lo que se
          enseña es la cantidad, que detrás de seis colecciones hay más de ciento
          sesenta velas ya pintadas. Es una sola frase dicha con fotos, y con las
          de 300 px de antes habría sido una mancha. */}
      <section
        aria-labelledby="titulo-muestra"
        className="border-y border-morado bg-morado py-14"
      >
        <h2 id="titulo-muestra" className="sr-only">
          Una muestra de las piezas ya pintadas
        </h2>
        <ul
          role="list"
          className="grid grid-cols-4 gap-2 px-2 sm:grid-cols-6 sm:gap-3 lg:grid-cols-12"
        >
          {muestra.map((pieza) => (
            <li key={pieza.ref}>
              {/* alt vacío: son decorativas. Lo que dicen ya está en el titular
                  oculto, y 12 textos alternativos seguidos en un lector de
                  pantalla serían ruido, no información. */}
              <Image
                src={pieza.src}
                alt=""
                width={pieza.ancho}
                height={pieza.alto}
                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 17vw, 9vw"
                quality={85}
                className="aspect-square w-full rounded-md object-cover"
              />
            </li>
          ))}
        </ul>
        <p className="mt-9 text-center">
          <Link
            href="/colecciones"
            className="inline-flex items-center gap-2 border-b border-gold-light/40 pb-0.5 font-medium text-gold-light hover:border-gold-light"
          >
            Ver las {totalPiezas} piezas
            <IconoFlecha className="h-4 w-4 text-gold-light" />
          </Link>
        </p>
      </section>

      {/* ===== Cómo se encarga ===== */}
      <section className="bg-verde-profundo text-cream" aria-labelledby="titulo-pasos">
        <div className="mx-auto max-w-6xl px-5 py-20 lg:py-28">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.14em] text-gold uppercase">Cómo funciona</p>
            <h2
              id="titulo-pasos"
              className="mt-3 font-display text-4xl font-semibold text-ivory sm:text-5xl"
            >
              Encargar una vela, paso a paso
            </h2>
          </div>

          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {PASOS.map((paso, i) => (
              <li key={paso.titulo}>
                <p className="font-display text-3xl font-bold text-gold">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-3 font-display text-xl font-semibold text-ivory">
                  {paso.titulo}
                </h3>
                <p className="mt-2.5 leading-relaxed text-cream/75">{paso.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== El taller ===== */}
      <section className="bg-terracotta/18" aria-labelledby="titulo-taller">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div>
            <p className="rotulo">Nuestro oficio</p>
            <h2 id="titulo-taller" className="mt-3 font-display text-[2.75rem] font-semibold sm:text-[3.5rem]">
              Cada vela empieza en un papel
            </h2>
            <span className="filete mt-6" />
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              Antes de tocar la cera se dibuja el motivo a mano, se prueba el color y se ajusta el
              tamaño a la pieza. Después se pinta, capa por capa, y se sella para que aguante los
              años que va a estar guardada.
            </p>
            <p className="mt-7">
              <Link
                href="/taller"
                className="inline-flex items-center gap-2 border-b border-verde/25 pb-0.5 font-medium text-verde hover:border-verde"
              >
                Ver cómo trabajamos
                <IconoFlecha className="h-4 w-4 text-gold-deep" />
              </Link>
            </p>
          </div>

          <CarruselFundido piezas={fotosTaller} className="rounded-pieza shadow-pieza" />
        </div>
      </section>

      {/* ===== Cierre ===== */}
      <section className="bg-morado">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-28">
          {/* Su cierre, tal cual lo tenía en el WordPress: invita a preguntar en
              vez de pedir un pliego de condiciones. */}
          <h2 className="font-display text-[2.75rem] font-semibold text-white-warm sm:text-[3.5rem]">
            ¿Tienes alguna duda?
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-cream/75">
            No dudes en contactarnos y cuéntanos qué tipo de vela tienes pensada para tu momento;
            estaremos encantados de ayudarte a encontrar lo que buscas. Si ya has visto una pieza
            que te gusta, dinos su referencia.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappUrl('Hola, os escribo desde la web de Arte y Cera.')}
              target="_blank"
              rel="noopener"
              className={clasesBoton('whatsapp')}
            >
              <IconoWhatsapp className="h-4 w-4" />
              Escribir por WhatsApp
            </a>
            <Link href="/contacto" className={clasesBoton('contorno-claro')}>
              Rellenar el formulario
            </Link>
          </div>
          <p className="mt-7 text-sm text-cream/60">
            O por correo:{' '}
            <a
              href={`mailto:${site.email}`}
              className="text-gold-light underline decoration-gold-light/50 underline-offset-4"
            >
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
