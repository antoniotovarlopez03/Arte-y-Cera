import { lineas } from '@/lib/catalogo';
import type { Linea } from '@/lib/catalogo/esquemas';

/**
 * Dibuja la pieza que se está mirando junto a la otra medida del catálogo, a
 * escala real entre ellas.
 *
 * Por qué: «70 × 7 cm» no se lo imagina nadie. Un cirio pascual es más alto que
 * un niño de tres años y una vela de mesa cabe en la palma de la mano, y esa
 * diferencia (3,5 veces) es justo lo que hay entre pagar 55 € y pagar 260 €.
 * Verlo evita el «pensaba que era más grande» cuando llega el paquete.
 *
 * Solo se dibujan las líneas con `dimensiones` en el catálogo. Hoy son los
 * cirios y las velas de mesa; las de bautizo no tienen medida declarada y no se
 * inventa: cuando el taller la dé, entran solas sin tocar este archivo.
 */

/** Una referencia por tamaño distinto, la primera que aparezca en el catálogo. */
function referencias(): Linea[] {
  const vistas = new Set<string>();
  return lineas.filter((l) => {
    if (!l.dimensiones) return false;
    const clave = `${l.dimensiones.alto}x${l.dimensiones.diametro}`;
    if (vistas.has(clave)) return false;
    vistas.add(clave);
    return true;
  });
}

export function EscalaDePiezas({ linea }: { linea: Linea }) {
  if (!linea.dimensiones) return null;

  const piezas = referencias();
  if (piezas.length < 2) return null;

  const altoMaximo = Math.max(...piezas.map((p) => p.dimensiones!.alto));
  /* Altura del dibujo en píxeles para la pieza más alta. El resto sale por
     regla de tres, que es lo que hace que la comparación sea honesta. */
  const ALTO_DIBUJO = 190;
  const aPixeles = (cm: number) => (cm / altoMaximo) * ALTO_DIBUJO;

  return (
    <figure className="mt-6 rounded-pieza border border-sand bg-cream/40 p-5">
      <figcaption className="rotulo">Tamaño real, comparado</figcaption>

      {/* Sin altura fija en el contenedor: las barras ya la traen, y fijarla aquí
          hacía que la columna (barra + etiqueta) desbordara hacia arriba y se
          comiera el rótulo. */}
      <div className="mt-5 flex items-end gap-8">
        {piezas.map((p) => {
          const esta = p.dimensiones!.alto === linea.dimensiones!.alto;
          const alto = aPixeles(p.dimensiones!.alto);
          const ancho = aPixeles(p.dimensiones!.diametro);

          return (
            <div key={p.slug + p.categoria.slug} className="flex flex-col items-center gap-2">
              {/* La vela: un rectángulo con la punta redondeada arriba. Se dibuja
                  con divs y no con SVG porque son dos rectángulos: no hace falta
                  más. La que se está mirando va en verde y las demás en arena,
                  para que se vea de un vistazo cuál es cuál. */}
              <div
                aria-hidden="true"
                className={`rounded-t-full ${esta ? 'bg-verde' : 'bg-sand'}`}
                style={{ height: `${alto}px`, width: `${Math.max(ancho, 10)}px` }}
              />
              {/* nowrap: la columna es tan estrecha como la vela (el cirio mide
                  19 px de ancho a esta escala) y «20 cm» se partía en dos. */}
              <p
                className={`text-center text-xs whitespace-nowrap ${esta ? 'font-medium text-verde' : 'text-ink-soft'}`}
              >
                {p.dimensiones!.alto} cm
              </p>
            </div>
          );
        })}

        {/* No se repite aquí la medida: ya está arriba, en la caja del precio, y
            además las barras la llevan escrita debajo. Decirla por tercera vez
            no añadía nada (y hacía ambiguo el test que la buscaba). */}
        <p className="self-center text-sm leading-relaxed text-ink-soft">
          A escala, junto a {piezas.length === 2 ? 'la otra medida' : 'las otras medidas'} del
          catálogo.
        </p>
      </div>
    </figure>
  );
}
