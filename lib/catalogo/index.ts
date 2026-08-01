import { CATALOGO } from '@/content/catalogo';
import { PIEZAS } from '@/content/piezas.generado';
import {
  CategoriaFuenteSchema,
  type Categoria,
  type Linea,
  type Ocasion,
  type Pieza,
} from './esquemas';

/* ============================================================
   Resuelve el catálogo: valida lo que hay escrito a mano en
   content/catalogo.ts y le engancha las fotos generadas por
   scripts/generar-catalogo.mjs.

   Si algo no cuadra (una carpeta que no existe, una portada que no está en su
   carpeta, dos slugs iguales), esto lanza un error y el build se cae. Es
   deliberado: preferimos un fallo en el build a una web publicada con una
   ficha vacía o una foto rota.
   ============================================================ */

function error(mensaje: string): never {
  throw new Error(`[catálogo] ${mensaje}`);
}

function construir(): Categoria[] {
  const slugsVistos = new Set<string>();

  const categorias = CATALOGO.map((fuente) => {
    const resultado = CategoriaFuenteSchema.safeParse(fuente);
    if (!resultado.success) {
      error(
        `la categoría «${fuente.slug ?? '(sin slug)'}» no es válida:\n` +
          resultado.error.issues
            .map((i) => `  · ${i.path.join('.') || '(raíz)'}: ${i.message}`)
            .join('\n'),
      );
    }
    const cat = resultado.data;

    if (slugsVistos.has(cat.slug)) error(`el slug de categoría «${cat.slug}» está repetido`);
    slugsVistos.add(cat.slug);

    const esFicha = cat.lineas.length === 1;
    const hrefCategoria = `/colecciones/${cat.slug}`;
    const slugsLinea = new Set<string>();

    const lineas: Linea[] = cat.lineas.map((lineaFuente) => {
      const { carpeta, portadaRef, ...resto } = lineaFuente;

      if (slugsLinea.has(resto.slug)) {
        error(`en «${cat.slug}», el slug de línea «${resto.slug}» está repetido`);
      }
      slugsLinea.add(resto.slug);

      const generadas = PIEZAS[carpeta];
      if (!generadas) {
        error(
          `la línea «${cat.slug}/${resto.slug}» apunta a la carpeta «${carpeta}», que no existe ` +
            `en public/images/colecciones. Carpetas disponibles: ${Object.keys(PIEZAS).join(', ')}`,
        );
      }
      if (generadas.length === 0) {
        error(`la carpeta «${carpeta}» no tiene ninguna foto`);
      }

      const piezas: Pieza[] = generadas.map((p) => ({
        ...p,
        alt: `${resto.altBase}, referencia ${p.ref}`,
        lineaNombre: resto.nombre,
      }));

      const portada = piezas.find((p) => p.ref === portadaRef);
      if (!portada) {
        error(
          `la portada «${portadaRef}» de «${cat.slug}/${resto.slug}» no está en la carpeta ` +
            `«${carpeta}». Referencias disponibles: ${piezas.map((p) => p.ref).join(', ')}`,
        );
      }

      return {
        ...resto,
        piezas: [portada, ...piezas.filter((p) => p.ref !== portada.ref)],
        portada,
        href: esFicha ? hrefCategoria : `${hrefCategoria}/${resto.slug}`,
        categoria: { slug: cat.slug, nombre: cat.nombre },
      };
    });

    const primera = lineas[0];
    if (!primera) error(`la categoría «${cat.slug}» no tiene líneas`);

    return {
      ...cat,
      lineas,
      portada: primera.portada,
      href: hrefCategoria,
      esFicha,
      totalPiezas: lineas.reduce((n, l) => n + l.piezas.length, 0),
    } satisfies Categoria;
  });

  return categorias;
}

export const categorias: Categoria[] = construir();

export const lineas: Linea[] = categorias.flatMap((c) => c.lineas);

export function getCategoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}

export function getLinea(slugCategoria: string, slugLinea: string): Linea | undefined {
  return getCategoria(slugCategoria)?.lineas.find((l) => l.slug === slugLinea);
}

/**
 * Busca una pieza por su referencia y devuelve también su línea, para poder
 * enlazar a ella. Lanza si no existe: se usa desde la portada, y prefiero que
 * el build se caiga a que la web se publique con la foto principal apuntando
 * a ninguna parte.
 */
export function piezaPorRef(ref: string): { pieza: Pieza; linea: Linea } {
  for (const linea of lineas) {
    const pieza = linea.piezas.find((p) => p.ref === ref);
    if (pieza) return { pieza, linea };
  }
  error(`no existe ninguna pieza con la referencia «${ref}»`);
}

export function categoriasDe(ocasion: Ocasion): Categoria[] {
  return categorias.filter((c) => c.ocasiones.includes(ocasion));
}

/** Las ocasiones que de verdad tienen categorías, para pintar el filtro. */
export function ocasionesConCategorias(): Ocasion[] {
  const orden: Ocasion[] = ['bautizo', 'boda', 'pascua', 'navidad'];
  return orden.filter((o) => categoriasDe(o).length > 0);
}

/** El precio más bajo de una línea: lo que se muestra como «desde». */
export function precioMinimo(linea: Linea): number {
  return Math.min(...linea.precios.map((p) => p.importe));
}

const FORMATO_EUROS = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function formatearPrecio(importe: number): string {
  return FORMATO_EUROS.format(importe);
}

/**
 * Una selección para la portada: la foto de portada de cada línea. Son las que
 * el autor eligió a mano en la web original, así que son la mejor vitrina.
 */
export function piezasDestacadas(limite = 8): Array<{ pieza: Pieza; linea: Linea }> {
  return lineas.slice(0, limite).map((linea) => ({ pieza: linea.portada, linea }));
}
