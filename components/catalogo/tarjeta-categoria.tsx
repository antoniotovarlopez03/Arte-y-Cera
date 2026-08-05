import Image from 'next/image';
import Link from 'next/link';
import { IconoFlecha } from '@/components/iconos';
import { formatearPrecio, precioMinimo } from '@/lib/catalogo';
import type { Categoria } from '@/lib/catalogo/esquemas';

/**
 * Variante ancha, para cuando una ocasión tiene una sola colección.
 *
 * En la página de colecciones, tres de los cuatro grupos (bodas, pascua y
 * navidad) tienen una única categoría, y dibujarla como una tarjeta de un
 * tercio dejaba dos tercios de fila en blanco: parecía que la página estaba
 * rota o que faltaba algo por cargar. Aquí ocupa el ancho entero con la foto
 * apaisada a un lado, así que el hueco se aprovecha en vez de disimularse y
 * esas tres colecciones ganan presencia en lugar de parecer restos.
 */
export function TarjetaCategoriaAncha({
  categoria,
  oscuro = false,
}: {
  categoria: Categoria;
  /** Igual que en TarjetaCategoria: texto claro para fondos oscuros. */
  oscuro?: boolean;
}) {
  const desde = Math.min(...categoria.lineas.map(precioMinimo));

  return (
    <article className="group">
      <Link
        href={categoria.href}
        className={`grid items-center gap-8 rounded-pieza border p-4 transition-colors sm:grid-cols-[minmax(0,24rem)_1fr] sm:gap-10 sm:p-6 ${
          oscuro
            ? 'border-cream/20 bg-white-warm/5 hover:border-gold-light hover:bg-white-warm/10'
            : 'border-sand bg-cream/40 hover:border-gold-deep hover:bg-cream/70'
        }`}
      >
        <div className="overflow-hidden rounded-pieza bg-cream">
          <Image
            src={categoria.portada.src}
            alt={categoria.portada.alt}
            width={categoria.portada.ancho}
            height={categoria.portada.alto}
            sizes="(max-width: 640px) 92vw, 384px"
            quality={90}
            className="aspect-4/3 w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
          />
        </div>

        <div>
          <h3
            className={`font-display text-[2rem] font-semibold ${oscuro ? 'text-white-warm' : ''}`}
          >
            {categoria.nombre}
          </h3>
          <p
            className={`mt-2 max-w-prose text-lg leading-relaxed ${oscuro ? 'text-cream/75' : 'text-ink-soft'}`}
          >
            {categoria.resumen}
          </p>
          <p className="mt-5 flex items-baseline gap-2">
            <span
              className={`font-display text-xl font-bold ${oscuro ? 'text-gold-light' : 'text-verde'}`}
            >
              desde {formatearPrecio(desde)}
            </span>
            <span className={oscuro ? 'text-cream/40' : 'text-ink-soft/50'}>·</span>
            <span className={`text-sm ${oscuro ? 'text-cream/75' : 'text-ink-soft'}`}>
              {categoria.totalPiezas} {categoria.totalPiezas === 1 ? 'modelo' : 'modelos'}
            </span>
          </p>
          <p
            className={`mt-4 inline-flex items-center gap-2 border-b pb-0.5 text-sm font-medium transition-colors ${
              oscuro
                ? 'border-gold-light/30 text-gold-light group-hover:border-gold-light'
                : 'border-verde/25 text-verde group-hover:border-verde'
            }`}
          >
            Ver nuestros modelos
            <IconoFlecha
              className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${oscuro ? 'text-gold-light' : 'text-gold-deep'}`}
            />
          </p>
        </div>
      </Link>
    </article>
  );
}

export function TarjetaCategoria({
  categoria,
  oscuro = false,
}: {
  categoria: Categoria;
  /** Para cuando la tarjeta cae sobre un fondo oscuro (carbón, oliva oscuro):
   * cambia el texto a tonos claros para que siga cumpliendo contraste AA. */
  oscuro?: boolean;
}) {
  const desde = Math.min(...categoria.lineas.map(precioMinimo));

  return (
    <article className="group">
      <Link href={categoria.href} className="block focus-visible:outline-offset-6">
        <div className="overflow-hidden rounded-pieza bg-cream">
          <Image
            src={categoria.portada.src}
            alt={categoria.portada.alt}
            width={categoria.portada.ancho}
            height={categoria.portada.alto}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 380px"
            quality={90}
            className="aspect-4/5 w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
          />
        </div>

        <div className="mt-5">
          <h3
            className={`font-display text-[1.7rem] font-semibold ${oscuro ? 'text-white-warm' : ''}`}
          >
            {categoria.nombre}
          </h3>
          <p className={`mt-1.5 leading-relaxed ${oscuro ? 'text-cream/75' : 'text-ink-soft'}`}>
            {categoria.resumen}
          </p>

          <p className="mt-4 flex items-baseline gap-2 text-sm">
            <span
              className={`font-display text-lg font-bold ${oscuro ? 'text-gold-light' : 'text-verde'}`}
            >
              desde {formatearPrecio(desde)}
            </span>
            <span className={oscuro ? 'text-cream/40' : 'text-ink-soft/50'}>·</span>
            <span className={oscuro ? 'text-cream/75' : 'text-ink-soft'}>
              {categoria.totalPiezas} {categoria.totalPiezas === 1 ? 'modelo' : 'modelos'}
            </span>
          </p>

          {/* «Ver nuestros modelos» es literalmente el botón que él puso bajo cada
              colección en su WordPress. Antes aquí solo había una flecha, y una
              flecha no dice a dónde lleva: en un catálogo, el enlace que más se
              pulsa merece estar escrito. */}
          <p
            className={`mt-3 inline-flex items-center gap-2 border-b pb-0.5 text-sm font-medium transition-colors ${
              oscuro
                ? 'border-gold-light/30 text-gold-light group-hover:border-gold-light'
                : 'border-verde/25 text-verde group-hover:border-verde'
            }`}
          >
            Ver nuestros modelos
            <IconoFlecha
              className={`h-4 w-4 transition-transform group-hover:translate-x-1 ${oscuro ? 'text-gold-light' : 'text-gold-deep'}`}
            />
          </p>
        </div>
      </Link>
    </article>
  );
}
