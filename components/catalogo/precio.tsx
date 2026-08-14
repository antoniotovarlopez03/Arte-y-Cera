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
}: {
  precios: PrecioFuente[];
  nota?: string;
  tamano?: 'normal' | 'grande';
  className?: string;
}) {
  const grande = tamano === 'grande';
  const colorPrecio = 'text-blanco';
  const colorTexto = 'text-dorado/70';

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
                className="h-px flex-1 border-b border-dotted border-cream/25"
                aria-hidden="true"
              />
              <span
                className={cx(
                  'font-display font-bold',
                  colorPrecio,
                  grande ? 'text-2xl' : 'text-lg',
                )}
              >
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
