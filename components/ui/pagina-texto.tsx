import { Migas } from '@/components/ui/migas';

/**
 * Envoltura para las páginas de texto largo (legales). Ancho de lectura
 * cómodo y jerarquía tipográfica coherente, sin plugin de prosa.
 */
export function PaginaTexto({
  titulo,
  entradilla,
  children,
}: {
  titulo: string;
  entradilla?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-8 pb-16">
      <Migas migas={[{ href: '/', texto: 'Inicio' }, { texto: titulo }]} />

      <h1 className="mt-8 font-display text-4xl leading-tight font-bold">{titulo}</h1>
      <span className="filete mt-5" />
      {entradilla && <p className="mt-5 text-lg leading-relaxed text-ink-soft">{entradilla}</p>}

      <div className="mt-10 space-y-8 leading-relaxed text-ink-soft [&_a]:text-ink [&_a]:underline [&_a]:decoration-verde/40 [&_a]:underline-offset-4 [&_h2]:mb-2 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_li]:mt-1.5 [&_p+p]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </div>
  );
}

/** Aviso de que un texto legal está a medias, para que nadie lo publique así. */
export function AvisoIncompleto() {
  return (
    <div className="rounded-xl border border-terracotta/50 bg-terracotta/5 p-5 text-sm">
      <p className="font-medium text-ink">Este texto está incompleto</p>
      <p className="mt-1 text-ink-soft">
        Faltan los datos del titular (nombre o razón social, NIF y domicilio). Se rellenan en{' '}
        <code className="font-mono text-xs">content/legal.ts</code> y esta página queda lista. Tal
        como está no cumple la LSSI, así que no debería publicarse.
      </p>
    </div>
  );
}
