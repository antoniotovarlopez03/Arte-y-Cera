import type { Pregunta } from '@/content/preguntas';

/**
 * Lista de preguntas plegables. Con <details> nativo: se abre sin JavaScript,
 * funciona con teclado y el texto de las respuestas está en el HTML aunque
 * esté cerrado, que es lo que lee Google.
 */
export function PreguntasFrecuentes({ preguntas }: { preguntas: Pregunta[] }) {
  return (
    <div className="divide-y divide-cream/15 border-y border-cream/15">
      {preguntas.map(({ pregunta, respuesta }) => (
        <details key={pregunta} className="group py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-lg font-semibold text-blanco [&::-webkit-details-marker]:hidden">
            {pregunta}
            <span
              aria-hidden="true"
              className="text-2xl leading-none text-dorado transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="max-w-prose pb-5 leading-relaxed text-dorado">{respuesta}</p>
        </details>
      ))}
    </div>
  );
}
