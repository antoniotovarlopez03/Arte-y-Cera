/* ============================================================
   Datos del titular de la web.

   Sin esto, el aviso legal y la política de privacidad NO se pueden publicar:
   la LSSI (art. 10) obliga a identificar al responsable, y el RGPD a decir
   quién trata los datos del formulario.

   En cuanto Antonio pase su nombre o razón social, su NIF y un domicilio,
   se rellena aquí y las dos páginas quedan completas. Mientras haya algún
   null, las páginas muestran un aviso bien visible de que están incompletas.
   ============================================================ */

export const TITULAR = {
  /** Nombre y apellidos o razón social. */
  nombre: null as string | null,
  /** NIF / CIF. */
  nif: null as string | null,
  /** Domicilio a efectos de notificaciones. */
  direccion: null as string | null,
  /** Provincia para la sumisión a los tribunales. */
  provincia: null as string | null,
  /** Actividad, tal y como esté dada de alta. */
  actividad: 'Fabricación y venta de velas artesanales pintadas a mano',
} as const;

export function faltanDatosDelTitular(): boolean {
  return !TITULAR.nombre || !TITULAR.nif || !TITULAR.direccion;
}

/** Fecha de la última revisión de los textos legales. */
export const ULTIMA_REVISION = '29 de julio de 2026';
