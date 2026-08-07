import type { DatosFormulario } from '@/lib/contacto';
import { site, whatsappUrl } from '@/lib/site';

/** La pieza que se muestra en el correo cuando quien escribe da una
 *  referencia válida (ver acciones.ts, que la busca con piezaPorRef). */
export type PiezaElegida = {
  ref: string;
  src: string;
  alt: string;
  ancho: number;
  alto: number;
  href: string;
};

/** URL absoluta para las imágenes del correo.
 *
 * site.url (arteycera.es) es correcto para SEO, pero ese dominio todavía no
 * apunta a este despliegue — hoy mismo dejaría el logo y la foto rotos en
 * el correo. VERCEL_PROJECT_PRODUCTION_URL es el dominio de Vercel que sí
 * sirve esta web ahora mismo (Vercel lo inyecta solo); cuando arteycera.es
 * apunte aquí, esto se puede quitar y usar site.url directamente. */
function urlImagenCorreo(ruta: string): string {
  const base = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : site.url;
  return new URL(ruta, base).toString();
}

/* ============================================================
   Plantillas de email en HTML.

   Los correos de texto plano de lib/contacto.ts se quedan como
   alternativa (Resend los manda junto al HTML, es lo que hacen los
   clientes de correo que no muestran HTML). Esto es la versión con la
   misma identidad visual de la web: los mismos tres colores de la
   paleta (verde, morado, dorado) sobre marfil.

   Todo con tablas y estilos en línea porque es lo único que Outlook de
   escritorio soporta de verdad: no lee <style> de forma fiable ni
   flexbox/grid. Los bordes redondeados y la sombra sí están en CSS
   normal, pero se degradan sin problema en Outlook (esquinas rectas,
   sin sombra) — no rompen nada, solo se ven algo menos finos ahí.
   ============================================================ */

const COLOR = {
  verde: '#14453d',
  morado: '#1c1024',
  dorado: '#c9a463',
  doradoProfundo: '#9c7a3a',
  marfil: '#faf7f0',
  texto: '#0f0d0b',
  textoSuave: '#4a4038',
  whatsapp: '#0f7a40',
} as const;

/** Nunca se interpola texto de quien rellena el formulario sin pasar por
 *  aquí: es HTML de verdad, no texto plano, así que sin escapar esto sería
 *  una inyección de HTML abierta a cualquiera que rellene el formulario. */
function escaparHtml(valor: string): string {
  return valor
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Igual que escaparHtml, pero conservando los saltos de línea del mensaje
 *  (un <textarea> los tiene; un <div> los ignora si no se convierten). */
function escaparHtmlConSaltos(valor: string): string {
  return escaparHtml(valor).replace(/\n/g, '<br>');
}

function cabecera(): string {
  const logo = urlImagenCorreo('/images/logo/logo.png');
  return `
  <tr>
    <td bgcolor="${COLOR.verde}" style="background-color:${COLOR.verde};border-radius:16px 16px 0 0;padding:36px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td align="center">
            <img src="${logo}" width="52" height="52" alt="Arte y Cera" style="display:block;margin:0 auto 14px;border:0;border-radius:50%;">
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:22px;letter-spacing:0.04em;color:${COLOR.marfil};">
              Arte <span style="color:${COLOR.dorado};">&amp;</span> Cera
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="line-height:3px;font-size:0;background-color:${COLOR.dorado};">&nbsp;</td>
  </tr>`;
}

function pie(): string {
  return `
  <tr>
    <td bgcolor="${COLOR.verde}" style="background-color:${COLOR.verde};border-radius:0 0 16px 16px;padding:32px 40px;text-align:center;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${COLOR.marfil};margin:0 0 10px;">Arte &amp; Cera</div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:2;color:#f6f1e7bf;">
        <a href="mailto:${site.email}" style="color:${COLOR.dorado};text-decoration:none;">${site.email}</a>
        &nbsp;·&nbsp;
        <a href="${site.url}" style="color:${COLOR.dorado};text-decoration:none;">arteycera.es</a>
        &nbsp;·&nbsp;
        <a href="${site.instagram.url}" style="color:${COLOR.dorado};text-decoration:none;">${site.instagram.usuario}</a>
        &nbsp;·&nbsp;
        <a href="${whatsappUrl()}" style="color:${COLOR.dorado};text-decoration:none;">WhatsApp</a>
      </div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#f6f1e773;margin-top:16px;">
        © ${new Date().getFullYear()} Arte y Cera. Hecho a mano en España.
      </div>
    </td>
  </tr>`;
}

function boton(texto: string, href: string, colorFondo: string, colorTexto: string): string {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
    <tr>
      <td align="center" bgcolor="${colorFondo}" style="background-color:${colorFondo};border-radius:999px;">
        <a href="${escaparHtml(href)}" target="_blank" class="boton-movil" style="display:inline-block;padding:14px 30px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:bold;color:${colorTexto};text-decoration:none;letter-spacing:0.02em;">
          ${escaparHtml(texto)}
        </a>
      </td>
    </tr>
  </table>`;
}

/** Una fila «etiqueta arriba, valor debajo», con una línea dorada muy fina
 *  como separador. Es el «icono discreto» pedido: en vez de pictogramas
 *  (que la mitad de los clientes de correo no cargan bien), la etiqueta en
 *  versalitas doradas hace el mismo papel sin arriesgar la compatibilidad. */
function filaDetalle(etiqueta: string, valorHtml: string, esUltima: boolean): string {
  return `
  <tr>
    <td style="padding:14px 0;${esUltima ? '' : `border-bottom:1px solid #c9a46340;`}">
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${COLOR.doradoProfundo};">${escaparHtml(etiqueta)}</div>
      <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:${COLOR.texto};margin-top:4px;">${valorHtml}</div>
    </td>
  </tr>`;
}

/** La foto de la pieza elegida, cuando quien escribe ha dado una referencia
 *  válida. Es una imagen real del catálogo (no una genérica), con su
 *  proporción real — igual que en la ficha de producto de la web. */
function bloquePieza(pieza: PiezaElegida): string {
  const alturaMostrada = Math.round((320 * pieza.alto) / pieza.ancho);
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #c9a46355;border-radius:14px;">
    <tr>
      <td align="center" style="padding:20px;">
        <img src="${urlImagenCorreo(pieza.src)}" width="320" height="${alturaMostrada}" alt="${escaparHtml(pieza.alt)}" style="display:block;width:100%;max-width:320px;height:auto;border:0;border-radius:10px;">
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:0.08em;color:${COLOR.doradoProfundo};margin-top:12px;">${escaparHtml(pieza.ref)}</div>
        <a href="${urlImagenCorreo(pieza.href)}" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${COLOR.verde};text-decoration:underline;">Ver esta pieza en la web</a>
      </td>
    </tr>
  </table>`;
}

function tarjetaFilas(filas: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #c9a46355;border-radius:14px;">
    <tr>
      <td style="padding:6px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          ${filas}
        </table>
      </td>
    </tr>
  </table>`;
}

function envoltura(preheader: string, contenido: string): string {
  return `<!DOCTYPE html>
<html lang="es" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<style>
  body,table,td{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt;}
  img{-ms-interpolation-mode:bicubic;border:0;outline:none;text-decoration:none;}
  body{margin:0;padding:0;width:100% !important;}
  @media screen and (max-width:600px){
    .contenedor{width:100% !important;}
    .pad-movil{padding-left:20px !important;padding-right:20px !important;}
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:${COLOR.dorado};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${escaparHtml(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.dorado}" style="background-color:${COLOR.dorado};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <!--[if mso]>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" align="center"><tr><td>
        <![endif]-->
        <table role="presentation" class="contenedor" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
          ${contenido}
        </table>
        <!--[if mso]>
        </td></tr></table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Email al cliente: confirma que su solicitud ha llegado y resume lo que
 *  ha contado, con la identidad de la web (no el texto plano de antes). */
export function cuerpoHtmlConfirmacionCliente(
  datos: Omit<DatosFormulario, 'trampa'>,
  pieza?: PiezaElegida,
): string {
  const filas: Array<[string, string]> = [
    ['Interés', datos.interes ? escaparHtml(datos.interes) : 'Todavía sin decidir'],
    ...(datos.fecha ? ([['Fecha de la celebración', escaparHtml(datos.fecha)]] as [string, string][]) : []),
    ['Nombre', escaparHtml(datos.nombre)],
    ...(datos.telefono ? ([['Teléfono', escaparHtml(datos.telefono)]] as [string, string][]) : []),
    ['Correo electrónico', escaparHtml(datos.email)],
    ['Mensaje', escaparHtmlConSaltos(datos.mensaje)],
  ];
  const filasHtml = filas
    .map(([etiqueta, valor], i) => filaDetalle(etiqueta, valor, i === filas.length - 1))
    .join('');

  const contenido = `
  ${cabecera()}
  <tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:44px 40px 8px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.3;color:${COLOR.verde};margin:0 0 18px;">
        Gracias por contactar con Arte &amp; Cera.
      </div>
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${COLOR.textoSuave};margin:0 0 8px;">
        Hola ${escaparHtml(datos.nombre)}.
      </p>
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.7;color:${COLOR.textoSuave};margin:0;">
        Hemos recibido correctamente tu solicitud. En menos de 48 horas nos pondremos en contacto contigo para ayudarte a preparar tu pedido.
      </p>
    </td>
  </tr>
  <tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:24px 40px 8px;">
      ${tarjetaFilas(filasHtml)}
    </td>
  </tr>
  ${
    pieza
      ? `<tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:8px 40px 8px;">
      ${bloquePieza(pieza)}
    </td>
  </tr>`
      : ''
  }
  <tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:28px 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLOR.verde};border-radius:14px;">
        <tr>
          <td style="padding:28px 32px;text-align:center;">
            <p style="font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6;color:${COLOR.marfil};margin:0 0 18px;">
              Si tu consulta es urgente también puedes escribirnos directamente por WhatsApp.
            </p>
            ${boton('Hablar por WhatsApp', whatsappUrl(`Hola, os escribí desde la web (${datos.nombre}).`), COLOR.whatsapp, '#ffffff')}
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:28px 40px 8px;text-align:center;">
      <p style="font-family:Georgia,'Times New Roman',serif;font-style:italic;font-size:15px;line-height:1.7;color:${COLOR.textoSuave};margin:0;">
        Todas nuestras piezas se pintan completamente a mano.<br>Cada vela es única. No utilizamos impresión.
      </p>
    </td>
  </tr>
  <tr>
    <td bgcolor="${COLOR.marfil}" style="background-color:${COLOR.marfil};padding:28px 0 0;">
      <img src="${urlImagenCorreo('/images/logo/email-banner.jpg')}" width="600" alt="Detalle de una vela pintada a mano por Arte y Cera" style="display:block;width:100%;max-width:600px;height:auto;border:0;">
    </td>
  </tr>
  <tr>
    <td bgcolor="${COLOR.marfil}" style="background-color:${COLOR.marfil};line-height:28px;font-size:0;">&nbsp;</td>
  </tr>
  ${pie()}`;

  return envoltura(
    'Hemos recibido tu solicitud. Te contestamos en menos de 48 h.',
    contenido,
  );
}

/** Email al taller: avisa de una solicitud nueva, con los mismos datos que
 *  el texto plano pero maquetados como tarjeta, y el mensaje del cliente
 *  resaltado en morado para que se distinga del resto de un vistazo. */
export function cuerpoHtmlNotificacionNegocio(
  datos: Omit<DatosFormulario, 'trampa'>,
  meta: { ip?: string; enviadoEn: Date },
  pieza?: PiezaElegida,
): string {
  const fecha = meta.enviadoEn.toLocaleString('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Madrid',
  });

  const filas: Array<[string, string]> = [
    ['Nombre', escaparHtml(datos.nombre)],
    ['Correo', escaparHtml(datos.email)],
    ...(datos.telefono ? ([['Teléfono', escaparHtml(datos.telefono)]] as [string, string][]) : []),
    ['Producto', datos.interes ? escaparHtml(datos.interes) : 'Sin especificar'],
    ...(datos.fecha ? ([['Fecha de la celebración', escaparHtml(datos.fecha)]] as [string, string][]) : []),
    ['Hora de envío', escaparHtml(fecha)],
    ...(meta.ip ? ([['IP', escaparHtml(meta.ip)]] as [string, string][]) : []),
  ];
  const filasHtml = filas
    .map(([etiqueta, valor], i) => filaDetalle(etiqueta, valor, i === filas.length - 1))
    .join('');

  const botones = [
    boton(
      'Responder por correo',
      `mailto:${datos.email}?subject=${encodeURIComponent('Re: tu solicitud en Arte y Cera')}`,
      COLOR.verde,
      '#ffffff',
    ),
    datos.telefono
      ? boton('Llamar', `tel:${datos.telefono.replace(/\s+/g, '')}`, COLOR.morado, '#ffffff')
      : null,
    datos.telefono
      ? boton(
          'WhatsApp',
          whatsappUrl(`Hola ${datos.nombre}, te escribimos desde Arte y Cera por tu solicitud.`),
          COLOR.whatsapp,
          '#ffffff',
        )
      : null,
  ]
    .filter((b): b is string => b !== null)
    .map((b) => `<tr><td style="padding-bottom:10px;">${b}</td></tr>`)
    .join('');

  const contenido = `
  ${cabecera()}
  <tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:44px 40px 8px;">
      <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.3;color:${COLOR.verde};margin:0;">
        Ha llegado una nueva solicitud desde la web.
      </div>
    </td>
  </tr>
  <tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:24px 40px 8px;">
      ${tarjetaFilas(filasHtml)}
    </td>
  </tr>
  ${
    pieza
      ? `<tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:8px 40px 8px;">
      ${bloquePieza(pieza)}
    </td>
  </tr>`
      : ''
  }
  <tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:8px 40px 8px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${COLOR.morado};border-radius:14px;">
        <tr>
          <td style="padding:24px 28px;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${COLOR.dorado};margin:0 0 10px;">Mensaje</div>
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.7;color:${COLOR.marfil};">${escaparHtmlConSaltos(datos.mensaje)}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td bgcolor="${COLOR.marfil}" class="pad-movil" style="background-color:${COLOR.marfil};padding:24px 40px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${botones}
      </table>
    </td>
  </tr>
  ${pie()}`;

  return envoltura(`Nueva solicitud de ${datos.nombre} desde la web.`, contenido);
}
