import Image from 'next/image';
import Link from 'next/link';
import { Precio } from '@/components/catalogo/precio';
import { IconoFlecha } from '@/components/iconos';
import type { Categoria } from '@/lib/catalogo/esquemas';

/**
 * Los acabados de una colección, en fila y comparables de un vistazo.
 *
 * Por qué existe: en las velas de bautizo hay cuatro precios (20, 30, 35 y
 * 40 €) y hasta ahora, para saber qué cambia entre ellos, había que entrar y
 * salir de cuatro fichas recordando de memoria lo que se acababa de ver. Es la
 * duda número uno de quien compra —«¿qué me llevo por 10 € más?»— y es también
 * como lo tenía Antonio en su WordPress, con los cuatro en la misma página.
 *
 * No hace falta contenido nuevo: los `resumen` del catálogo ya están escritos
 * para compararse entre sí (todos dicen cuánta pintura lleva la pieza, de la
 * cera a la vista a la vela cubierta de arriba abajo).
 *
 * La ficha de cada acabado sigue existiendo y sigue siendo donde está el
 * detalle; esto es el paso previo, el que ayuda a elegir.
 */
export function ComparadorAcabados({ categoria }: { categoria: Categoria }) {
  return (
    <ol className="mt-8 space-y-4">
      {categoria.lineas.map((linea, i) => (
        <li key={linea.slug}>
          <Link
            href={linea.href}
            className="group grid grid-cols-[5.5rem_1fr] items-center gap-5 rounded-pieza border border-sand bg-cream/40 p-4 transition-colors hover:border-gold-deep hover:bg-cream/70 sm:grid-cols-[7rem_1fr_auto] sm:gap-7 sm:p-5"
          >
            <Image
              src={linea.portada.src}
              alt={linea.portada.alt}
              width={linea.portada.ancho}
              height={linea.portada.alto}
              sizes="112px"
              quality={90}
              className="aspect-4/5 w-full rounded-lg object-cover"
            />

            <div className="min-w-0">
              <p className="flex items-baseline gap-2.5">
                {/* El número ordena la escala: quien mira sabe que va de menos a
                    más pintura, no que son cuatro opciones sueltas. */}
                <span
                  aria-hidden="true"
                  className="font-display text-sm font-bold text-gold-deep"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-xl font-semibold text-verde sm:text-2xl">
                  {linea.nombre}
                </span>
              </p>
              <p className="mt-1 leading-relaxed text-ink-soft">{linea.resumen}</p>

              {/* En móvil el precio va debajo; en escritorio, en su columna. */}
              <div className="mt-3 sm:hidden">
                <Precio precios={linea.precios} nota={linea.notaPrecio} />
              </div>
            </div>

            <div className="hidden shrink-0 text-right sm:block">
              <Precio precios={linea.precios} nota={linea.notaPrecio} />
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-verde">
                Ver los {linea.piezas.length}
                <IconoFlecha className="h-4 w-4 text-gold-deep transition-transform group-hover:translate-x-1" />
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ol>
  );
}
