import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';

/**
 * La web original no tenía robots.txt (404) y, además, el subdominio de Netlify
 * servía exactamente el mismo contenido que el dominio: Google veía dos webs
 * iguales. Aquí se cierra por defecto y solo se abre en el sitio de verdad.
 *
 * Se indexa únicamente si existe la variable SITIO_PUBLICO=1. Mientras esto
 * viva en una URL de previsualización (arte-y-cera.vercel.app o similar), no se
 * indexa: si no, habría una copia entera de la web compitiendo con arteycera.es
 * y con canonicals cruzados. Cuando el dominio apunte aquí, se añade
 * SITIO_PUBLICO=1 en Vercel y este archivo empieza a permitir el rastreo.
 */
export default function robots(): MetadataRoute.Robots {
  const esElSitioDefinitivo = process.env.SITIO_PUBLICO === '1';

  if (!esElSitioDefinitivo) {
    return { rules: { userAgent: '*', disallow: '/' } };
  }

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
