'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import { piezaPorRef } from '@/lib/catalogo';
import {
  cuerpoConfirmacionCliente,
  cuerpoDelCorreo,
  EsquemaFormulario,
  erroresPorCampo,
} from '@/lib/contacto';
import {
  cuerpoHtmlConfirmacionCliente,
  cuerpoHtmlNotificacionNegocio,
  type PiezaElegida,
} from '@/lib/email/plantillas';
import { site } from '@/lib/site';

/** Cuántas piezas como mucho se resuelven por mensaje. El formulario no deja
 *  añadir tantas, pero el campo llega como texto libre y esto evita que un
 *  envío manual a la Server Action arrastre un correo con cien fotos. */
const MAXIMO_PIEZAS = 10;

/** piezaPorRef lanza un error si la referencia no existe (es lo correcto
 *  cuando se usa con un código fijo del catálogo, como en la página de
 *  contacto). Aquí las referencias las escribe a mano quien rellena el
 *  formulario (una o varias, separadas por comas), así que un código mal
 *  escrito o inventado no debe tumbar el envío del correo: si no se
 *  encuentra, sencillamente esa no sale en la lista. */
function buscarPiezasSeguras(referencia: string | undefined): PiezaElegida[] {
  if (!referencia) return [];
  const refs = referencia
    .split(',')
    .map((r) => r.trim())
    .filter(Boolean)
    .slice(0, MAXIMO_PIEZAS);

  const piezas: PiezaElegida[] = [];
  for (const ref of refs) {
    try {
      const { pieza, linea } = piezaPorRef(ref);
      piezas.push({
        ref: pieza.ref,
        src: pieza.src,
        alt: pieza.alt,
        ancho: pieza.ancho,
        alto: pieza.alto,
        href: `${linea.href}?pieza=${pieza.ref}`,
      });
    } catch {
      // Referencia inventada o ya retirada del catálogo: se ignora.
    }
  }
  return piezas;
}

/* ============================================================
   Envío del formulario de contacto.

   La web original validaba el formulario y pintaba «¡Gracias! Tu mensaje se ha
   preparado», pero no enviaba nada a ningún sitio (legacy/js/script.js:688):
   todos los mensajes se perdían. Esto es lo que arregla ese agujero.
   ============================================================ */

export type EstadoEnvio =
  | { estado: 'inicial' }
  | { estado: 'ok' }
  | { estado: 'error'; mensaje: string; errores?: Record<string, string> }
  | { estado: 'sin-configurar'; mensaje: string };

/* Límite por IP: 5 mensajes por hora. Vive en memoria, así que en un servidor
   sin estado (Vercel) solo frena al que insiste dentro de la misma instancia.
   Es a propósito: sin base de datos, esto detiene el abuso tonto sin montar
   infraestructura. Si algún día llega spam de verdad, toca un Redis. */
const ENVIOS = new Map<string, number[]>();
const VENTANA_MS = 60 * 60 * 1000;
const MAXIMO = 5;

function demasiadosEnvios(ip: string): boolean {
  const ahora = Date.now();
  const previos = (ENVIOS.get(ip) ?? []).filter((t) => ahora - t < VENTANA_MS);
  if (previos.length >= MAXIMO) return true;
  previos.push(ahora);
  ENVIOS.set(ip, previos);
  return false;
}

export async function enviarFormulario(
  _anterior: EstadoEnvio,
  datos: FormData,
): Promise<EstadoEnvio> {
  const resultado = EsquemaFormulario.safeParse(Object.fromEntries(datos));

  if (!resultado.success) {
    return {
      estado: 'error',
      mensaje: 'Repasa los campos marcados.',
      errores: erroresPorCampo(resultado.error),
    };
  }

  const { trampa, ...formulario } = resultado.data;
  // Al robot se le responde «ok» para que no reintente. No se envía nada.
  if (trampa) return { estado: 'ok' };

  const cabeceras = await headers();
  const ip = (cabeceras.get('x-forwarded-for') ?? 'local').split(',')[0]!.trim();
  if (demasiadosEnvios(ip)) {
    return {
      estado: 'error',
      mensaje: `Has enviado varios mensajes seguidos. Escríbenos por WhatsApp al ${site.whatsappVisible} y te atendemos ahora mismo.`,
    };
  }

  const clave = process.env.RESEND_API_KEY;
  if (!clave) {
    // Sin clave configurada no se finge un envío correcto: se dice la verdad y
    // se ofrece el canal que sí funciona.
    console.warn('[contacto] Falta RESEND_API_KEY: el formulario no puede enviar correo.');
    return {
      estado: 'sin-configurar',
      mensaje: 'El envío por correo todavía no está configurado.',
    };
  }

  const remitente = process.env.CONTACTO_REMITENTE ?? 'Web Arte y Cera <web@arteycera.es>';
  const destino = process.env.CONTACTO_DESTINO ?? site.email;

  const enviadoEn = new Date();
  const metaEnvio = { ip: ip !== 'local' ? ip : undefined, enviadoEn };
  const piezas = buscarPiezasSeguras(formulario.referencia);

  try {
    const resend = new Resend(clave);
    const { error } = await resend.emails.send({
      from: remitente,
      to: [destino],
      replyTo: formulario.email,
      subject: `Nueva solicitud desde la web · ${formulario.nombre}`,
      text: cuerpoDelCorreo(formulario, metaEnvio),
      html: cuerpoHtmlNotificacionNegocio(
        formulario,
        { ip: metaEnvio.ip, enviadoEn: metaEnvio.enviadoEn },
        piezas,
      ),
    });

    if (error) {
      console.error('[contacto] Resend devolvió un error:', error);
      return {
        estado: 'error',
        mensaje: `No hemos podido enviar el mensaje. Escríbenos por WhatsApp al ${site.whatsappVisible} o a ${site.email}.`,
      };
    }

    // Copia de cortesía a quien escribe. Va aparte: el mensaje ya está en el
    // buzón del taller, así que si esta copia falla no se le dice a quien
    // escribe que algo ha ido mal, solo queda constancia en el log.
    try {
      const { error: errorConfirmacion } = await resend.emails.send({
        from: remitente,
        to: [formulario.email],
        replyTo: destino,
        subject: 'Hemos recibido tu solicitud · Arte y Cera',
        text: cuerpoConfirmacionCliente(formulario),
        html: cuerpoHtmlConfirmacionCliente(formulario, piezas),
      });
      if (errorConfirmacion) {
        console.error('[contacto] No se pudo enviar la confirmación al cliente:', errorConfirmacion);
      }
    } catch (errorConfirmacion) {
      console.error('[contacto] Fallo al enviar la confirmación al cliente:', errorConfirmacion);
    }

    return { estado: 'ok' };
  } catch (error) {
    console.error('[contacto] Fallo al enviar:', error);
    return {
      estado: 'error',
      mensaje: `No hemos podido enviar el mensaje. Escríbenos por WhatsApp al ${site.whatsappVisible} o a ${site.email}.`,
    };
  }
}
