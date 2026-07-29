import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/* Recorrido de un cliente real: entra, busca su celebración, mira una vela y
   pregunta. Si esto se rompe, el negocio pierde encargos. */

test('la portada lleva al catálogo', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Velas pintadas a mano');
  await page.getByRole('link', { name: 'Ver colecciones' }).click();
  await expect(page).toHaveURL('/colecciones');
  await expect(page.getByRole('heading', { name: 'Nuestras colecciones' })).toBeVisible();
});

test('de la colección a la ficha, con el precio a la vista', async ({ page }) => {
  await page.goto('/colecciones');
  await page
    .getByRole('link', { name: /Cirios pascuales/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/colecciones\/cirios-pascuales$/);

  await page
    .getByRole('link', { name: /Elaborados/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/colecciones\/cirios-pascuales\/elaborados$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Elaborados');
  await expect(page.getByText('260 €').first()).toBeVisible();
  await expect(page.getByText('70 × 7 cm')).toBeVisible();
});

test('la galería abre la pieza, la refleja en la URL y cierra con Escape', async ({ page }) => {
  await page.goto('/colecciones/cirios-pascuales/elaborados');

  const dialogo = page.getByRole('dialog');
  await expect(dialogo).toBeHidden();

  await page
    .getByRole('button', { name: /Ver Elaborados CP-E-/ })
    .first()
    .click();
  await expect(dialogo).toBeVisible();
  await expect(page).toHaveURL(/\?pieza=CP-E-\d+/);

  // Flechas del teclado: cambia la pieza y la URL la sigue.
  const primera = new URL(page.url()).searchParams.get('pieza');
  await page.keyboard.press('ArrowRight');
  await expect(page).not.toHaveURL(new RegExp(`pieza=${primera}$`));

  await page.keyboard.press('Escape');
  await expect(dialogo).toBeHidden();
  await expect(page).toHaveURL(/\/colecciones\/cirios-pascuales\/elaborados$/);
});

test('un enlace con ?pieza abre esa pieza directamente', async ({ page }) => {
  await page.goto('/colecciones/velas-de-navidad?pieza=NV-05');
  const dialogo = page.getByRole('dialog');
  await expect(dialogo).toBeVisible();
  await expect(dialogo.getByText('NV-05').first()).toBeVisible();
});

test('las categorías de una sola línea no tienen página intermedia', async ({ page }) => {
  await page.goto('/colecciones/velas-de-navidad');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Velas de Navidad');
  await expect(page.getByText('20 €').first()).toBeVisible();

  // La ruta de tercer nivel no existe para estas categorías.
  const respuesta = await page.request.get('/colecciones/velas-de-navidad/velas-de-navidad');
  expect(respuesta.status()).toBe(404);
});

test('el botón de WhatsApp lleva la referencia de la pieza', async ({ page }) => {
  await page.goto('/colecciones/velas-de-navidad?pieza=NV-05');
  const enlace = page.getByRole('link', { name: /Preguntar por la NV-05/ });
  const href = await enlace.getAttribute('href');
  expect(href).toContain('wa.me/34667241539');
  expect(decodeURIComponent(href ?? '')).toContain('NV-05');
});

test('el formulario avisa de los campos que faltan', async ({ page }) => {
  await page.goto('/contacto');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByText('Repasa los campos marcados.')).toBeVisible();
  await expect(page.getByText('Dinos cómo te llamas')).toBeVisible();
});

test('la ficha precarga el interés en el formulario', async ({ page }) => {
  await page.goto('/colecciones/cirios-pascuales/elaborados');
  await page.getByRole('link', { name: 'Pedir presupuesto por email' }).click();
  await expect(page.locator('select#interes')).toHaveValue('Cirios pascuales · Elaborados');
});

const PAGINAS = [
  '/',
  '/colecciones',
  '/colecciones/cirios-pascuales',
  '/colecciones/cirios-pascuales/elaborados',
  '/contacto',
  '/taller',
];

for (const ruta of PAGINAS) {
  test(`sin fallos de accesibilidad en ${ruta}`, async ({ page }) => {
    await page.goto(ruta);
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    // El mensaje incluye el selector del elemento culpable: si algún día falla,
    // se sabe qué arreglar sin volver a ejecutar nada.
    expect(
      violations.map(
        (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`,
      ),
    ).toEqual([]);
  });
}
