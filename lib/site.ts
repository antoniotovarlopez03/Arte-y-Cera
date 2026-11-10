/**
 * Datos del negocio en un solo sitio.
 * Si cambia un teléfono o un correo, se cambia aquí y se propaga a toda la
 * web (cabecera, pie, contacto, datos estructurados de Google).
 */
export const site = {
  nombre: 'Arte y Cera',
  titulo: 'Arte y Cera · Velas hechas a mano con envío a toda España',
  descripcion:
    'Velas hechas a mano en Granada: velas de bautizo personalizadas, cirios pascuales, velas de boda y toallas bordadas. Hechas por encargo y con envíos a toda España.',
  // www, no el dominio pelado: arteycera.es (sin www) redirige (308) a este,
  // y esa URL es la base de la que salen el canonical, el og:image y demás
  // metadatos. Un rastreador que no siga esa redirección para la imagen (a
  // varios no les hace demasiada gracia) se queda sin previsualización —
  // justo lo que le pasaba a WhatsApp con este enlace y no con el de Vercel,
  // que no tiene ese salto de por medio.
  url: 'https://www.arteycera.es',

  email: 'contacto@arteycera.es',

  /** Solo dígitos, como lo quiere wa.me */
  whatsapp: '34667241539',
  whatsappVisible: '+34 667 24 15 39',

  instagram: {
    usuario: '@arte.y.cera',
    url: 'https://www.instagram.com/arte.y.cera/',
  },

  zona: 'Envíos a toda España',

  /** Dónde se pinta. Sale en la franja superior, en los textos de las
   *  colecciones y en los datos estructurados, para que Google sepa que es
   *  un taller de Granada que envía a todo el país. Sin calle a propósito:
   *  no se atiende al público. */
  taller: { ciudad: 'Granada', region: 'Andalucía', pais: 'ES' },
  tiempoRespuesta: 'Respuesta en menos de 48 h',

  /** Enlace directo al formulario de reseña de Google (Perfil de Empresa). */
  enlaceResena: 'https://g.page/r/CYxcpND7i-NAEBM/review',

  /** Proyecto de Microsoft Clarity. Solo se carga si el visitante acepta
   *  las cookies (ver lib/consentimiento.ts). */
  clarityId: 'z1rsnq1bcx',
} as const;

/**
 * Enlace de WhatsApp con el mensaje ya redactado.
 *
 * Es el canal por el que este negocio recibe de verdad los encargos, así que
 * en lugar de dejar al cliente escribiendo de cero le damos el mensaje hecho,
 * con la referencia de la pieza que está mirando. Ese es el motivo de que
 * cada foto del catálogo tenga un código.
 */
export function whatsappUrl(mensaje?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

/** mailto con asunto y cuerpo preparados, para quien no use WhatsApp. */
export function mailtoUrl(asunto: string, cuerpo?: string): string {
  const params = new URLSearchParams({ subject: asunto });
  if (cuerpo) params.set('body', cuerpo);
  return `mailto:${site.email}?${params.toString()}`;
}

/** Ruta interna a URL absoluta. Los correos no pueden usar rutas relativas:
 *  el cliente de correo carga las imágenes desde fuera de la web. */
export function urlAbsoluta(ruta: string): string {
  return new URL(ruta, site.url).toString();
}
