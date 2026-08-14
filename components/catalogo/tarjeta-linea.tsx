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
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px"
            quality={90}
            className="aspect-4/5 w-full object-cover transition-transform duration-700 ease-suave group-hover:scale-[1.04]"
          />
        </div>

        <div className="mt-5">
          {mostrarCategoria && <p className="rotulo">{linea.categoria.nombre}</p>}
          <h3 className="mt-1 font-display text-[1.7rem] font-semibold">{linea.nombre}</h3>
          {/* El resumen de cada acabado está escrito para compararse con el de sus
              hermanos: es aquí donde alguien decide entre 30 € y 40 €. */}
          <p className="mt-1.5 leading-relaxed text-dorado/75">{linea.resumen}</p>
        </div>
      </Link>

      <div className="mt-5 flex items-end justify-between gap-4">
        <Precio precios={linea.precios} nota={linea.notaPrecio} />
        <Link
          href={linea.href}
          className="flex shrink-0 items-center gap-1.5 border-b border-blanco/25 pb-0.5 text-sm font-medium text-blanco hover:border-blanco"
        >
          Ver los {linea.piezas.length} modelos
          <IconoFlecha className="h-4 w-4 text-blanco transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
