import type { Metadata } from 'next';
import { FormularioContacto } from './formulario';
import { IconoInstagram, IconoSobre, IconoWhatsapp } from '@/components/iconos';
import { Migas } from '@/components/ui/migas';
import { categorias, getCategoria, getLinea } from '@/lib/catalogo';
import { site, whatsappUrl } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Escríbenos y te ayudamos a diseñar tu vela pintada a mano: cuéntanos la celebración, la fecha y los colores. Respuesta en menos de 48 h.',
  alternates: { canonical: '/contacto' },
};

type Props = { searchParams: Promise<{ linea?: string; pieza?: string }> };

/** Todas las piezas del catálogo, aplanadas para el selector visual del
 *  formulario: ya no hace falta escribir ni copiar ningún código, se elige
 *  la foto con un clic (ver components/contacto/selector-pieza.tsx). */
function piezasParaSelector() {
  return categorias.flatMap((categoria) =>
    categoria.lineas.flatMap((linea) =>
      linea.piezas.map((pieza) => ({
        ref: pieza.ref,
        src: pieza.src,
        alt: pieza.alt,
        ancho: pieza.ancho,
        alto: pieza.alto,
        lineaNombre: pieza.lineaNombre,
        categoriaNombre: categoria.nombre,
        esFicha: categoria.esFicha,
      })),
    ),
  );
}

/** Todas las líneas, como «Cirios pascuales · Elaborados». */
function opcionesDeInteres(): string[] {
  return categorias.flatMap((categoria) =>
    categoria.esFicha
      ? [categoria.nombre]
      : categoria.lineas.map((linea) => `${categoria.nombre} · ${linea.nombre}`),
  );
}

/**
 * La ficha enlaza aquí con ?linea=categoria/linea (y opcionalmente la
 * referencia de una pieza), así que el desplegable llega ya elegido: quien
 * viene de mirar una vela no tiene que volver a explicar cuál era.
 */
function interesDesdeParametros(linea?: string): string | undefined {
  if (!linea) return undefined;
  const [slugCategoria, slugLinea] = linea.split('/');
  if (!slugCategoria) return undefined;
  const categoria = getCategoria(slugCategoria);
  if (!categoria) return undefined;
  if (categoria.esFicha) return categoria.nombre;
  if (!slugLinea) return undefined;
  const encontrada = getLinea(slugCategoria, slugLinea);
  return encontrada ? `${categoria.nombre} · ${encontrada.nombre}` : undefined;
}

export default async function PaginaContacto({ searchParams }: Props) {
  const { linea, pieza } = await searchParams;
  const interes = interesDesdeParametros(linea);

  return (
    <div className="mx-auto max-w-6xl px-5 pt-8 pb-16">
      <Migas migas={[{ href: '/', texto: 'Inicio' }, { texto: 'Contacto' }]} />

      <div className="mt-8 grid gap-12 rounded-pieza bg-morado p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="rotulo text-gold">Hablemos</p>
          {/* El titular y el párrafo son los suyos, del WordPress. «Coméntanos qué
              tipo de vela tienes pensada para tu momento» invita a la duda en vez
              de pedir un pliego de condiciones, y eso es lo que hace escribir. */}
          <h1 className="mt-2 font-display text-[2.75rem] leading-tight font-bold text-white-warm sm:text-[3.5rem]">
            ¿Tienes alguna duda?
          </h1>
          <span className="filete mt-5" />
          <p className="mt-5 text-lg leading-relaxed text-cream/75">
            No dudes en contactarnos y cuéntanos qué tipo de vela tienes pensada para tu momento;
            estaremos encantados de ayudarte a encontrar lo que buscas.
          </p>

          {pieza && (
            <p className="mt-5 rounded-xl border border-gold/50 bg-ivory px-4 py-3 text-sm text-ink">
              Estás preguntando por la pieza <span className="font-mono">{pieza}</span>.
            </p>
          )}

          <ul className="mt-8 space-y-4 text-sm">
            <li>
              <a
                href={whatsappUrl('Hola, os escribo desde la web de Arte y Cera.')}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 text-cream hover:underline"
              >
                <IconoWhatsapp className="h-5 w-5 text-gold-deep" />
                {site.whatsappVisible}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 text-cream hover:underline"
              >
                <IconoSobre className="h-5 w-5 text-gold-deep" />
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 text-cream hover:underline"
              >
                <IconoInstagram className="h-5 w-5 text-gold-deep" />
                {site.instagram.usuario}
              </a>
            </li>
          </ul>

          <p className="mt-8 text-sm text-cream/60">
            {site.zona}. {site.tiempoRespuesta}.
          </p>
        </div>

        <div className="rounded-pieza border border-sand bg-ivory p-6 sm:p-8">
          <FormularioContacto
            interesInicial={interes}
            referenciaInicial={pieza}
            piezas={piezasParaSelector()}
            opciones={opcionesDeInteres()}
          />
        </div>
      </div>
    </div>
  );
}
