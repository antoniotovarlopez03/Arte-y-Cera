/** Junta clases y descarta lo vacío. Evita traer una dependencia por esto. */
export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(' ');
}

type Variante =
  | 'primario'
  | 'secundario'
  | 'whatsapp'
  | 'discreto'
  /* Las dos «claro» son para los bloques de fondo verde oscuro (la portada).
     No se pueden usar sobre marfil: el marfil sobre marfil no se ve. */
  | 'claro'
  | 'contorno-claro';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-verde text-ivory hover:bg-verde-profundo px-6 py-3',
  secundario: 'border border-verde/30 text-verde hover:border-verde hover:bg-cream px-6 py-3',
  // El verde de WhatsApp convive con el de la marca, y es a propósito: es el
  // canal por el que este negocio recibe los encargos de verdad, así que
  // conviene que el botón se reconozca al instante. Va oscurecido porque el
  // #25d366 oficial con texto blanco da 2:1 y no pasa WCAG AA; este da 5,4:1.
  whatsapp: 'bg-[#0f7a40] text-white hover:bg-[#0b6135] px-6 py-3',
  discreto: 'text-ink-soft hover:text-verde underline decoration-verde/40 underline-offset-4',
  // Sobre verde profundo: marfil de fondo con el verde de marca encima da
  // 10,07:1, y el contorno en crema al 40 % se ve sin gritar.
  claro: 'bg-ivory text-verde hover:bg-cream px-6 py-3',
  'contorno-claro': 'border border-cream/40 text-cream hover:bg-cream/10 px-6 py-3',
};

export function clasesBoton(variante: Variante = 'primario', extra?: string): string {
  return cx(BASE, VARIANTES[variante], extra);
}
