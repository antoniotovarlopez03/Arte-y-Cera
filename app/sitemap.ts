import type { MetadataRoute } from 'next';
import { categorias } from '@/lib/catalogo';
import { site } from '@/lib/site';

/**
 * Mapa del sitio. La web original no tenía ninguno (arteycera.es/sitemap.xml
 * devolvía 404), así que Google solo conocía la portada.
 *
 * Las páginas legales se quedan fuera a propósito: no aportan nada en
 * búsquedas y ya van con noindex.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const fijas: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${site.url}/colecciones`, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${site.url}/taller`, changeFrequency: 'yearly', priority: 0.6 },
    { url: `${site.url}/contacto`, changeFrequency: 'yearly', priority: 0.7 },
  ];

  const catalogo: MetadataRoute.Sitemap = categorias.flatMap((categoria) => [
    { url: `${site.url}${categoria.href}`, changeFrequency: 'monthly' as const, priority: 0.8 },
    ...(categoria.esFicha
      ? []
      : categoria.lineas.map((linea) => ({
          url: `${site.url}${linea.href}`,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }))),
  ]);

  return [...fijas, ...catalogo];
}
