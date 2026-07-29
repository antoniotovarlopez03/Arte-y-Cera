import type { Categoria, Linea } from '@/lib/catalogo/esquemas';
import { site } from '@/lib/site';

/* ============================================================
   Datos estructurados (JSON-LD).

   Es lo que permite a Google entender que esto es un taller artesano con
   productos y precios, y no un blog. La web original no tenía ninguno.
   ============================================================ */

/** Convierte una ruta interna en URL absoluta, como piden los buscadores. */
function abs(ruta: string): string {
  return new URL(ruta, site.url).toString();
}

type Json = Record<string, unknown>;

export function jsonLdNegocio(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#negocio`,
    name: site.nombre,
    description: site.descripcion,
    url: site.url,
    email: site.email,
    telephone: `+${site.whatsapp}`,
    image: abs('/images/colecciones/toallas-bautizo-vela/toallas-bautizo-vela-03.jpeg'),
    priceRange: '15 € – 260 €',
    areaServed: { '@type': 'Country', name: 'España' },
    sameAs: [site.instagram.url],
    knowsLanguage: 'es',
  };
}

function migasJsonLd(migas: Array<{ nombre: string; ruta: string }>): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: migas.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.nombre,
      item: abs(m.ruta),
    })),
  };
}

/**
 * Ficha de producto. Sin carrito ni pago online, así que la oferta se declara
 * como pedido por encargo (PreOrder) en lugar de fingir stock.
 */
export function jsonLdFicha(linea: Linea, categoria: Categoria): Json {
  const importes = linea.precios.map((p) => p.importe);
  const minimo = Math.min(...importes);
  const maximo = Math.max(...importes);

  const oferta: Json =
    importes.length > 1
      ? {
          '@type': 'AggregateOffer',
          lowPrice: minimo,
          highPrice: maximo,
          offerCount: importes.length,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/PreOrder',
          url: abs(linea.href),
        }
      : {
          '@type': 'Offer',
          price: minimo,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/PreOrder',
          url: abs(linea.href),
        };

  const producto: Json = {
    '@type': 'Product',
    name: categoria.esFicha ? categoria.nombre : `${categoria.nombre} · ${linea.nombre}`,
    description: linea.resumen,
    category: categoria.nombre,
    image: linea.piezas.slice(0, 6).map((p) => abs(p.src)),
    brand: { '@type': 'Brand', name: site.nombre },
    offers: oferta,
    ...(linea.medidas ? { size: linea.medidas } : {}),
    isFamilyFriendly: true,
    additionalProperty: {
      '@type': 'PropertyValue',
      name: 'Hecho a mano',
      value: 'Cada pieza se pinta a mano por encargo',
    },
  };

  const migas = migasJsonLd([
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Colecciones', ruta: '/colecciones' },
    ...(categoria.esFicha
      ? [{ nombre: categoria.nombre, ruta: categoria.href }]
      : [
          { nombre: categoria.nombre, ruta: categoria.href },
          { nombre: linea.nombre, ruta: linea.href },
        ]),
  ]);

  return { '@context': 'https://schema.org', '@graph': [producto, migas] };
}

/** Categoría con varias líneas: una lista de productos. */
export function jsonLdCategoria(categoria: Categoria): Json {
  const lista: Json = {
    '@type': 'ItemList',
    name: categoria.nombre,
    numberOfItems: categoria.lineas.length,
    itemListElement: categoria.lineas.map((linea, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${categoria.nombre} · ${linea.nombre}`,
      url: abs(linea.href),
    })),
  };

  const migas = migasJsonLd([
    { nombre: 'Inicio', ruta: '/' },
    { nombre: 'Colecciones', ruta: '/colecciones' },
    { nombre: categoria.nombre, ruta: categoria.href },
  ]);

  return { '@context': 'https://schema.org', '@graph': [lista, migas] };
}
