/** Junta clases y descarta lo vacío. Evita traer una dependencia por esto. */
export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(' ');
}

type Variante = 'primario' | 'secundario' | 'whatsapp' | 'discreto';

const BASE =
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60';

const VARIANTES: Record<Variante, string> = {
  primario: 'bg-ink text-ivory hover:bg-ink-2 px-6 py-3',
  secundario: 'border border-ink/25 text-ink hover:border-ink hover:bg-cream px-6 py-3',
  whatsapp: 'bg-[#128c4a] text-white hover:bg-[#0f7a40] px-6 py-3',
  discreto: 'text-ink-soft hover:text-ink underline decoration-gold underline-offset-4',
};

export function clasesBoton(variante: Variante = 'primario', extra?: string): string {
  return cx(BASE, VARIANTES[variante], extra);
}
