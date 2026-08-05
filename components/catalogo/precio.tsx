import { formatearPrecio } from '@/lib/catalogo';
import type { PrecioFuente } from '@/lib/catalogo/esquemas';
import { cx } from '@/lib/ui';

/**
 * El precio, siempre visible.
 *
 * En la web original el precio estaba metido a mano en el HTML y en algunas
 * líneas simplemente no aparecía. Aquí es un dato del catálogo y se muestra
 * igual en todas partes: es lo primero que busca quien está comparando.
 */
export function Precio({
  precios,
  nota,
  tamano = 'normal',
  className,
  oscuro = false,
}: {
  precios: PrecioFuente[];
  nota?: string;
  tamano?: 'normal' | 'grande';
  className?: string;
  /** Texto claro, para cuando el precio cae sobre un fondo oscuro. */
  oscuro?: boolean;
}) {
  const grande = tamano === 'grande';
  const colorPrecio = oscuro ? 'text-gold-light' : 'text-verde';
  const colorTexto = oscuro ? 'text-cream/70' : 'text-ink-soft';

  return (
    <div className={className}>
      {precios.length === 1 && precios[0] ? (
        <p className={cx('font-display font-bold', colorPrecio, grande ? 'text-3xl' : 'text-xl')}>
          {precios[0].desde && <span className="text-base font-normal">desde </span>}
          {formatearPrecio(precios[0].importe)}
        </p>
      ) : (
        <ul className={cx('space-y-1', grande ? 'text-base' : 'text-sm')}>
          {precios.map((precio) => (
            <li key={precio.etiqueta ?? precio.importe} className="flex items-baseline gap-2">
              <span className={colorTexto}>{precio.etiqueta}</span>
              <span
                className={cx(
                  'h-px flex-1 border-b border-dotted',
                  oscuro ? 'border-cream/30' : 'border-sand',
                )}
                aria-hidden="true"
              />
              <span className={cx('font-display font-bold', colorPrecio, grande ? 'text-2xl' : 'text-lg')}>
                {formatearPrecio(precio.importe)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {nota && <p className={cx('mt-1.5 text-xs', colorTexto)}>{nota}</p>}
    </div>
  );
}
