/**
 * Campañas de temporada que aparecen en lo alto de la portada.
 *
 * Para activar o apagar una campaña solo hay que tocar sus fechas (formato
 * AAAA-MM-DD, hora de Madrid, ambas incluidas). Fuera de ellas no se pinta
 * nada y la portada queda exactamente como el resto del año.
 *
 * La portada se regenera sola cada hora (ver `revalidate` en app/page.tsx),
 * así que la campaña se enciende y se apaga en su fecha sin volver a publicar.
 */
export const CAMPANA_NAVIDAD = {
  desde: '2026-11-10',
  hasta: '2027-01-06',
  /** Las piezas que se enseñan, por su referencia del catálogo. */
  refs: ['NV-14', 'NV-15', 'NV-16'],
  rotulo: 'Edición de Navidad',
  titulo: 'Ya llega la Navidad',
  subtitulo: 'Encarga tu vela',
  texto:
    'Tres escenas nuevas hechas a mano, una a una, para presidir la mesa de Nochebuena o regalar a quien más quieres.',
} as const;

/** Fecha de hoy en Madrid, en formato AAAA-MM-DD (comparable como texto). */
function hoyEnMadrid(): string {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Madrid' });
}

export function campanaActiva(campana: { desde: string; hasta: string }): boolean {
  const hoy = hoyEnMadrid();
  return hoy >= campana.desde && hoy <= campana.hasta;
}
