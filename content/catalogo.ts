import type { CategoriaFuente } from '@/lib/catalogo/esquemas';

/* ============================================================
   EL CATÁLOGO

   Este es el único archivo que hay que tocar para cambiar precios, textos o
   el orden de las colecciones. Las fotos se recogen solas desde
   public/images/colecciones (ver README, «Añadir una foto nueva»).

   Reglas:
   · `slug` es la dirección de la página. Si lo cambias, cambia la URL y
     Google pierde lo que tenía indexado: no lo toques sin motivo.
   · `importe` va en euros y como número, sin el símbolo €.
   · `portadaRef` es la foto que se ve en las tarjetas y la primera de la
     galería. Tiene que existir en la carpeta de esa línea.

   El ORDEN del array es el que se ve en la portada, y es el mismo que Antonio
   puso en su WordPress: primero el bautizo, que es lo de más volumen y el
   precio de entrada más bajo, y el cirio de 260 € al final. En la página de
   colecciones manda el agrupado por ocasión (ver ocasionesConCategorias).

   Los `resumen` de las líneas de una misma categoría están escritos para
   COMPARARSE entre ellos: quien mira 30 € y 40 € necesita saber qué cambia,
   y en todas las categorías lo que cambia es cuánta pintura lleva la pieza.
   ============================================================ */

export const CATALOGO: CategoriaFuente[] = [
  {
    slug: 'velas-de-bautizo',
    nombre: 'Velas de bautizo',
    nombreMenu: 'Bautizo',
    ocasiones: ['bautizo'],
    resumen: 'Con el nombre, la fecha y el dibujo que queráis.',
    descripcion:
      'La vela del bautizo se guarda toda la vida, así que la pintamos con el nombre del niño o la niña, la fecha y el motivo que la familia elija. Hay cuatro niveles según cuánta pintura lleva la pieza, del lazo con el nombre bordado a la vela cubierta de color.',
    seo: {
      titulo: 'Velas de bautizo personalizadas',
      tituloGoogle: 'Velas de bautizo personalizadas desde 20 €',
      descripcion:
        'Velas de bautizo hechas a mano con el nombre y la fecha. Cuatro acabados desde 20 € y en 48 horas la tienes. Envíos a toda España.',
    },
    plazo: 'En 48 horas tienes tu vela.',
    texto: [
      'Una vela de bautizo personalizada (o vela de bautismo) es de los pocos recuerdos del bautizo que se guardan toda la vida. Por eso cada una se pinta a mano, por encargo, en nuestro taller de Granada: con el nombre del niño o la niña, la fecha del bautizo y el dibujo que elija la familia, en los colores que queráis.',
      'Hay cuatro acabados y lo que cambia entre ellos es cuánta pintura lleva la vela. Lazos y bordado (20 €) es la vela sin pintar, con lazo de raso y el nombre bordado. Las básicas (30 €) llevan un icono pintado en dos tonos. Las elaboradas (35 €) tienen más trazo y más color, y en ellas ya cabe un retrato o un motivo propio. Las de al detalle (40 €) van pintadas a todo color alrededor de toda la vela. En todos los casos el precio incluye la vela.',
      'Si queréis que vaya a juego, la toalla de bautizo bordada con el mismo nombre y los mismos colores se añade por 15 €. Enviamos las velas de bautizo a cualquier punto de España y en 48 horas tenéis la vela con el nombre, así que no importa dónde se celebre el bautizo.',
    ],
    preguntas: [
      {
        pregunta: '¿Cuánto tardáis en hacer una vela de bautizo?',
        respuesta: 'En 48 horas tienes tu vela de bautizo, hecha a mano con el nombre y la fecha.',
      },
      {
        pregunta: '¿Qué se puede poner en una vela de bautizo personalizada?',
        respuesta:
          'El nombre del bebé, la fecha del bautizo y el dibujo que queráis. En las elaboradas y en las de al detalle cabe también un retrato o un motivo propio que nos mandéis.',
      },
      {
        pregunta: '¿Qué diferencia hay entre los cuatro acabados?',
        respuesta:
          'La cantidad de pintura: de la vela con lazo y nombre bordado (20 €) a la vela pintada a todo color de arriba abajo (40 €). Todas incluyen la vela.',
      },
      {
        pregunta: '¿Hacéis también la toalla de bautizo a juego?',
        respuesta:
          'Sí. Sola cuesta 18 €, y si la pedís junto a una vela de bautizo, 15 €, con el mismo nombre y los mismos colores que la vela.',
      },
    ],
    portadaRef: 'BZ-B-15',
    lineas: [
      {
        slug: 'lazos-y-bordados',
        nombre: 'Lazos y bordado',
        resumen:
          'La vela sin pintar, con su lazo de raso y el nombre bordado a mano. Es la opción más sobria.',
        precios: [{ importe: 20 }],
        notaPrecio: 'Incluye la vela.',
        incluye: ['La vela', 'Lazo de raso en el color que elijas', 'El nombre bordado'],
        altBase: 'Vela de bautizo con lazo de raso y el nombre bordado',
        carpeta: 'lazos-personalizados',
        portadaRef: 'BZ-L-04',
      },
      {
        slug: 'basicas',
        nombre: 'Básicas',
        resumen:
          'Un icono hecho a mano en dos tonos y el nombre. El resto de la vela se queda con la cera a la vista.',
        precios: [{ importe: 30 }],
        incluye: ['La vela', 'Un icono hecho a mano', 'El nombre y la fecha'],
        altBase: 'Vela de bautizo básica hecha a mano',
        carpeta: 'lazos-basicos',
        portadaRef: 'BZ-B-15',
      },
      {
        slug: 'elaboradas',
        nombre: 'Elaboradas',
        resumen:
          'El mismo dibujo con más trazo, más color y más superficie pintada. Aquí ya cabe un retrato.',
        precios: [{ importe: 35 }],
        incluye: [
          'La vela',
          'Dibujo detallado a mano',
          'El nombre y la fecha',
          'Posibilidad de retrato o motivo propio',
        ],
        altBase: 'Vela de bautizo elaborada hecha a mano',
        carpeta: 'lazos-elaborados',
        portadaRef: 'BZ-E-04',
      },
      {
        slug: 'al-detalle',
        nombre: 'Al detalle',
        resumen:
          'Pintada a todo color y de arriba abajo, con una composición que da la vuelta a la vela entera.',
        precios: [{ importe: 40 }],
        incluye: [
          'La vela',
          'Pintura a todo color alrededor de la pieza',
          'El nombre y la fecha',
          'Composición diseñada para la familia',
        ],
        altBase: 'Vela de bautizo pintada al detalle, a todo color',
        carpeta: 'lazos-al-detalle',
        portadaRef: 'BZ-D-19',
      },
    ],
  },

  {
    slug: 'velas-de-mesa-y-boda',
    nombre: 'Velas de mesa y boda',
    nombreMenu: 'Bodas',
    ocasiones: ['boda'],
    resumen: 'Para el altar y para la mesa, sueltas o en pareja.',
    descripcion:
      'Velas más anchas y más bajas, pensadas para que se vean de cerca: el altar de una boda, la mesa de los novios o un regalo de aniversario. Se piden de una en una o en pareja, y se pintan con los colores y el motivo de la celebración.',
    seo: {
      titulo: 'Velas de mesa y boda hechas a mano',
      tituloGoogle: 'Velas de boda hechas a mano desde 55 €',
      descripcion:
        'Velas de 20 × 9 cm hechas a mano para bodas y celebraciones. Sueltas o en pareja, desde 55 € y en 48 horas. Envíos a toda España.',
    },
    plazo: 'En 48 horas tienes tu vela.',
    texto: [
      'Velas de boda hechas a mano para el altar, la mesa de los novios o un regalo de aniversario. Son más anchas y más bajas que una vela de bautizo, de 20 × 9 cm, porque están pensadas para verse de cerca, y se pintan en nuestro taller de Granada con los colores y el motivo de cada celebración.',
      'Se pueden pedir de una en una o en pareja. Las básicas llevan un icono pintado en dos tonos con remates en oro y cuestan 55 € (100 € las dos). Las elaboradas van a todo color y con mucho más detalle en el dibujo: 70 € la vela y 130 € la pareja.',
      'Las enviamos a cualquier punto de España y en 48 horas tenéis vuestras velas. Escribidnos con la fecha de la boda y os las preparamos.',
    ],
    preguntas: [
      {
        pregunta: '¿Qué tamaño tienen las velas de boda?',
        respuesta: '20 cm de alto y 9 cm de diámetro, en los dos acabados.',
      },
      {
        pregunta: '¿Se pueden pedir dos velas iguales?',
        respuesta:
          'Sí, en pareja sale más a cuenta: 100 € las dos básicas y 130 € las dos elaboradas.',
      },
    ],
    lineas: [
      {
        slug: 'basicas',
        nombre: 'Básicas',
        resumen:
          'Un icono hecho a mano en dos tonos, con los remates en oro y la cera a la vista alrededor.',
        precios: [
          { etiqueta: '1 vela', importe: 55 },
          { etiqueta: '2 velas', importe: 100 },
        ],
        medidas: '20 × 9 cm',
        dimensiones: { alto: 20, diametro: 9 },
        incluye: ['La vela', 'Fondo en el color que elijas', 'Un icono hecho a mano'],
        altBase: 'Vela de mesa y boda básica hecha a mano',
        carpeta: 'mesa-basicas',
        portadaRef: 'MB-B-03',
      },
      {
        slug: 'elaboradas',
        nombre: 'Elaboradas',
        resumen:
          'A todo color y con mucho más detalle en el dibujo: es la vela que se queda mirando la gente en la mesa.',
        precios: [
          { etiqueta: '1 vela', importe: 70 },
          { etiqueta: '2 velas', importe: 130 },
        ],
        medidas: '20 × 9 cm',
        dimensiones: { alto: 20, diametro: 9 },
        incluye: ['La vela', 'Pintura a todo color', 'Composición diseñada para la celebración'],
        altBase: 'Vela de mesa y boda elaborada hecha a mano',
        carpeta: 'mesa-elaboradas',
        portadaRef: 'MB-E-01',
      },
    ],
  },

  {
    slug: 'cirios-pascuales',
    nombre: 'Cirios pascuales',
    nombreMenu: 'Cirios',
    ocasiones: ['pascua'],
    resumen: 'Para la Vigilia Pascual, hechos a mano de arriba abajo.',
    descripcion:
      'El cirio pascual es la pieza más grande que sale del taller y la que más horas lleva. Se pinta a mano sobre cera, con el año, la cruz y la iconografía que la comunidad pida. Trabajamos con parroquias, comunidades y grupos, y podemos repetir un motivo de un año para otro o partir de una idea nueva.',
    seo: {
      titulo: 'Cirios pascuales hechos a mano',
      tituloGoogle: 'Cirios pascuales hechos a mano desde 200 €',
      descripcion:
        'Cirios pascuales hechos a mano para parroquias y comunidades, con el año, la cruz y la iconografía que elijas. Desde 200 € y en 48 horas.',
    },
    plazo: 'En 48 horas tienes tu cirio.',
    texto: [
      'Pintamos cirios pascuales a mano para parroquias, comunidades y grupos de toda España. Cada cirio se pinta sobre la cera en nuestro taller de Granada, con el año, la cruz y la iconografía que pida la comunidad.',
      'El tamaño de referencia es de 70 × 7 cm. Los básicos (200 €) llevan un color de fondo con la cruz, el año y los trazos en oro. Los elaborados (260 €) van cubiertos de escenas a todo color al estilo de los iconos, dando la vuelta al cirio entero. Para otros tamaños, consultad el precio.',
      'Podemos repetir el motivo de un año para otro o partir de una idea nueva. En 48 horas tenéis el cirio, pintado y listo para la Vigilia Pascual.',
    ],
    preguntas: [
      {
        pregunta: '¿Podéis repetir el diseño del cirio del año pasado?',
        respuesta:
          'Sí. Podemos repetir el motivo de un año para otro, cambiando el año, o partir de una idea nueva si la comunidad lo prefiere.',
      },
      {
        pregunta: '¿Hacéis cirios pascuales de otros tamaños?',
        respuesta:
          'Sí. Los precios de la web son para el cirio de 70 × 7 cm; para otras medidas, escribidnos y os decimos el precio.',
      },
      {
        pregunta: '¿Con cuánto tiempo hay que encargar el cirio pascual?',
        respuesta:
          'En 48 horas tenéis vuestro cirio. Escribidnos con la fecha en la que lo necesitáis y os lo preparamos.',
      },
    ],
    lineas: [
      {
        slug: 'basicos',
        nombre: 'Básicos',
        resumen:
          'Un color de fondo con la cruz, el año y los trazos en oro. Queda cera a la vista entre los motivos.',
        precios: [{ importe: 200 }],
        notaPrecio: 'Para otros tamaños, consultar precio.',
        medidas: '70 × 7 cm',
        dimensiones: { alto: 70, diametro: 7 },
        incluye: ['El cirio', 'La pintura a mano', 'El año y la iconografía que elijas'],
        altBase: 'Cirio pascual básico hecho a mano',
        carpeta: 'cirios-basicos',
        portadaRef: 'CP-B-02',
      },
      {
        slug: 'elaborados',
        nombre: 'Elaborados',
        resumen:
          'Escenas a todo color al estilo de los iconos, cubriendo el cirio entero y dando la vuelta alrededor.',
        precios: [{ importe: 260 }],
        notaPrecio: 'Para otros tamaños, consultar precio.',
        medidas: '70 × 7 cm',
        dimensiones: { alto: 70, diametro: 7 },
        incluye: [
          'El cirio',
          'La pintura a mano',
          'Varias escenas alrededor del cirio',
          'El año y la iconografía que elijas',
        ],
        altBase: 'Cirio pascual elaborado hecho a mano',
        carpeta: 'cirios-elaborados',
        portadaRef: 'CP-E-18',
      },
    ],
  },

  {
    slug: 'velas-de-navidad',
    nombre: 'Velas de Navidad',
    nombreMenu: 'Navidad',
    ocasiones: ['navidad'],
    resumen: 'Nacimientos y motivos de Navidad, pintados uno a uno.',
    descripcion:
      'Velas de Navidad hechas a mano, con escenas del nacimiento y motivos navideños. Se hacen por encargo y en 24 horas tienes la tuya.',
    seo: {
      titulo: 'Velas de Navidad hechas a mano',
      tituloGoogle: 'Velas de Navidad hechas a mano · 20 € en 24 horas',
      descripcion:
        'Velas de Navidad artesanales hechas a mano con escenas del nacimiento. 20 € por pieza y en 24 horas tienes tu vela. Envíos a toda España.',
    },
    plazo: 'En 24 horas tienes tu vela.',
    texto: [
      'Velas de Navidad hechas a mano con escenas del nacimiento y motivos navideños. Cada una se pinta por encargo en nuestro taller de Granada y cuesta 20 €, con la vela incluida.',
      'Son un regalo para la mesa de Nochebuena, para un belén o para tener un detalle con alguien que vive lejos: las enviamos a cualquier punto de España. Y en 24 horas tienes tu vela.',
    ],
    preguntas: [
      {
        pregunta: '¿Cuánto tardáis en hacer una vela de Navidad?',
        respuesta: 'En 24 horas tienes tu vela de Navidad, hecha a mano.',
      },
      {
        pregunta: '¿Sirven como regalo de Navidad?',
        respuesta:
          'Sí. Son un regalo para la mesa de Nochebuena, para un belén o para alguien que vive lejos: las enviamos a cualquier punto de España.',
      },
    ],
    lineas: [
      {
        slug: 'velas-de-navidad',
        nombre: 'Velas de Navidad',
        resumen: 'Escenas del nacimiento y motivos navideños hechos a mano.',
        precios: [{ importe: 20 }],
        incluye: ['La vela', 'Escena hecha a mano', 'Motivo a elegir'],
        altBase: 'Vela de Navidad hecha a mano',
        carpeta: 'navidad',
        portadaRef: 'NV-03',
      },
    ],
  },

  {
    slug: 'toallas-de-bautizo',
    nombre: 'Toallas de bautizo',
    nombreMenu: 'Toallas',
    ocasiones: ['toallas'],
    resumen: 'Bordadas con el nombre, a juego con la vela.',
    descripcion:
      'Toallas de rizo bordadas a mano con el nombre del niño o la niña, en el color de hilo que elijáis. Se pueden pedir solas o junto a la vela de bautizo, para que las dos piezas vayan a juego.',
    seo: {
      titulo: 'Toallas de bautizo bordadas',
      tituloGoogle: 'Toallas de bautizo bordadas con nombre · 18 €',
      descripcion:
        'Toallas de bautizo bordadas con el nombre, en el color de hilo que elijas. 18 € por toalla y en 48 horas la tienes. Envíos a toda España.',
    },
    plazo: 'En 48 horas tienes tu toalla.',
    texto: [
      'Toallas de bautizo de rizo con el nombre del bebé bordado en el color de hilo que elijáis. Cuestan 18 € y se bordan por encargo en nuestro taller de Granada.',
      'Se pueden pedir solas o a juego con la vela de bautizo hecha a mano, con el mismo nombre y los mismos colores; en ese caso la toalla sale por 15 €. Las enviamos a cualquier punto de España.',
    ],
    preguntas: [
      {
        pregunta: '¿Puedo elegir el color del bordado?',
        respuesta: 'Sí, el nombre se borda en el color de hilo que elijáis.',
      },
    ],
    lineas: [
      {
        slug: 'toallas-de-bautizo',
        nombre: 'Toallas de bautizo',
        resumen: 'Toalla de rizo con el nombre bordado en el color que elijas.',
        precios: [{ importe: 18 }],
        incluye: ['La toalla', 'El nombre bordado', 'Color de hilo a elegir'],
        altBase: 'Toalla de bautizo bordada con el nombre',
        carpeta: 'toallas-bautizo',
        portadaRef: 'TB-02',
      },
    ],
  },

  {
    slug: 'pack-vela-y-toalla',
    nombre: 'Pack vela + toalla',
    nombreMenu: 'Pack',
    ocasiones: ['pack'],
    resumen: 'Añade la toalla bordada a tu vela de bautizo por 15 €.',
    descripcion:
      'Si ya te llevas una vela de bautizo, la toalla bordada a juego sale por 15 € en lugar de 18 €. Mismo nombre, mismos colores, las dos piezas pensadas como un conjunto.',
    seo: {
      titulo: 'Pack bautizo: vela pintada + toalla bordada',
      descripcion:
        'Añade la toalla bordada a juego a tu vela de bautizo por 15 €. Mismo nombre y mismos colores, y en 48 horas lo tienes. Envíos a toda España.',
    },
    plazo: 'En 48 horas tienes tu vela y tu toalla.',
    texto: [
      'El pack de bautizo junta las dos piezas que más se regalan: la vela de bautizo hecha a mano y la toalla de rizo con el nombre bordado. Al pedirlas juntas, la toalla sale por 15 € en lugar de 18 €, y las dos llevan el mismo nombre y los mismos colores.',
      'La vela se elige aparte, en cualquiera de sus cuatro acabados (de 20 € a 40 €). Lo preparamos todo en nuestro taller de Granada y lo enviamos junto a cualquier punto de España.',
    ],
    lineas: [
      {
        slug: 'pack-vela-y-toalla',
        nombre: 'Pack vela + toalla',
        resumen: 'La toalla bordada a juego, llevándote también la vela de bautizo.',
        precios: [{ importe: 15 }],
        notaPrecio: 'Precio de la toalla al pedirla con una vela de bautizo.',
        incluye: [
          'La toalla bordada',
          'El mismo nombre y los mismos colores que la vela',
          'La vela se pide aparte, en Velas de bautizo',
        ],
        altBase: 'Toalla de bautizo bordada a juego con su vela hecha a mano',
        carpeta: 'toallas-bautizo-vela',
        portadaRef: 'PK-03',
      },
    ],
  },
];
