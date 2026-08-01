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
      descripcion:
        'Velas de bautizo pintadas a mano con el nombre y la fecha. Cuatro acabados, desde 20 € con la vela incluida. Envíos a toda España.',
    },
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
          'Un icono pintado a mano en dos tonos y el nombre. El resto de la vela se queda con la cera a la vista.',
        precios: [{ importe: 30 }],
        incluye: ['La vela', 'Un icono pintado a mano', 'El nombre y la fecha'],
        altBase: 'Vela de bautizo básica pintada a mano',
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
        altBase: 'Vela de bautizo elaborada pintada a mano',
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
      titulo: 'Velas de mesa y boda pintadas a mano',
      descripcion:
        'Velas artesanales de 20 × 9 cm pintadas a mano para bodas y celebraciones. Sueltas o en pareja, desde 55 €.',
    },
    lineas: [
      {
        slug: 'basicas',
        nombre: 'Básicas',
        resumen:
          'Un icono pintado a mano en dos tonos, con los remates en oro y la cera a la vista alrededor.',
        precios: [
          { etiqueta: '1 vela', importe: 55 },
          { etiqueta: '2 velas', importe: 100 },
        ],
        medidas: '20 × 9 cm',
        dimensiones: { alto: 20, diametro: 9 },
        incluye: ['La vela', 'Fondo en el color que elijas', 'Un icono pintado a mano'],
        altBase: 'Vela de mesa y boda básica pintada a mano',
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
        altBase: 'Vela de mesa y boda elaborada pintada a mano',
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
    resumen: 'Para la Vigilia Pascual, pintados a mano de arriba abajo.',
    descripcion:
      'El cirio pascual es la pieza más grande que sale del taller y la que más horas lleva. Se pinta a mano sobre cera, con el año, la cruz y la iconografía que la comunidad pida. Trabajamos con parroquias, comunidades y grupos, y podemos repetir un motivo de un año para otro o partir de una idea nueva.',
    seo: {
      titulo: 'Cirios pascuales pintados a mano',
      descripcion:
        'Cirios pascuales artesanales pintados a mano para parroquias y comunidades, con el año, la cruz y la iconografía que elijas. Desde 200 €.',
    },
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
        altBase: 'Cirio pascual básico pintado a mano',
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
        altBase: 'Cirio pascual elaborado pintado a mano',
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
      'Velas de Navidad pintadas a mano, con escenas del nacimiento y motivos navideños. Se hacen por encargo cada temporada, así que conviene pedirlas con tiempo.',
    seo: {
      titulo: 'Velas de Navidad pintadas a mano',
      descripcion:
        'Velas de Navidad artesanales pintadas a mano con escenas del nacimiento. 20 € por pieza, hechas por encargo.',
    },
    lineas: [
      {
        slug: 'velas-de-navidad',
        nombre: 'Velas de Navidad',
        resumen: 'Escenas del nacimiento y motivos navideños pintados a mano.',
        precios: [{ importe: 20 }],
        incluye: ['La vela', 'Escena pintada a mano', 'Motivo a elegir'],
        altBase: 'Vela de Navidad pintada a mano',
        carpeta: 'navidad',
        portadaRef: 'NV-01',
      },
    ],
  },

  {
    slug: 'toallas-de-bautizo',
    nombre: 'Toallas de bautizo',
    nombreMenu: 'Toallas',
    ocasiones: ['bautizo'],
    resumen: 'Bordadas con el nombre, a juego con la vela.',
    descripcion:
      'Toallas de rizo bordadas a mano con el nombre del niño o la niña, en el color de hilo que elijáis. Se pueden pedir solas o junto a la vela de bautizo, para que las dos piezas vayan a juego.',
    seo: {
      titulo: 'Toallas de bautizo bordadas',
      descripcion:
        'Toallas de bautizo bordadas con el nombre, en el color de hilo que elijas. 18 € por toalla. A juego con la vela.',
    },
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
    ocasiones: ['bautizo'],
    resumen: 'Añade la toalla bordada a tu vela de bautizo por 15 €.',
    descripcion:
      'Si ya te llevas una vela de bautizo, la toalla bordada a juego sale por 15 € en lugar de 18 €. Mismo nombre, mismos colores, las dos piezas pensadas como un conjunto.',
    seo: {
      titulo: 'Pack bautizo: vela pintada + toalla bordada',
      descripcion:
        'Añade la toalla bordada a juego a tu vela de bautizo por 15 €. Mismo nombre y mismos colores en las dos piezas.',
    },
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
        altBase: 'Toalla de bautizo bordada a juego con su vela pintada a mano',
        carpeta: 'toallas-bautizo-vela',
        portadaRef: 'PK-03',
      },
    ],
  },
];
