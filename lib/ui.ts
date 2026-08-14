/** Junta clases y descarta lo vacío. Evita traer una dependencia por esto. */
export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(' ');
}

type Variante = 'primario' | 'secundario' | 'whatsapp' | 'discreto';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTES: Record<Variante, string> = {
  // Con el verde de fondo en toda la web, el botón principal es una ficha
  // clara: marfil de fondo con el verde de marca encima da 10,07:1 (AAA), y
  // es lo que de verdad se distingue sobre el verde.
  primario: 'bg-ivory text-verde-profundo hover:bg-cream px-6 py-3',
  secundario: 'border border-dorado/40 text-dorado hover:border-dorado hover:bg-verde-profundo px-6 py-3',
  // El verde de WhatsApp convive con el de la marca, y es a propósito: es el
  // canal por el que este negocio recibe los encargos de verdad, así que
  // conviene que el botón se reconozca al instante. Va oscurecido porque el
  // #25d366 oficial con texto blanco da 2:1 y no pasa WCAG AA; este da 5,4:1.
  whatsapp: 'bg-[#0f7a40] text-white hover:bg-[#0b6135] px-6 py-3',
  discreto: 'text-dorado hover:text-cream underline decoration-dorado/40 underline-offset-4',
};

export function clasesBoton(variante: Variante = 'primario', extra?: string): string {
  return cx(BASE, VARIANTES[variante], extra);
}
