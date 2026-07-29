import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { FichaLinea } from '@/components/catalogo/ficha-linea';
import { DatosEstructurados } from '@/components/datos-estructurados';
import { categorias, getCategoria, getLinea } from '@/lib/catalogo';
import { jsonLdFicha } from '@/lib/seo';

type Props = { params: Promise<{ categoria: string; linea: string }> };

/**
 * Solo se generan las fichas de las categorías con varias líneas: en las de
 * una sola, la ficha vive en la URL de la categoría y esta ruta no existe.
 */
export function generateStaticParams() {
  return categorias
    .filter((c) => !c.esFicha)
    .flatMap((c) => c.lineas.map((l) => ({ categoria: c.slug, linea: l.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria: slugCategoria, linea: slugLinea } = await params;
  const categoria = getCategoria(slugCategoria);
  const linea = getLinea(slugCategoria, slugLinea);
  if (!categoria || !linea) return {};

  const titulo = `${linea.nombre} · ${categoria.nombre}`;
  const descripcion = `${linea.resumen} ${linea.piezas.length} piezas pintadas a mano desde ${Math.min(
    ...linea.precios.map((p) => p.importe),
  )} €.`;

  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: linea.href },
    openGraph: {
      title: `${titulo} · Arte y Cera`,
      description: descripcion,
      url: linea.href,
      images: [{ url: linea.portada.src, alt: linea.portada.alt }],
    },
  };
}

export default async function PaginaLinea({ params }: Props) {
  const { categoria: slugCategoria, linea: slugLinea } = await params;
  const categoria = getCategoria(slugCategoria);
  const linea = getLinea(slugCategoria, slugLinea);
  if (!categoria || !linea || categoria.esFicha) notFound();

  return (
    <>
      <DatosEstructurados datos={jsonLdFicha(linea, categoria)} />
      <FichaLinea linea={linea} categoria={categoria} />
    </>
  );
}
