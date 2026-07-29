import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FichaLinea } from '@/components/catalogo/ficha-linea';
import { TarjetaLinea } from '@/components/catalogo/tarjeta-linea';
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
          <p className="text-xs tracking-[0.14em] text-gold-ink uppercase">Colección</p>
          <h1 className="mt-2 font-display text-4xl leading-tight font-bold text-ink sm:text-5xl">
            {categoria.nombre}
          </h1>
          <span className="filete mt-5" />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{categoria.descripcion}</p>
          <p className="mt-4 text-sm text-ink-soft">
            {categoria.lineas.length} acabados · {categoria.totalPiezas} piezas · desde{' '}
            <span className="font-display font-bold text-gold-ink">{desde} €</span>
          </p>
        </header>

        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {categoria.lineas.map((linea) => (
            <TarjetaLinea key={linea.slug} linea={linea} />
          ))}
        </div>
      </div>
    </>
  );
}
