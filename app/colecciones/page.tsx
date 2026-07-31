import type { Metadata } from 'next';
import Link from 'next/link';
import { TarjetaCategoria } from '@/components/catalogo/tarjeta-categoria';
import { Migas } from '@/components/ui/migas';
import { categorias, categoriasDe, ocasionesConCategorias } from '@/lib/catalogo';
import { ETIQUETAS_OCASION } from '@/lib/catalogo/esquemas';

export const metadata: Metadata = {
  title: 'Colecciones',
  description:
    'Todas las colecciones de Arte y Cera: cirios pascuales, velas de bautizo, velas de mesa y boda, velas de Navidad y toallas bordadas. Con los precios a la vista.',
  alternates: { canonical: '/colecciones' },
};

export default function PaginaColecciones() {
  const ocasiones = ocasionesConCategorias();
  const totalPiezas = categorias.reduce((n, c) => n + c.totalPiezas, 0);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 pb-4">
      <Migas migas={[{ href: '/', texto: 'Inicio' }, { texto: 'Colecciones' }]} />

      <header className="mt-8 max-w-2xl">
        <p className="rotulo">Catálogo</p>
        <h1 className="mt-2 font-display text-4xl leading-tight font-bold sm:text-5xl">
          Nuestras colecciones
        </h1>
        <span className="filete mt-5" />
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          {totalPiezas} piezas pintadas a mano, agrupadas por celebración y con el precio a la
          vista. Ninguna se repite: sirven para que veas el estilo y nos digas cuál te gusta.
        </p>
      </header>

      {/* Salto rápido por ocasión. Son enlaces a anclas, no un filtro con
          JavaScript: se comparten, funcionan sin JS y la página sigue siendo
          estática. Con seis colecciones, verlas todas es mejor que esconderlas. */}
      <nav aria-label="Ir a una ocasión" className="mt-10">
        <ul className="flex flex-wrap gap-2">
          {ocasiones.map((ocasion) => (
            <li key={ocasion}>
              <a
                href={`#${ocasion}`}
                className="inline-block rounded-full border border-sand bg-cream/50 px-4 py-2 text-sm text-ink-soft transition-colors hover:border-verde hover:text-verde"
              >
                {ETIQUETAS_OCASION[ocasion]}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-14 space-y-20">
        {ocasiones.map((ocasion) => {
          const grupo = categoriasDe(ocasion);
          return (
            <section key={ocasion} id={ocasion} aria-labelledby={`titulo-${ocasion}`}>
              <h2 id={`titulo-${ocasion}`} className="font-display text-2xl font-semibold">
                {ETIQUETAS_OCASION[ocasion]}
              </h2>
              <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {grupo.map((categoria) => (
                  <TarjetaCategoria key={categoria.slug} categoria={categoria} />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-20 rounded-pieza border border-sand bg-cream/50 p-6 text-center text-ink-soft">
        ¿Buscas algo que no está aquí? Se puede pintar casi cualquier motivo.{' '}
        <Link
          href="/contacto"
          className="font-medium text-ink underline decoration-gold underline-offset-4"
        >
          Cuéntanos tu idea
        </Link>
        .
      </p>
    </div>
  );
}
