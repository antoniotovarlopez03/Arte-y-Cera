import { IconoEnvio } from '@/components/iconos';
import { site } from '@/lib/site';

/**
 * Franja fina encima de la cabecera, en todas las páginas.
 *
 * El envío a toda España es lo que decide a quien llega desde Valencia o
 * desde Bilbao buscando una vela de bautizo: si no lo ve al entrar, da por
 * hecho que es una tienda de Granada y se va. Antes solo aparecía en letra
 * pequeña bajo los botones de la portada y en el pie.
 *
 * No es pegajosa: se va con el primer scroll y deja sitio a la cabecera.
 */
export function BarraEnvios() {
  return (
    <p className="flex items-center justify-center gap-2 bg-dorado px-4 py-1.5 text-center text-xs font-medium tracking-[0.04em] text-verde-profundo sm:text-[0.8rem]">
      <IconoEnvio className="h-4 w-4 shrink-0" />
      <span>
        Pintadas a mano en {site.taller.ciudad} · <strong className="font-semibold">{site.zona}</strong>
      </span>
    </p>
  );
}
