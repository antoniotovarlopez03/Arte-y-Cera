import { site } from '@/lib/site';

/* ============================================================
   PREGUNTAS FRECUENTES GENERALES

   Salen en la portada y, la del envío, también al pie de cada colección.
   Las de cada colección están en content/catalogo.ts, junto a su texto.

   Ni el coste del envío ni el plazo de entrega llevan cifra: dependen de
   cada encargo y el taller no los tiene fijados. Cuando los haya, se
   cambian aquí y aparecen en toda la web.
   ============================================================ */

export type Pregunta = { pregunta: string; respuesta: string };

export const PREGUNTA_ENVIO: Pregunta = {
  pregunta: '¿Enviáis a toda España?',
  respuesta: `Sí. Pintamos cada pieza en nuestro taller de ${site.taller.ciudad} y la enviamos a cualquier punto de España, bien embalada para que llegue intacta. No hace falta que viváis cerca: casi todos los encargos se hacen por WhatsApp o por correo.`,
};

export const PREGUNTAS_GENERALES: Pregunta[] = [
  PREGUNTA_ENVIO,
  {
    pregunta: '¿Cuánto cuesta el envío y cuándo llega?',
    respuesta:
      'Depende de la pieza y del destino. Al concretar el encargo os decimos el coste del envío y la fecha en la que os llegará, para que esté en casa antes de la celebración.',
  },
  {
    pregunta: '¿Con cuánto tiempo tengo que encargarla?',
    respuesta:
      'Cada vela se pinta por encargo, así que cuanto antes, mejor. Escríbenos con la fecha de tu celebración y te confirmamos si llegamos. Para Navidad y para la Vigilia Pascual conviene pedir con más margen.',
  },
  {
    pregunta: '¿Puedo personalizar la vela?',
    respuesta:
      'Sí. Los colores, el nombre, la fecha y el motivo se adaptan a cada encargo. Puedes elegir un modelo de las fotos o venir con tu propia idea.',
  },
  {
    pregunta: '¿Las velas de las fotos están a la venta?',
    respuesta:
      'Son piezas ya pintadas para otras familias y ninguna se repite igual. Sirven para que veas el estilo y el acabado: dinos la referencia de la que te guste y pintamos una para ti a partir de ella.',
  },
  {
    pregunta: '¿Cómo hago el encargo?',
    respuesta: `Escríbenos por WhatsApp (${site.whatsappVisible}) o por correo a ${site.email} con la referencia de la pieza o tu idea. Concretamos los detalles contigo y te enseñamos cómo va quedando antes de darla por terminada.`,
  },
];
