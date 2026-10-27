import { PREGUNTA_ENVIO, type Pregunta } from '@/content/preguntas';
import type { Categoria } from '@/lib/catalogo/esquemas';

/** Las preguntas de una colección, con la del envío siempre al final. */
export function preguntasDeCategoria(categoria: Categoria): Pregunta[] {
  return [...categoria.preguntas, PREGUNTA_ENVIO];
}
