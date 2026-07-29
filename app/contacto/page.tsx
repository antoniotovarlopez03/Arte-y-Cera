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

      <div className="mt-8 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <p className="text-xs tracking-[0.14em] text-gold-ink uppercase">Hablemos</p>
          <h1 className="mt-2 font-display text-4xl leading-tight font-bold text-ink sm:text-5xl">
            Diseñemos tu vela
          </h1>
          <span className="filete mt-5" />
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            Cuéntanos qué celebración preparas, para cuándo y qué te gustaría ver pintado. Te
            respondemos con una propuesta y un precio.
          </p>

          {pieza && (
            <p className="mt-5 rounded-xl border border-gold/50 bg-cream/60 px-4 py-3 text-sm text-ink">
              Estás preguntando por la pieza <span className="font-mono">{pieza}</span>.
            </p>
          )}

          <ul className="mt-8 space-y-4 text-sm">
            <li>
              <a
                href={whatsappUrl('Hola, os escribo desde la web de Arte y Cera.')}
                target="_blank"
                rel="noopener"
                className="flex items-center gap-3 text-ink hover:underline"
              >
                <IconoWhatsapp className="h-5 w-5 text-gold-deep" />
                {site.whatsappVisible}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-3 text-ink hover:underline"
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
                className="flex items-center gap-3 text-ink hover:underline"
              >
                <IconoInstagram className="h-5 w-5 text-gold-deep" />
                {site.instagram.usuario}
              </a>
            </li>
          </ul>

          <p className="mt-8 text-sm text-ink-soft">
            {site.zona}. {site.tiempoRespuesta}.
          </p>
        </div>

        <div className="rounded-pieza border border-sand bg-cream/40 p-6 sm:p-8">
          <FormularioContacto interesInicial={interes} opciones={opcionesDeInteres()} />
        </div>
      </div>
    </div>
  );
}
