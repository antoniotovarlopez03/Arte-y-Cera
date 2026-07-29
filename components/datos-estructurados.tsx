/**
 * Inserta un bloque JSON-LD. Se usa <script type="application/ld+json"> con
 * el JSON serializado; no ejecuta nada en el navegador.
 */
export function DatosEstructurados({ datos }: { datos: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // El contenido lo genera lib/seo.ts a partir del catálogo, nunca viene
      // de una entrada del usuario.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(datos) }}
    />
  );
}
