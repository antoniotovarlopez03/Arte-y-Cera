import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FichaLinea } from '@/components/catalogo/ficha-linea';
import { GaleriaPiezas } from '@/components/catalogo/galeria-piezas';
import { ComparadorAcabados } from '@/components/catalogo/comparador-acabados';
import { Migas } from '@/components/ui/migas';
import { DatosEstructurados } from '@/components/datos-estructurados';
import { categorias, getCategoria, precioMinimo } from '@/lib/catalogo';
import { jsonLdCategoria, jsonLdFicha } from '@/lib/seo';

type Props = { params: Promise<{ categoria: string }> };

export function generateStaticParams() {
  return categorias.map((c) => ({ categoria: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) return {};

  return {
    title: categoria.seo.titulo,
    description: categoria.seo.descripcion,
    alternates: { canonical: categoria.href },
    openGraph: {
      title: `${categoria.seo.titulo} · Arte y Cera`,
      description: categoria.seo.descripcion,
      url: categoria.href,
      images: [{ url: categoria.portada.src, alt: categoria.portada.alt }],
    },
  };
}

export default async function PaginaCategoria({ params }: Props) {
  const { categoria: slug } = await params;
  const categoria = getCategoria(slug);
  if (!categoria) notFound();

  // Categoría de una sola línea: esta página ES la ficha, para no obligar a
  // dar un clic más en una lista de un solo elemento.
  const unica = categoria.esFicha ? categoria.lineas[0] : undefined;
  if (unica) {
    return (
      <>
        <DatosEstructurados datos={jsonLdFicha(unica, categoria)} />
        <FichaLinea linea={unica} categoria={categoria} />
      </>
    );
  }

  const desde = Math.min(...categoria.lineas.map(precioMinimo));
  const todasLasPiezas = categoria.lineas.flatMap((l) => l.piezas);

  return (
    <>
      <DatosEstructurados datos={jsonLdCategoria(categoria)} />

      <div className="mx-auto max-w-6xl px-5 pt-8 pb-16">
        <Migas
          migas={[
            { href: '/', texto: 'Inicio' },
            { href: '/colecciones', texto: 'Colecciones' },
            { texto: categoria.nombre },
          ]}
        />

        <header className="mt-8 max-w-2xl">
          <p className="rotulo">Colección</p>
          <h1 className="mt-2 font-display text-[2.75rem] leading-tight font-bold sm:text-[3.5rem]">
            {categoria.nombre}
          </h1>
          <span className="filete mt-5" />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{categoria.descripcion}</p>
          <p className="mt-4 text-sm text-ink-soft">
            {categoria.lineas.length} acabados · {categoria.totalPiezas} piezas · desde{' '}
            <span className="font-display font-bold text-verde">{desde} €</span>
          </p>
        </header>

        <section
          className="mt-16 rounded-pieza bg-morado p-6 sm:p-10"
          aria-labelledby="titulo-acabados"
        >
          <h2 id="titulo-acabados" className="font-display text-[1.7rem] font-semibold text-white-warm">
            Elige el acabado
          </h2>
          <p className="mt-2 max-w-2xl text-cream/75">
            Lo que cambia de un precio a otro es cuánta pintura lleva la pieza.
          </p>
          <ComparadorAcabados categoria={categoria} oscuro />
        </section>

        {/* Todas las piezas de la colección juntas, de todos los acabados.
            En su WordPress los cuatro acabados de bautizo estaban en la misma
            página y se podían recorrer de un scroll; al partirlos en cuatro
            fichas (que es lo correcto para el precio y para Google) se perdió
            eso. Aquí vuelve: quien viene por «una vela de bautizo» ve las 77 sin
            entrar y salir cuatro veces, y cada foto lleva su referencia y su
            acabado. Las fichas siguen siendo el sitio donde está el precio. */}
        <section className="mt-24" aria-labelledby="titulo-todas">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="titulo-todas" className="font-display text-[1.7rem] font-semibold">
              Las {categoria.totalPiezas} piezas de la colección
            </h2>
            <p className="text-sm text-ink-soft">
              Cada foto lleva su referencia: dínosla y sabemos exactamente cuál te gusta.
            </p>
          </div>
          <div className="mt-8">
            <GaleriaPiezas piezas={todasLasPiezas} nombreLinea={categoria.nombre} />
          </div>
        </section>
      </div>
    </>
  );
}
