import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { categorias, formatearPrecio, lineas, precioMinimo } from '@/lib/catalogo';

/* Estas pruebas cubren justo lo que estaba roto en la web original: fotos
   referenciadas que no existían y datos escritos a mano en el HTML sin nadie
   que los revisara. */

const RAIZ = path.resolve(import.meta.dirname, '..');

describe('catálogo', () => {
  it('tiene las seis colecciones, sus once líneas y las 162 piezas', () => {
    expect(categorias).toHaveLength(6);
    expect(lineas).toHaveLength(11);
    expect(lineas.flatMap((l) => l.piezas)).toHaveLength(162);
  });

  /* NO hay aquí un test que detecte fotos generadas con IA, y es a propósito.
     Cuatro fotos de Navidad (NV-05 a NV-08) eran producto generado y se
     quitaron; lo que las delató fue una proporción 2:3 sin perfil de color.
     Pero eso no se puede convertir en una regla: 2:3 es también la proporción
     de cualquier réflex, y los recortes 4:5 o apaisados de fotos legítimas
     harían saltar cualquier lista de proporciones «de cámara» (se probó: marcaba
     siete fotos buenas). Un test así daría más falsos positivos que seguridad.
     La comprobación vive en `npm run media:auditar`, que lista las proporciones
     raras para mirarlas con los ojos, que es lo único que de verdad funciona. */

  it('no repite slugs de categoría', () => {
    const slugs = categorias.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('no repite referencias de pieza en toda la web', () => {
    const refs = lineas.flatMap((l) => l.piezas.map((p) => p.ref));
    const repetidas = refs.filter((ref, i) => refs.indexOf(ref) !== i);
    expect(repetidas).toEqual([]);
  });

  it('todas las fotos existen en public/', () => {
    const perdidas = lineas
      .flatMap((l) => l.piezas)
      .filter((p) => !existsSync(path.join(RAIZ, 'public', p.src)))
      .map((p) => `${p.ref} → ${p.src}`);
    expect(perdidas).toEqual([]);
  });

  it('cada foto trae su tamaño real, para reservar el hueco y no dar saltos', () => {
    for (const pieza of lineas.flatMap((l) => l.piezas)) {
      expect(pieza.ancho, pieza.ref).toBeGreaterThan(0);
      expect(pieza.alto, pieza.ref).toBeGreaterThan(0);
    }
  });

  /* Las once fotos de portada son las que se ven en las tarjetas y en la cabecera
     de cada ficha: si alguna vuelve a caer a los ~300 px que tenía el repositorio
     antes de recuperar los originales del WordPress, la web se ve borrosa justo
     por donde más se mira. Se recuperan con `npm run media:recuperar`. */
  it('ninguna foto de portada baja de 1000 px de lado mayor', () => {
    const borrosas = lineas
      .filter((l) => Math.max(l.portada.ancho, l.portada.alto) < 1000)
      .map((l) => `${l.portada.ref} (${l.portada.ancho}×${l.portada.alto}) en ${l.href}`);
    expect(borrosas).toEqual([]);
  });

  it('la portada de cada línea es la primera de su galería', () => {
    for (const linea of lineas) {
      expect(linea.piezas[0]?.ref, linea.href).toBe(linea.portada.ref);
    }
  });

  it('todas las líneas tienen al menos un precio positivo', () => {
    for (const linea of lineas) {
      expect(linea.precios.length, linea.href).toBeGreaterThan(0);
      expect(precioMinimo(linea), linea.href).toBeGreaterThan(0);
    }
  });

  it('el texto alternativo describe la pieza y nombra su referencia', () => {
    for (const pieza of lineas.flatMap((l) => l.piezas)) {
      expect(pieza.alt.length, pieza.ref).toBeGreaterThan(20);
      expect(pieza.alt).toContain(pieza.ref);
    }
  });

  it('las categorías de una sola línea son su propia ficha', () => {
    for (const categoria of categorias) {
      expect(categoria.esFicha).toBe(categoria.lineas.length === 1);
      if (categoria.esFicha) {
        expect(categoria.lineas[0]!.href).toBe(categoria.href);
      }
    }
  });

  it('formatea los precios en euros y en español', () => {
    expect(formatearPrecio(200).replace(/ /g, ' ')).toBe('200 €');
  });
});
