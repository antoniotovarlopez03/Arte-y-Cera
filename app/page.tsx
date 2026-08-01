import Image from 'next/image';
import Link from 'next/link';
import { TarjetaCategoria } from '@/components/catalogo/tarjeta-categoria';
import { DatosEstructurados } from '@/components/datos-estructurados';
import { IconoFlecha, IconoWhatsapp } from '@/components/iconos';
import { categorias, piezaPorRef } from '@/lib/catalogo';
import { jsonLdNegocio } from '@/lib/seo';
import { site, whatsappUrl } from '@/lib/site';
import { clasesBoton } from '@/lib/ui';

/* La foto de portada es una pieza real del catálogo, recuperada del WordPress
   de Antonio a 1600 × 1200: una vela de mesa elaborada, sola y enfocada, con el
   fondo desenfocado. Se descartaron las imágenes generadas con IA que había en
   el proyecto: en un oficio que vende trabajo hecho a mano, la primera imagen
   tiene que ser trabajo real (la única que se conserva está más abajo, en un
   bloque secundario y etiquetada como ilustración).

   Se referencia por su código y no por su ruta: así la portada es una pieza que
   se puede pedir, con su enlace a la ficha, y si algún día esa foto sale del
   catálogo el build avisa en lugar de dejar la portada rota. */
const REF_PORTADA = 'MB-E-01';

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
  const { pieza: portada, linea: lineaPortada } = piezaPorRef(REF_PORTADA);

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
            <h1 className="mt-4 font-display text-[clamp(2.25rem,4.4vw,3.5rem)] leading-[1.08] font-bold text-ivory">
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

          <div className="relative lg:h-full">
            <Image
              src={portada.src}
              alt={portada.alt}
              width={portada.ancho}
              height={portada.alto}
              sizes="(max-width: 1024px) 100vw, 58vw"
              quality={90}
              priority
              className="aspect-4/5 w-full object-cover sm:aspect-16/10 lg:h-full lg:min-h-[38rem] lg:aspect-auto"
            />

            {/* La foto de portada no es decoración: es una pieza que se puede
                pedir. La etiqueta lleva su referencia y entra directamente en su
                ficha, con la foto abierta. De paso enseña en la primera pantalla
                el sistema de códigos con el que funciona todo el catálogo, que es
                lo que luego usa el cliente por WhatsApp. */}
            <Link
              href={`${lineaPortada.href}?pieza=${portada.ref}`}
              /* Anclada a la IZQUIERDA en pantallas anchas, no a la derecha: en
                 la esquina derecha vive el botón flotante de WhatsApp, que es
                 fijo, y se comía el «Ver esta pieza». */
              className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-3 rounded-full bg-verde-profundo/85 px-4 py-2.5 text-sm text-cream backdrop-blur-sm transition-colors hover:bg-verde-profundo sm:right-auto sm:w-auto sm:gap-5"
            >
              <span>
                <span className="font-mono tracking-wide text-gold-light">{portada.ref}</span>
                <span className="ml-2.5 text-cream/70">
                  {lineaPortada.categoria.nombre} · {lineaPortada.nombre}
                </span>
              </span>
              <span className="shrink-0 font-medium">Ver esta pieza</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Colecciones ===== */}
      <section
        className="mx-auto max-w-6xl px-5 py-20 lg:py-28"
        aria-labelledby="titulo-colecciones"
      >
        <div className="max-w-2xl">
          <p className="rotulo">Catálogo</p>
          <h2 id="titulo-colecciones" className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
            Elige la celebración
          </h2>
          <span className="filete mt-6" />
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            Seis colecciones y {totalPiezas} piezas ya pintadas, con los precios a la vista. Ninguna
            se repite: sirven para que veas el estilo y nos digas cuál te gusta.
          </p>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {categorias.map((categoria) => (
            <TarjetaCategoria key={categoria.slug} categoria={categoria} />
          ))}
        </div>
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
      <section className="mx-auto max-w-6xl px-5 py-20 lg:py-28" aria-labelledby="titulo-taller">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="rotulo">Nuestro oficio</p>
            <h2 id="titulo-taller" className="mt-3 font-display text-4xl font-semibold sm:text-5xl">
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

          {/* Esta imagen está generada con inteligencia artificial y por eso lleva
              el pie a la vista. Se conserva porque el taller real todavía no tiene
              una foto buena, pero un negocio que vende trabajo hecho a mano no
              puede colar una imagen falsa como si fuera fotografía: etiquetada es
              un recurso legítimo, sin etiquetar es engañar. En cuanto llegue una
              foto de verdad del taller, se cambia y el pie desaparece. */}
          <figure>
            <Image
              src="/images/pascua/pascua-taller-bg.jpeg"
              alt="Ilustración de un taller con cirios pascuales pintados a mano, pinceles y botes de pintura sobre una mesa de trabajo"
              width={1536}
              height={1024}
              sizes="(max-width: 1024px) 92vw, 560px"
              quality={90}
              className="w-full rounded-pieza object-cover shadow-pieza"
            />
            <figcaption className="mt-2.5 text-xs text-ink-soft">
              Ilustración. Las fotos de las piezas del catálogo son todas reales.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ===== Cierre ===== */}
      <section className="border-t border-sand/60 bg-cream/40">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center lg:py-28">
          {/* Su cierre, tal cual lo tenía en el WordPress: invita a preguntar en
              vez de pedir un pliego de condiciones. */}
          <h2 className="font-display text-4xl font-semibold sm:text-5xl">¿Tienes alguna duda?</h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
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
            <Link href="/contacto" className={clasesBoton('secundario')}>
              Rellenar el formulario
            </Link>
          </div>
          <p className="mt-7 text-sm text-ink-soft">
            O por correo:{' '}
            <a
              href={`mailto:${site.email}`}
              className="text-verde underline decoration-gold underline-offset-4"
            >
              {site.email}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
