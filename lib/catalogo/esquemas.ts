import { z } from 'zod';

/* ============================================================
   Esquemas del catálogo.

   Se validan al arrancar (lo importa lib/catalogo/index.ts), así que un
   precio mal puesto o una carpeta de fotos que no existe rompe el build con
   un mensaje claro en vez de llegar a producción. Es la red de seguridad para
   que cualquiera pueda editar content/catalogo.ts sin miedo.
   ============================================================ */

const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'el slug va en minúsculas y con guiones: velas-de-bautizo');

/** Un precio. `etiqueta` solo se usa cuando hay varios (1 vela / 2 velas). */
export const PrecioSchema = z.object({
  etiqueta: z.string().min(1).optional(),
  importe: z.number().positive(),
  /** true → se muestra como «desde 200 €» */
  desde: z.boolean().optional(),
});

/** Lo que se escribe a mano en content/catalogo.ts para cada línea. */
export const LineaFuenteSchema = z.object({
  slug,
  nombre: z.string().min(1),
  /** Una frase para la tarjeta y para el resumen de la ficha. */
  resumen: z.string().min(1),
  precios: z.array(PrecioSchema).min(1),
  /** Matiz sobre el precio: «Para otros tamaños, consultar». */
  notaPrecio: z.string().optional(),
  /** El tamaño tal como se lee en la ficha: «70 × 7 cm». */
  medidas: z.string().optional(),
  /**
   * El mismo tamaño en números, para poder DIBUJARLO a escala.
   *
   * Va aparte de `medidas` a propósito: `medidas` es texto libre porque a veces
   * lleva matices, y de un texto libre no se puede sacar un dibujo fiable. Es
   * opcional porque hay líneas cuya medida todavía no nos ha dado el taller, y
   * en esas no se dibuja nada: preferimos no enseñar una escala a inventarnos
   * un centímetro.
   */
  dimensiones: z
    .object({ alto: z.number().positive(), diametro: z.number().positive() })
    .optional(),
  /** Qué entra en el precio. Se muestra como lista en la ficha. */
  incluye: z.array(z.string().min(1)).default([]),
  /** Base del texto alternativo de sus fotos (accesibilidad y SEO). */
  altBase: z.string().min(1),
  /** Carpeta de public/images/colecciones cuyas fotos son de esta línea. */
  carpeta: z.string().min(1),
  /** Foto de portada, elegida a mano. Debe existir en esa carpeta. */
  portadaRef: z.string().min(1),
});

export const CategoriaFuenteSchema = z.object({
  slug,
  nombre: z.string().min(1),
  /** Para qué celebración es. Alimenta el filtro por ocasión. */
  ocasiones: z.array(z.enum(['pascua', 'bautizo', 'boda', 'navidad'])).min(1),
  /** Frase corta para las tarjetas del índice. */
  resumen: z.string().min(1),
  /** Párrafo de la cabecera de la categoría. */
  descripcion: z.string().min(1),
  /** Title y description para Google. */
  seo: z.object({ titulo: z.string().min(1), descripcion: z.string().min(1) }),
  lineas: z.array(LineaFuenteSchema).min(1),
});

export type PrecioFuente = z.infer<typeof PrecioSchema>;
export type LineaFuente = z.infer<typeof LineaFuenteSchema>;
export type CategoriaFuente = z.input<typeof CategoriaFuenteSchema>;

/* ---------- Modelo resuelto, el que consumen las páginas ---------- */

export type Ocasion = z.infer<typeof CategoriaFuenteSchema>['ocasiones'][number];

export type Pieza = {
  ref: string;
  src: string;
  ancho: number;
  alto: number;
  alt: string;
  /**
   * Acabado al que pertenece la pieza («Elaboradas»). Va sellado en la pieza y
   * no como parámetro de la galería porque la página de colección muestra las
   * piezas de los cuatro acabados mezcladas, y el mensaje de WhatsApp de cada
   * foto tiene que nombrar el suyo, no el de la galería entera.
   */
  lineaNombre: string;
};

export type Linea = Omit<LineaFuente, 'carpeta' | 'portadaRef'> & {
  piezas: Pieza[];
  portada: Pieza;
  /** URL de la ficha. En categorías de una sola línea es la de la categoría. */
  href: string;
  categoria: { slug: string; nombre: string };
};

export type Categoria = Omit<z.infer<typeof CategoriaFuenteSchema>, 'lineas'> & {
  lineas: Linea[];
  /** Portada de la categoría: la de su primera línea. */
  portada: Pieza;
  href: string;
  /** Una sola línea → la categoría ES la ficha, sin nivel intermedio. */
  esFicha: boolean;
  totalPiezas: number;
};

export const ETIQUETAS_OCASION: Record<Ocasion, string> = {
  pascua: 'Pascua y parroquias',
  bautizo: 'Bautizos',
  boda: 'Bodas y celebraciones',
  navidad: 'Navidad',
};
