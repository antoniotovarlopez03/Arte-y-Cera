import Image from 'next/image';
import Link from 'next/link';
import { IconoFlecha } from '@/components/iconos';
import { Precio } from '@/components/catalogo/precio';
import type { Linea } from '@/lib/catalogo/esquemas';

/** Tarjeta de una línea (Básicos, Elaborados…) dentro de una categoría. */
export function TarjetaLinea({
  linea,
  mostrarCategoria = false,
}: {
  linea: Linea;
  mostrarCategoria?: boolean;
}) {
  return (
    <article className="group flex flex-col">
      <Link href={linea.href} className="block focus-visible:outline-offset-6">
        <div className="overflow-hidden rounded-pieza bg-cream">
          <Image
            src={linea.portada.src}
            alt={linea.portada.alt}
            width={linea.portada.ancho}
            height={linea.portada.alto}
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 340px"
            quality={90}
            className="aspect-4/5 w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
          />
        </div>

        <div className="mt-4">
          {mostrarCategoria && (
            <p className="text-xs tracking-[0.14em] text-gold-ink uppercase">
              {linea.categoria.nombre}
            </p>
          )}
          <h3 className="mt-1 font-display text-xl font-semibold text-ink">{linea.nombre}</h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">{linea.resumen}</p>
        </div>
      </Link>

      <div className="mt-3 flex items-end justify-between gap-4">
        <Precio precios={linea.precios} nota={linea.notaPrecio} />
        <Link
          href={linea.href}
          className="flex items-center gap-1.5 pb-1 text-sm text-ink-soft hover:text-ink"
        >
          Ver las {linea.piezas.length}
          <IconoFlecha className="h-4 w-4 text-gold-deep transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
