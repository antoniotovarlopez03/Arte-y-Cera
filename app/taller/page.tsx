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

export default function PaginaTaller() {
  return (
    <div className="pb-4">
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <Migas migas={[{ href: '/', texto: 'Inicio' }, { texto: 'El taller' }]} />
      </div>

      <section className="mx-auto grid max-w-6xl items-start gap-12 px-5 pt-8 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="text-xs tracking-[0.14em] text-gold-ink uppercase">Nuestro oficio</p>
          <h1 className="mt-2 font-display text-4xl leading-tight font-bold text-ink sm:text-5xl">
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
                <dt className="font-display text-3xl font-bold text-ink">{item.dato}</dt>
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

      <section className="mt-24 bg-ink text-cream" aria-labelledby="titulo-proceso">
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

      <section className="mx-auto max-w-3xl px-5 py-16 text-center lg:py-20">
        <h2 className="font-display text-3xl font-semibold text-ink">¿Empezamos con la tuya?</h2>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          Mira las colecciones para coger ideas o escríbenos directamente con la fecha de tu
          celebración.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
      </section>
    </div>
  );
}
