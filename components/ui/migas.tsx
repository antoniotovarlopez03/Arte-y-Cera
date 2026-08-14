import Link from 'next/link';

export type Miga = { href?: string; texto: string };

/**
 * Migas de pan. Además de orientar (el catálogo tiene tres niveles), son las
 * que alimentan el BreadcrumbList de datos estructurados en las fichas.
 */
export function Migas({ migas }: { migas: Miga[] }) {
  return (
    <nav aria-label="Ruta" className="text-sm">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-dorado/80">
        {migas.map((miga, i) => {
          const ultima = i === migas.length - 1;
          return (
            <li key={miga.texto} className="flex items-center gap-2">
              {miga.href && !ultima ? (
                <Link href={miga.href} className="hover:text-cream hover:underline">
                  {miga.texto}
                </Link>
              ) : (
                <span aria-current={ultima ? 'page' : undefined} className="text-dorado">
                  {miga.texto}
                </span>
              )}
              {!ultima && (
                <span aria-hidden="true" className="text-dorado/30">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
