import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Migas } from '@/components/ui/migas';
import { site } from '@/lib/site';
import { clasesBoton } from '@/lib/ui';

export const metadata: Metadata = {
  title: 'El taller',
  description:
    'Cómo trabajamos en Arte y Cera: ocho etapas desde la primera conversación hasta la pieza acabada, todas a mano.',
  alternates: { canonical: '/taller' },
};

/* Las ocho etapas son las de la web original (legacy/index.html, sección
   «Proceso»), recortadas a lo esencial: allí eran ocho párrafos largos dentro
   de un fondo animado que competía con el texto. */
const ETAPAS = [
  {
    titulo: 'Inspiración',
    texto:
      'Todo empieza con un porqué: una fecha, un nombre que se repite en la familia, un recuerdo que alguien quiere convertir en objeto. Escuchamos esa historia antes de tocar el material.',
  },
  {
    titulo: 'Diseño',
    texto:
      'Elegimos juntos el motivo, los colores y las proporciones: el tono que irá sobre la cera, la letra con la que se bordará el nombre.',
  },
  {
    titulo: 'Boceto',
    texto:
      'La idea pasa al papel a lápiz, línea a línea. Probamos ángulos y tamaños hasta que el dibujo respira con naturalidad.',
  },
  {
    titulo: 'Preparación',
    texto:
      'Se selecciona la cera y se pule hasta dejarla lisa; el lino de la toalla se tensa en el bastidor. Un paso que no se ve y del que depende todo lo demás.',
  },
  {
    titulo: 'Pintura y bordado',
    texto:
      'Cada trazo se aplica a mano, capa sobre capa, y cada puntada se deja asentar antes de seguir. Es la parte más lenta del proceso.',
  },
  {
    titulo: 'Detalles finales',
    texto:
      'Pan de oro y relieves en la vela; un ribete cosido a mano o una inicial en la toalla. Son los toques que distinguen lo hecho a mano.',
  },
  {
    titulo: 'Secado',
    texto:
      'Cada vela reposa el tiempo que necesita para que el color y la cera se fundan en un solo cuerpo. La toalla se plancha y se airea con el mismo cuidado.',
  },
  {
    titulo: 'Acabado',
    texto:
      'Se revisa cada detalle a la luz, se pule la pieza y se embala lista para el día de la celebración.',
  },
];

const DATOS = [
  { dato: '8 años', pie: 'de oficio' },
  { dato: '+2.000', pie: 'piezas pintadas' },
  { dato: '100 %', pie: 'hecho a mano' },
];

/**
 * Tres piezas del catálogo, ampliadas para que se vea el pincel.
 *
 * `foco` es el punto de la foto sobre el que se centra el recorte, elegido a
 * ojo mirando cada una: casi siempre la franja pintada, que en una vela cae a
 * media altura. Si algún día se cambian estas fotos, hay que volver a mirarlo.
 */
const DETALLES = [
  {
    ref: 'MB-B-01',
    href: '/colecciones/velas-de-mesa-y-boda/basicas?pieza=MB-B-01',
    src: '/images/colecciones/mesa-basicas/mesa-basicas-01.webp',
    alt: 'Detalle del icono pintado a mano en rojo sobre la cera de una vela de mesa',
    ancho: 1200,
    alto: 900,
    foco: '38% 48%',
  },
  {
    ref: 'BZ-E-26',
    href: '/colecciones/velas-de-bautizo/elaboradas?pieza=BZ-E-26',
    src: '/images/colecciones/lazos-elaborados/lazos-elaborados-26.webp',
    alt: 'Detalle de una Virgen con el Niño pintada a mano en rosa y oro sobre una vela de bautizo',
    ancho: 1051,
    alto: 1600,
    foco: '50% 45%',
  },
  {
    ref: 'BZ-D-19',
    href: '/colecciones/velas-de-bautizo/al-detalle?pieza=BZ-D-19',
    src: '/images/colecciones/lazos-al-detalle/lazos-al-detalle-19.webp',
    alt: 'Detalle de una escena pintada a todo color que envuelve una vela de bautizo',
    ancho: 1200,
    alto: 1200,
    foco: '25% 55%',
  },
];

export default function PaginaTaller() {
  return (
    <div className="pb-4">
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <Migas migas={[{ href: '/', texto: 'Inicio' }, { texto: 'El taller' }]} />
      </div>

      <section className="mx-auto grid max-w-6xl items-start gap-12 rounded-pieza bg-terracotta/15 px-5 py-8 sm:p-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="rotulo">Nuestro oficio</p>
          <h1 className="mt-2 font-display text-[2.75rem] leading-tight font-bold sm:text-[3.5rem]">
            Cada vela cuenta una historia
          </h1>
          <span className="filete mt-5" />
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            En Arte y Cera pintamos cada vela a mano, trazo a trazo, para que sea irrepetible.
            Trabajamos cirios pascuales, velas de bautizo y velas de mesa para bodas, cuidando el
            color, la textura y el detalle que cada familia imagina. También bordamos toallas
            personalizadas, para que la pieza y su recuerdo vayan a juego.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            No trabajamos con un catálogo cerrado: las fotos de las colecciones son piezas que ya
            hemos hecho y sirven para que veas el estilo. La tuya se pinta desde cero.
          </p>

          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-sand pt-8">
            {DATOS.map((item) => (
              <div key={item.pie}>
                <dt className="font-display text-3xl font-bold text-verde">{item.dato}</dt>
                <dd className="mt-1 text-sm text-ink-soft">{item.pie}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Image
            src="/images/colecciones/navidad/navidad-01.jpeg"
            alt="Vela de Navidad pintada a mano con la escena del nacimiento, sostenida junto a un árbol iluminado"
            width={826}
            height={1100}
            sizes="(max-width: 640px) 92vw, 300px"
            quality={90}
            className="aspect-4/5 w-full rounded-pieza object-cover shadow-pieza"
          />
          <Image
            src="/images/colecciones/toallas-bautizo/toallas-bautizo-02.jpeg"
            alt="Toalla de bautizo blanca con un nombre bordado a mano en hilo azul"
            width={826}
            height={1100}
            sizes="(max-width: 640px) 92vw, 300px"
            quality={90}
            className="aspect-4/5 w-full rounded-pieza object-cover shadow-pieza sm:mt-10"
          />
        </div>
      </section>

      <section className="mt-24 bg-verde-profundo text-cream" aria-labelledby="titulo-proceso">
        <div className="mx-auto max-w-6xl px-5 py-16 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.14em] text-gold uppercase">Cómo lo hacemos</p>
            <h2
              id="titulo-proceso"
              className="mt-2 font-display text-3xl font-semibold text-ivory sm:text-4xl"
            >
              Del boceto a la cera
            </h2>
            <p className="mt-4 leading-relaxed text-cream/75">
              Ocho etapas y el mismo cuidado en todas. Ninguna se salta, aunque la pieza sea la más
              sencilla del catálogo.
            </p>
          </div>

          {/* «Del boceto a la cera» contado sin una sola imagen era la página más
              floja de la web. Esta foto es literalmente eso: la vela terminada
              con los dibujos a lápiz de los que salió, apoyados al lado. Es una
              pieza real del catálogo, no una foto de archivo. */}
          <figure className="mt-12">
            <Image
              src="/images/colecciones/lazos-elaborados/lazos-elaborados-04.webp"
              alt="Vela de bautizo con el retrato de Francisco pintado a mano, junto a los bocetos a lápiz de los que salió"
              width={1200}
              height={1200}
              sizes="(max-width: 1024px) 92vw, 1100px"
              quality={90}
              className="aspect-16/10 w-full rounded-pieza object-cover"
            />
            <figcaption className="mt-3 text-sm text-cream/60">
              La pieza terminada junto a los bocetos de los que salió. Es la{' '}
              <Link
                href="/colecciones/velas-de-bautizo/elaboradas?pieza=BZ-E-04"
                className="text-gold-light underline decoration-gold/50 underline-offset-4 hover:decoration-gold"
              >
                BZ-E-04
              </Link>{' '}
              del catálogo.
            </figcaption>
          </figure>

          <ol className="mt-14 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {ETAPAS.map((etapa, i) => (
              <li key={etapa.titulo} className="border-t border-cream/15 pt-5">
                <p className="font-display text-sm font-bold text-gold">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-ivory">
                  {etapa.titulo}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/75">{etapa.texto}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Detalles a tamaño grande.
          Esto solo se puede hacer desde que las fotos son de 1200-1600 px: son
          recortes cerrados sobre piezas que ya están en el catálogo, no material
          nuevo. Enseñan lo que de verdad vende una vela pintada a mano y lo que
          antes no se veía nunca, que es el pincel. */}
      <section
        className="textura-pared mx-auto max-w-6xl rounded-pieza bg-bosque px-5 py-20 lg:py-24"
        aria-labelledby="titulo-detalles"
      >
        <div className="max-w-2xl">
          <p className="rotulo text-gold">De cerca</p>
          <h2 id="titulo-detalles" className="mt-3 font-display text-[2.25rem] font-semibold text-white-warm">
            El trazo, a un palmo
          </h2>
          <p className="mt-4 leading-relaxed text-cream/75">
            Tres piezas del catálogo, ampliadas. Se ve el pulso de la mano, el grosor del pincel y el
            oro dado a mano, que es lo que distingue una vela pintada de una estampada.
          </p>
        </div>

        <ul role="list" className="mt-10 grid gap-6 sm:grid-cols-3">
          {DETALLES.map((detalle) => (
            <li key={detalle.ref}>
              <Link href={detalle.href} className="group block">
                {/* El recorte lo hace el contenedor y el acercamiento la escala
                    de la imagen: sin overflow-hidden aquí, la foto ampliada se
                    saldría por los cuatro lados. */}
                <div className="aspect-square overflow-hidden rounded-pieza bg-cream">
                  {/* Dos cosas que no son obvias:
                      · El acercamiento va por transform-origin, no por
                        object-position. Con una foto cuadrada en una caja
                        cuadrada, object-cover no desborda y object-position no
                        hace nada: el scale ampliaba siempre por el centro y los
                        puntos de foco no se notaban. Se ponen los dos al mismo
                        valor para que también funcione con las apaisadas.
                      · `sizes` pide el doble de lo que mide la caja, porque
                        después se amplía 1,9×. Con el tamaño de la caja, la foto
                        ampliada salía borrosa. */}
                  <Image
                    src={detalle.src}
                    alt={detalle.alt}
                    width={detalle.ancho}
                    height={detalle.alto}
                    sizes="(max-width: 640px) 180vw, 720px"
                    quality={90}
                    className="h-full w-full scale-[1.9] object-cover"
                    style={{ objectPosition: detalle.foco, transformOrigin: detalle.foco }}
                  />
                </div>
                <p className="mt-3 font-mono text-xs tracking-wide text-cream/60">{detalle.ref}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="textura-pared mx-auto max-w-3xl rounded-pieza bg-bosque px-5 py-16 text-center lg:py-20">
        <h2 className="font-display text-3xl font-semibold text-white-warm">¿Empezamos con la tuya?</h2>
        <p className="mt-4 text-lg leading-relaxed text-cream/75">
          Mira las colecciones para coger ideas o escríbenos directamente con la fecha de tu
          celebración.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/colecciones" className={clasesBoton('claro')}>
            Ver colecciones
          </Link>
          <Link href="/contacto" className={clasesBoton('contorno-claro')}>
            Pedir presupuesto
          </Link>
        </div>
        <p className="mt-6 text-sm text-cream/70">
          {site.zona} · {site.tiempoRespuesta}
        </p>
      </section>
    </div>
  );
}
