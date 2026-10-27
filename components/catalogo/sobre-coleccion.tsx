import { PreguntasFrecuentes } from '@/components/catalogo/preguntas-frecuentes';
import { preguntasDeCategoria } from '@/lib/catalogo/preguntas';
import type { Categoria } from '@/lib/catalogo/esquemas';

/**
 * Texto largo y preguntas frecuentes al pie de una colección.
 *
 * El titular repite el de Google («Velas de bautizo personalizadas») y no el
 * nombre corto de la colección: es la búsqueda que tiene que ganar esta
 * página, y hasta ahora solo lo decían el <title> y la descripción.
 */
export function SobreColeccion({ categoria }: { categoria: Categoria }) {
  const preguntas = preguntasDeCategoria(categoria);

  return (
    <section className="mt-24 grid gap-12 lg:grid-cols-2 lg:gap-16" aria-labelledby="titulo-sobre">
      <div>
        <h2 id="titulo-sobre" className="font-display text-[1.9rem] leading-tight font-semibold">
          {categoria.seo.titulo}
        </h2>
        <span className="filete mt-5" />
        <div className="mt-6 space-y-4 text-base leading-relaxed text-dorado">
          {categoria.texto.map((parrafo) => (
            <p key={parrafo.slice(0, 40)}>{parrafo}</p>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-[1.9rem] leading-tight font-semibold">
          Preguntas frecuentes
        </h2>
        <span className="filete mt-5" />
        <div className="mt-6">
          <PreguntasFrecuentes preguntas={preguntas} />
        </div>
      </div>
    </section>
  );
}
