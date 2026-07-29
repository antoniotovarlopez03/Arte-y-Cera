/**
 * Genera content/piezas.generado.ts a partir de las fotos que hay en
 * public/images/colecciones/.
 *
 * Motivo: hay 166 fotos de producto. Escribirlas a mano en el catálogo (como
 * estaban en el index.html original) es un trabajo mecánico que se estropea
 * en cuanto alguien añade o borra una foto. Aquí se escanean las carpetas, se
 * lee el tamaño real de cada imagen (necesario para que next/image reserve el
 * hueco y no haya saltos de maquetación) y se le asigna a cada pieza una
 * referencia estable tipo CP-E-18.
 *
 * Uso:
 *   npm run catalogo:generar
 *
 * Después de añadir fotos nuevas a una carpeta, vuelve a ejecutarlo. Los
 * precios y los textos NO se tocan aquí: viven en content/catalogo.ts.
 */
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RAIZ = path.resolve(import.meta.dirname, '..');
const DIR_COLECCIONES = path.join(RAIZ, 'public/images/colecciones');
const SALIDA = path.join(RAIZ, 'content/piezas.generado.ts');

/**
 * Prefijo de referencia por carpeta. La referencia es lo que el cliente
 * escribe en WhatsApp («me gusta la CP-E-18»), así que tiene que ser corta,
 * legible por teléfono y estable en el tiempo: nunca renumerar.
 */
const PREFIJOS = {
  'cirios-basicos': 'CP-B',
  'cirios-elaborados': 'CP-E',
  'lazos-personalizados': 'BZ-L',
  'lazos-basicos': 'BZ-B',
  'lazos-elaborados': 'BZ-E',
  'lazos-al-detalle': 'BZ-D',
  'mesa-basicas': 'MB-B',
  'mesa-elaboradas': 'MB-E',
  navidad: 'NV',
  'toallas-bautizo': 'TB',
  'toallas-bautizo-vela': 'PK',
};

const EXTENSIONES = new Set(['.webp', '.jpg', '.jpeg', '.png', '.avif']);

/** El número que ya llevan los archivos (cirios-basicos-07.webp -> 07). */
function numeroDe(nombre) {
  const m = nombre.match(/-(\d+)\.[a-z]+$/i);
  return m ? m[1] : null;
}

async function main() {
  const carpetas = (await readdir(DIR_COLECCIONES, { withFileTypes: true }))
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const sinPrefijo = carpetas.filter((c) => !PREFIJOS[c]);
  if (sinPrefijo.length > 0) {
    console.error(
      `\n  Carpetas sin prefijo de referencia: ${sinPrefijo.join(', ')}\n` +
        `  Añádelas al objeto PREFIJOS de scripts/generar-catalogo.mjs y vuelve a ejecutar.\n`,
    );
    process.exit(1);
  }

  const grupos = {};
  let total = 0;

  for (const carpeta of carpetas) {
    const dir = path.join(DIR_COLECCIONES, carpeta);
    const archivos = (await readdir(dir))
      .filter((f) => EXTENSIONES.has(path.extname(f).toLowerCase()))
      .sort();

    const piezas = [];
    for (const archivo of archivos) {
      const numero = numeroDe(archivo);
      if (!numero) {
        console.warn(`  · Se ignora ${carpeta}/${archivo}: el nombre no acaba en -NN.ext`);
        continue;
      }
      const { width, height } = await sharp(path.join(dir, archivo)).metadata();
      piezas.push({
        ref: `${PREFIJOS[carpeta]}-${numero}`,
        src: `/images/colecciones/${carpeta}/${archivo}`,
        ancho: width,
        alto: height,
      });
    }

    grupos[carpeta] = piezas;
    total += piezas.length;
    const menores = piezas.filter((p) => Math.max(p.ancho, p.alto) < 600).length;
    console.log(
      `  ${carpeta.padEnd(24)} ${String(piezas.length).padStart(3)} piezas` +
        (menores > 0 ? `  (${menores} por debajo de 600 px)` : ''),
    );
  }

  const cuerpo = Object.entries(grupos)
    .map(([carpeta, piezas]) => {
      const filas = piezas
        .map(
          (p) =>
            `    { ref: '${p.ref}', src: '${p.src}', ancho: ${p.ancho}, alto: ${p.alto} },`,
        )
        .join('\n');
      return `  '${carpeta}': [\n${filas}\n  ],`;
    })
    .join('\n');

  const contenido = `// ARCHIVO GENERADO — no lo edites a mano.
// Se regenera con: npm run catalogo:generar
// Los precios y los textos del catálogo están en content/catalogo.ts.

export type PiezaGenerada = {
  /** Referencia que ve el cliente y que usa para pedir por WhatsApp. */
  ref: string;
  src: string;
  ancho: number;
  alto: number;
};

export const PIEZAS: Record<string, PiezaGenerada[]> = {
${cuerpo}
};
`;

  await writeFile(SALIDA, contenido, 'utf8');
  console.log(`\n  ${total} piezas escritas en content/piezas.generado.ts\n`);
}

await main();
