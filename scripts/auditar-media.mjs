/**
 * Revisa las fotos del catálogo y dice cuáles conviene reponer.
 *
 * El problema de partida: las fotos de producto estaban a unos 300 px
 * de ancho. Sirven para una rejilla pequeña, pero no para que alguien acerque
 * una vela pintada a mano y vea el trazo, que es justo lo que vende. Este
 * script las lista para poder pedir los originales por tandas, empezando por
 * las que más se ven (las portadas).
 *
 * Uso:
 *   npm run media:auditar
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIR = path.join(RAIZ, 'public/images/colecciones');

/** Por debajo de esto no se puede ampliar una foto sin que se vean píxeles. */
const ANCHO_MINIMO = 900;

/* Node 25 lee TypeScript directamente, así que se puede leer el catálogo para
   saber qué fotos son portada (las que más se ven). Si en otra versión de Node
   fallara, el resto del informe sigue funcionando. */
const catalogo = await import(path.join(RAIZ, 'content/catalogo.ts'))
  .then((m) => m.CATALOGO)
  .catch(() => null);

async function medir(archivo) {
  const { width, height } = await sharp(archivo).metadata();
  const { size } = await stat(archivo);
  return { width, height, size };
}

const carpetas = (await readdir(DIR, { withFileTypes: true }))
  .filter((e) => e.isDirectory())
  .map((e) => e.name)
  .sort();

let total = 0;
let pobres = 0;
let bytes = 0;
const porCarpeta = [];

for (const carpeta of carpetas) {
  const archivos = (await readdir(path.join(DIR, carpeta))).filter((f) => !f.startsWith('.'));
  const medidas = [];
  for (const archivo of archivos) {
    medidas.push({ archivo, ...(await medir(path.join(DIR, carpeta, archivo))) });
  }
  const bajas = medidas.filter((m) => Math.max(m.width, m.height) < ANCHO_MINIMO);
  total += medidas.length;
  pobres += bajas.length;
  bytes += medidas.reduce((n, m) => n + m.size, 0);
  porCarpeta.push({ carpeta, total: medidas.length, bajas: bajas.length, medidas });
}

console.log(`\n  Fotos de producto: ${total}  ·  peso total: ${(bytes / 1048576).toFixed(2)} MB`);
console.log(`  Por debajo de ${ANCHO_MINIMO} px: ${pobres} de ${total}\n`);

for (const grupo of porCarpeta) {
  const anchoMedio = Math.round(
    grupo.medidas.reduce((n, m) => n + Math.max(m.width, m.height), 0) / grupo.medidas.length,
  );
  const marca = grupo.bajas === 0 ? '·' : grupo.bajas === grupo.total ? '!' : '~';
  console.log(
    `  ${marca} ${grupo.carpeta.padEnd(24)} ${String(grupo.total).padStart(3)} fotos` +
      `  lado mayor medio ${String(anchoMedio).padStart(4)} px` +
      (grupo.bajas ? `  → reponer ${grupo.bajas}` : '  → bien'),
  );
}

/* Las portadas salen en la home, en el índice de colecciones y arriba en cada
   ficha: si solo se van a reponer unas cuantas fotos, que sean estas. */
if (catalogo) {
  const portadas = catalogo.flatMap((categoria) =>
    categoria.lineas.map((linea) => ({ carpeta: linea.carpeta, ref: linea.portadaRef })),
  );

  const flojas = portadas.filter((portada) => {
    const grupo = porCarpeta.find((g) => g.carpeta === portada.carpeta);
    const numero = portada.ref.slice(-2);
    const foto = grupo?.medidas.find((m) => m.archivo.includes(`-${numero}.`));
    return foto && Math.max(foto.width, foto.height) < ANCHO_MINIMO;
  });

  if (flojas.length > 0) {
    console.log(`\n  Empezar por estas ${flojas.length} portadas (son las más visibles):`);
    for (const portada of flojas) {
      console.log(`    ${portada.ref.padEnd(9)} ${portada.carpeta}`);
    }
  }
}

/* Repaso de autenticidad, para hacer con los ojos.
 *
 * Cuatro fotos de Navidad resultaron ser producto generado con IA, con una
 * referencia que un cliente podía pedir por WhatsApp. Las delataron dos señales
 * juntas: proporción 2:3 y ningún perfil de color incrustado. Ninguna sirve por
 * separado —2:3 es también la de cualquier réflex, y sharp quita el perfil al
 * recomprimir—, así que esto no puede ser un test que falle: se intentó y
 * marcaba siete fotos legítimas. Lo que sí sirve es esta lista corta de rarezas
 * para abrirlas y mirarlas, que es exactamente como se encontraron. */
const PROPORCION_GENERADOR = 2 / 3;
const raras = porCarpeta.flatMap((grupo) =>
  grupo.medidas
    .filter((m) => Math.abs(m.width / m.height - PROPORCION_GENERADOR) < 0.01)
    .map((m) => `${grupo.carpeta}/${m.archivo} (${m.width}×${m.height})`),
);

if (raras.length > 0) {
  console.log(`\n  Mirar con los ojos: ${raras.length} fotos en proporción 2:3.`);
  console.log('  Puede ser una réflex, o puede ser una imagen generada. Ábrelas.');
  for (const r of raras) console.log(`    · ${r}`);
}

console.log(
  '\n  Qué pedirle al taller: las fotos originales tal como salieron del móvil,\n' +
    '  sin pasarlas por WhatsApp (WhatsApp las recomprime a ~800 px o menos).\n' +
    '  Con el original, next/image genera solo los tamaños que la web usa.\n',
);
