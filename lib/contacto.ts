import { z } from 'zod';

/**
 * Validación del formulario de contacto. Vive aparte de la Server Action para
 * poder probarla sin levantar el servidor (ver tests/contacto.test.ts).
 */
export const EsquemaFormulario = z.object({
  nombre: z.string().trim().min(2, 'Dinos cómo te llamas').max(80),
  email: z.string().trim().email('Ese email no parece válido').max(120),
  telefono: z.string().trim().max(30).optional().or(z.literal('')),
  interes: z.string().trim().max(80).optional().or(z.literal('')),
  fecha: z.string().trim().max(30).optional().or(z.literal('')),
  referencia: z.string().trim().max(20).optional().or(z.literal('')),
  mensaje: z.string().trim().min(10, 'Cuéntanos un poco más (10 caracteres al menos)').max(3000),
  consentimiento: z.literal('si', { message: 'Necesitamos tu permiso para responderte' }),
  /** Campo trampa: oculto por CSS. Si viene relleno, es un robot. */
  trampa: z.string().max(0).optional().or(z.literal('')),
});

export type DatosFormulario = z.infer<typeof EsquemaFormulario>;

/** Primer error por campo, tal como los pinta el formulario. */
export function erroresPorCampo(error: z.ZodError): Record<string, string> {
  const errores: Record<string, string> = {};
  for (const problema of error.issues) {
    const campo = String(problema.path[0] ?? 'general');
    errores[campo] ??= problema.message;
  }
  return errores;
}

/** El correo que se envía al taller. Texto plano: se lee bien en el móvil. */
export function cuerpoDelCorreo(
  datos: Omit<DatosFormulario, 'trampa'>,
  meta?: { ip?: string; enviadoEn?: Date },
): string {
  return [
    `Nombre: ${datos.nombre}`,
    `Email: ${datos.email}`,
    datos.telefono ? `Teléfono: ${datos.telefono}` : null,
    datos.interes ? `Le interesa: ${datos.interes}` : null,
    datos.fecha ? `Fecha de la celebración: ${datos.fecha}` : null,
    datos.referencia ? `Referencia de la pieza: ${datos.referencia}` : null,
    meta?.enviadoEn
      ? `Enviado: ${meta.enviadoEn.toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Madrid' })}`
      : null,
    meta?.ip ? `IP: ${meta.ip}` : null,
    '',
    datos.mensaje,
  ]
    .filter((linea) => linea !== null)
    .join('\n');
}

/** La copia de cortesía que recibe quien rellena el formulario, confirmando
 *  qué nos ha contado. Texto plano, igual que el correo al taller. */
export function cuerpoConfirmacionCliente(datos: Omit<DatosFormulario, 'trampa'>): string {
  return [
    `Hola ${datos.nombre},`,
    '',
    'Gracias por escribirnos a Arte y Cera. Hemos recibido tu mensaje y te contestamos en menos de 48 h.',
    '',
    'Esto es lo que nos has contado:',
    datos.interes ? `Te interesa: ${datos.interes}` : null,
    datos.fecha ? `Fecha de la celebración: ${datos.fecha}` : null,
    datos.telefono ? `Teléfono: ${datos.telefono}` : null,
    datos.referencia ? `Referencia de la pieza: ${datos.referencia}` : null,
    '',
    datos.mensaje,
    '',
    'Si tienes prisa, también puedes escribirnos por WhatsApp.',
    '',
    'Un saludo,',
    'Arte y Cera',
  ]
    .filter((linea) => linea !== null)
    .join('\n');
}
