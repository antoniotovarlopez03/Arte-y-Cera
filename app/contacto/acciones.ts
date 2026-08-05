'use server';

import { headers } from 'next/headers';
import { Resend } from 'resend';
import {
  cuerpoConfirmacionCliente,
  cuerpoDelCorreo,
  EsquemaFormulario,
  erroresPorCampo,
} from '@/lib/contacto';
import { site } from '@/lib/site';

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

  try {
    const resend = new Resend(clave);
    const { error } = await resend.emails.send({
      from: remitente,
      to: [destino],
      replyTo: formulario.email,
      subject: `Web: ${formulario.nombre}${formulario.interes ? ` · ${formulario.interes}` : ''}`,
      text: cuerpoDelCorreo(formulario, {
        ip: ip !== 'local' ? ip : undefined,
        enviadoEn: new Date(),
      }),
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
        subject: 'Hemos recibido tu mensaje · Arte y Cera',
        text: cuerpoConfirmacionCliente(formulario),
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
