/**
 * Recupera las fotos originales de las piezas desde el WordPress que Antonio se
 * hizo él mismo (https://arteycera.wordpress.com).
 *
 * Por qué existe este script
 * --------------------------
 * El repositorio guarda las fotos de producto a ~300 px, que es demasiado poco
 * para lo que vende este negocio: lo que convence de una vela pintada a mano es
 * acercarse y ver el trazo. Resulta que las mismas fotos siguen publicadas en su
 * WordPress a 1536 × 2048, así que no hay que pedirle nada a nadie: se bajan y se
 * sustituyen.
 *
 * Lo que hace que esto no sea trivial
 * -----------------------------------
 * 1. Los conteos no cuadran. En 3 de las 8 carpetas el repo tiene más fotos que
 *    el WordPress (añadió piezas después), así que emparejar por posición daría
 *    fotos cambiadas de sitio a partir del primer desajuste. Se empareja por
 *    CONTENIDO, con un hash perceptual.
 * 2. Muchas fotos del repo son recortes cuadrados (300 × 300) de originales
 *    verticales (1536 × 2048). Comparar la imagen entera contra un recorte da
 *    distancias altas y falsos negativos, así que antes de hashear se recorta
 *    todo al cuadrado central: si la del repo ya es cuadrada el recorte no hace
 *    nada, y si conserva la proporción queda el mismo cuadro que en el original.
 * 3. Se conserva el NOMBRE DE ARCHIVO del repo. Es lo que mantiene estables las
 *    referencias que el cliente escribe por WhatsApp (CP-E-18), los `portadaRef`
 *    de content/catalogo.ts y los enlaces compartidos `?pieza=`.
 *
 * Si una foto del repo no encuentra pareja se queda como está y sale listada al
 * final: nunca se sustituye a ciegas.
 *
 * Uso:
 *   node scripts/recuperar-originales.mjs            # sustituye
 *   node scripts/recuperar-originales.mjs --simular  # solo informa, no escribe
 *
 * Después hay que ejecutar `npm run catalogo:generar` para que
 * content/piezas.generado.ts recoja las dimensiones nuevas.
 */
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIR_COLECCIONES = path.join(RAIZ, 'public/images/colecciones');
/** Los originales bajados se cachean fuera del repo (.cache está en .gitignore). */
const DIR_CACHE = path.join(RAIZ, '.cache/originales-wp');

const SIMULAR = process.argv.includes('--simular');

/** Lado largo máximo al guardar. Con 1600 px la vista grande (1200) va sobrada. */
const LADO_MAXIMO = 1600;
const CALIDAD_WEBP = 82;

/**
 * Distancia de Hamming máxima para aceptar un emparejamiento, sobre 64 bits.
 * 8 es exigente: dos fotos distintas de la misma vela suelen pasar de 14.
 */
const UMBRAL = 8;

/**
 * Qué sección del WordPress corresponde a qué carpeta del repo. Las claves de
 * sección son el titular <h2> normalizado (sin acentos, en minúsculas).
 */
const PAGINAS = [
  {
    url: 'https://arteycera.wordpress.com/cirios-pascuales/',
    secciones: { basicos: 'cirios-basicos', elaborados: 'cirios-elaborados' },
  },
  {
    url: 'https://arteycera.wordpress.com/velas-de-bautizo/',
    secciones: {
      'lazos y bordado': 'lazos-personalizados',
      basicas: 'lazos-basicos',
      elaboradas: 'lazos-elaborados',
      'al detalle': 'lazos-al-detalle',
    },
  },
  {
    url: 'https://arteycera.wordpress.com/velas-mesa-y-bodas/',
    secciones: { basicas: 'mesa-basicas', elaboradas: 'mesa-elaboradas' },
  },
];

const EXTENSIONES = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

/** Quita acentos y baja a minúsculas, para casar titulares con el mapa. */
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Descodifica las entidades que mete WordPress en los titulares. */
function descodificar(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&aacute;/gi, 'á')
    .replace(/&eacute;/gi, 'é')
    .replace(/&iacute;/gi, 'í')
    .replace(/&oacute;/gi, 'ó')
    .replace(/&uacute;/gi, 'ú')
    .replace(/&ntilde;/gi, 'ñ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&');
}

/**
 * Recorre el HTML en orden y devuelve, por sección, las URL de las fotos.
 *
 * Se hace con una sola pasada de expresión regular con alternancia (titular o
 * URL) porque lo que importa es el ORDEN en el documento: cada foto pertenece al
 * último <h2> que ha aparecido antes que ella.
 */
function extraerPorSeccion(html, secciones) {
  const patron =
    /<h2[^>]*>([\s\S]*?)<\/h2>|https?:\/\/arteycera\.wordpress\.com\/wp-content\/uploads\/[^"'\s\\)]+?\.(?:jpe?g|png|webp)/gi;

  const resultado = new Map();
  const vistas = new Set();
  let carpetaActual = null;

  for (const coincidencia of html.matchAll(patron)) {
    if (coincidencia[1] !== undefined) {
      const clave = normalizar(descodificar(coincidencia[1]));
      carpetaActual = secciones[clave] ?? null;
      continue;
    }

    const url = coincidencia[0];
    // El logotipo de la cabecera y del pie también vive en uploads/.
    if (/logo|cropped-/i.test(url)) continue;
    if (!carpetaActual || vistas.has(url)) continue;

    vistas.add(url);
    if (!resultado.has(carpetaActual)) resultado.set(carpetaActual, []);
    resultado.get(carpetaActual).push(url);
  }

  return resultado;
}

/**
 * Hash perceptual (dHash) de 64 bits sobre el cuadrado central de la imagen.
 *
 * El recorte al cuadrado central es lo que permite comparar un recorte 300 × 300
 * del repo con su original 1536 × 2048. Después se reduce a 9 × 8 en gris y cada
 * bit dice si un píxel es más claro que el de su derecha: sobrevive al cambio de
 * tamaño y a la recompresión, que es exactamente lo que hay entre las dos copias.
 */
async function huella(rutaOEntrada) {
  const imagen = sharp(rutaOEntrada, { failOn: 'none' }).rotate();
  const { width, height } = await imagen.metadata();
  const lado = Math.min(width, height);

  const pixeles = await sharp(rutaOEntrada, { failOn: 'none' })
    .rotate()
    .extract({
      left: Math.floor((width - lado) / 2),
      top: Math.floor((height - lado) / 2),
      width: lado,
      height: lado,
    })
    .resize(9, 8, { fit: 'fill' })
    .greyscale()
    .raw()
    .toBuffer();

  let bits = 0n;
  for (let fila = 0; fila < 8; fila += 1) {
    for (let columna = 0; columna < 8; columna += 1) {
      const i = fila * 9 + columna;
      bits = (bits << 1n) | (pixeles[i] > pixeles[i + 1] ? 1n : 0n);
    }
  }
  return bits;
}

function distancia(a, b) {
  let x = a ^ b;
  let n = 0;
  while (x > 0n) {
    n += Number(x & 1n);
    x >>= 1n;
  }
  return n;
}

/** Nombre de archivo local para una URL del WordPress. */
function nombreCache(url) {
  return url.split('/').pop();
}

async function descargar(url, destino) {
  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`${respuesta.status} ${respuesta.statusText} en ${url}`);
  await writeFile(destino, Buffer.from(await respuesta.arrayBuffer()));
}

/**
 * Emparejado 1:1 por distancia mínima global (greedy): se ordenan todas las
 * parejas posibles por distancia y se van fijando las que tengan libres ambos
 * extremos. Con conjuntos de 30 fotos es de sobra y no hace falta Hungarian.
 */
function emparejar(fotosRepo, originales) {
  const parejas = [];
  for (const repo of fotosRepo) {
    for (const original of originales) {
      parejas.push({ repo, original, d: distancia(repo.huella, original.huella) });
    }
  }
  parejas.sort((a, b) => a.d - b.d);

  const repoUsado = new Set();
  const originalUsado = new Set();
  const asignadas = [];

  for (const pareja of parejas) {
    if (pareja.d > UMBRAL) break;
    if (repoUsado.has(pareja.repo.archivo) || originalUsado.has(pareja.original.url)) continue;
    repoUsado.add(pareja.repo.archivo);
    originalUsado.add(pareja.original.url);
    asignadas.push(pareja);
  }

  return {
    asignadas,
    repoSinPareja: fotosRepo.filter((f) => !repoUsado.has(f.archivo)),
    originalSinPareja: originales.filter((o) => !originalUsado.has(o.url)),
  };
}

async function main() {
  await mkdir(DIR_CACHE, { recursive: true });

  console.log('\n  Leyendo el WordPress…');
  const porCarpeta = new Map();
  for (const pagina of PAGINAS) {
    const respuesta = await fetch(pagina.url);
    if (!respuesta.ok) {
      throw new Error(`No se pudo leer ${pagina.url}: ${respuesta.status}`);
    }
    const html = await respuesta.text();
    const secciones = extraerPorSeccion(html, pagina.secciones);

    const esperadas = Object.values(pagina.secciones);
    const faltan = esperadas.filter((c) => !secciones.has(c));
    if (faltan.length > 0) {
      throw new Error(
        `En ${pagina.url} no se encontraron las secciones: ${faltan.join(', ')}.\n` +
          '  Puede que hayan cambiado los titulares del WordPress: revisa el mapa PAGINAS.',
      );
    }

    for (const [carpeta, urls] of secciones) porCarpeta.set(carpeta, urls);
  }

  const totalOriginales = [...porCarpeta.values()].reduce((n, u) => n + u.length, 0);
  console.log(`  ${totalOriginales} fotos encontradas en ${porCarpeta.size} secciones\n`);

  console.log('  Descargando originales (se cachean en .cache/originales-wp)…');
  let bajadas = 0;
  for (const urls of porCarpeta.values()) {
    for (const url of urls) {
      const destino = path.join(DIR_CACHE, nombreCache(url));
      try {
        await readFile(destino);
      } catch {
        await descargar(url, destino);
        bajadas += 1;
      }
    }
  }
  console.log(`  ${bajadas} descargadas, ${totalOriginales - bajadas} ya estaban en caché\n`);

  const resumen = [];
  const sinPareja = [];
  const originalesHuerfanos = [];

  for (const [carpeta, urls] of porCarpeta) {
    const dir = path.join(DIR_COLECCIONES, carpeta);
    const archivos = (await readdir(dir))
      .filter((f) => EXTENSIONES.has(path.extname(f).toLowerCase()))
      .sort();

    const fotosRepo = [];
    for (const archivo of archivos) {
      fotosRepo.push({ archivo, huella: await huella(path.join(dir, archivo)) });
    }

    const originales = [];
    for (const url of urls) {
      const ruta = path.join(DIR_CACHE, nombreCache(url));
      originales.push({ url, ruta, huella: await huella(ruta) });
    }

    const { asignadas, repoSinPareja, originalSinPareja } = emparejar(fotosRepo, originales);

    let reemplazadas = 0;
    let maximoAncho = 0;
    for (const { repo, original } of asignadas) {
      const destino = path.join(dir, repo.archivo);
      if (!SIMULAR) {
        const salida = await sharp(original.ruta)
          .rotate()
          .resize({
            width: LADO_MAXIMO,
            height: LADO_MAXIMO,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: CALIDAD_WEBP })
          .toBuffer();
        await writeFile(destino, salida);
        const { width } = await sharp(destino).metadata();
        maximoAncho = Math.max(maximoAncho, width);
      }
      reemplazadas += 1;
    }

    resumen.push({
      carpeta,
      repo: fotosRepo.length,
      wp: originales.length,
      reemplazadas,
      peor: asignadas.length > 0 ? Math.max(...asignadas.map((p) => p.d)) : null,
      maximoAncho,
    });
    for (const f of repoSinPareja) sinPareja.push(`${carpeta}/${f.archivo}`);
    for (const o of originalSinPareja) originalesHuerfanos.push(`${carpeta} ← ${nombreCache(o.url)}`);
  }

  console.log(
    `  ${'carpeta'.padEnd(24)} ${'repo'.padStart(5)} ${'wp'.padStart(4)} ${'sustituidas'.padStart(12)} ${'peor dist.'.padStart(11)}`,
  );
  for (const r of resumen) {
    console.log(
      `  ${r.carpeta.padEnd(24)} ${String(r.repo).padStart(5)} ${String(r.wp).padStart(4)} ` +
        `${String(r.reemplazadas).padStart(12)} ${String(r.peor ?? '—').padStart(11)}`,
    );
  }

  const total = resumen.reduce((n, r) => n + r.reemplazadas, 0);
  console.log(`\n  ${total} fotos ${SIMULAR ? 'se sustituirían' : 'sustituidas'}.`);

  if (sinPareja.length > 0) {
    console.log(
      `\n  ${sinPareja.length} fotos del repo sin pareja en el WordPress (se quedan a 300 px;\n` +
        '  son las que añadió después y hay que pedírselas a Antonio):',
    );
    for (const f of sinPareja) console.log(`    · ${f}`);
  }

  if (originalesHuerfanos.length > 0) {
    console.log(
      `\n  ${originalesHuerfanos.length} originales del WordPress que no están en el repo\n` +
        '  (piezas que salieron del catálogo nuevo; no se hace nada con ellas):',
    );
    for (const o of originalesHuerfanos) console.log(`    · ${o}`);
  }

  if (!SIMULAR) {
    console.log('\n  Ahora ejecuta:  npm run catalogo:generar\n');
  } else {
    console.log('\n  Simulación: no se ha escrito nada.\n');
  }
}

await main();
