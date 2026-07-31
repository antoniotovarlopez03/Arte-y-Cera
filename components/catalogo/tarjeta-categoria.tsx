import Image from 'next/image';
import Link from 'next/link';
import { IconoFlecha } from '@/components/iconos';
import { formatearPrecio, precioMinimo } from '@/lib/catalogo';
import type { Categoria } from '@/lib/catalogo/esquemas';

export function TarjetaCategoria({ categoria }: { categoria: Categoria }) {
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
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px"
            quality={90}
            className="aspect-4/5 w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
          />
        </div>

        <div className="mt-4">
          <h3 className="font-display text-xl font-semibold">{categoria.nombre}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{categoria.resumen}</p>
          <p className="mt-3 flex items-center gap-2 text-sm">
            <span className="font-display font-bold text-verde">
              desde {formatearPrecio(desde)}
            </span>
            <span className="text-ink-soft/60">·</span>
            <span className="text-ink-soft">
              {categoria.totalPiezas} {categoria.totalPiezas === 1 ? 'modelo' : 'modelos'}
            </span>
            <IconoFlecha className="ml-auto h-4 w-4 text-gold-deep transition-transform group-hover:translate-x-1" />
          </p>
        </div>
      </Link>
    </article>
  );
}
