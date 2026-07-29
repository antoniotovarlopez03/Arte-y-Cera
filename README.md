# Arte y Cera

Web de [Arte y Cera](https://arteycera.es): catálogo de velas artesanales pintadas a mano y
toallas bordadas, con formulario de contacto. No es una tienda: no hay carrito ni pagos, los
encargos se acuerdan por WhatsApp o correo.

Hecha con Next.js 16 (App Router), TypeScript y Tailwind 4. Todo el catálogo se genera en el
build, así que la web se sirve como HTML estático.

---

## Lo que hay que saber para tocarla

### Cambiar un precio o un texto

Todo el catálogo vive en un solo archivo: **[`content/catalogo.ts`](content/catalogo.ts)**.

```ts
{
  slug: 'basicos',            // la dirección de la página: no cambiarlo sin motivo
  nombre: 'Básicos',
  resumen: 'Fondo en un color, con la cruz, el año y los trazos en oro.',
  precios: [{ importe: 200 }],          // en euros, sin el símbolo €
  notaPrecio: 'Para otros tamaños, consultar precio.',
  medidas: '70 × 7 cm',
  incluye: ['El cirio', 'La pintura a mano'],
  altBase: 'Cirio pascual básico pintado a mano',   // descripción para buscadores y lectores de pantalla
  carpeta: 'cirios-basicos',            // carpeta de fotos en public/images/colecciones
  portadaRef: 'CP-B-02',                // la foto que se ve en las tarjetas
}
```

Si te equivocas en algo (una carpeta que no existe, una portada que no está en su carpeta, un
precio en cero), **el build falla y te dice exactamente qué está mal**. No se puede publicar un
catálogo roto.

### Añadir fotos nuevas

1. Copia las fotos en la carpeta que toque, dentro de `public/images/colecciones/`, siguiendo el
   nombre que ya usan las demás: `cirios-basicos-11.webp`, `navidad-10.jpeg`… **El número final
   es obligatorio**, porque es de donde sale la referencia de la pieza.
2. Ejecuta:

   ```bash
   npm run catalogo:generar
   ```

   Eso reescribe `content/piezas.generado.ts` con todas las fotos, sus tamaños reales y su
   referencia (`CP-B-11`). Ese archivo **no se edita a mano**.
3. Arranca la web y compruébalo: `npm run dev`.

Las referencias no se renumeran nunca: son el código que el cliente escribe por WhatsApp
(«me gusta la CP-E-18»).

### Crear una colección nueva

1. Crea su carpeta en `public/images/colecciones/` con las fotos numeradas.
2. Añádele un prefijo de referencia en `PREFIJOS`, dentro de
   [`scripts/generar-catalogo.mjs`](scripts/generar-catalogo.mjs). Si te lo saltas, el script te
   avisa y no continúa.
3. `npm run catalogo:generar`.
4. Añade la categoría en `content/catalogo.ts`.

---

## Comandos

| Comando                    | Para qué                                                             |
| -------------------------- | -------------------------------------------------------------------- |
| `npm run dev`              | Levanta la web en local (http://localhost:3000)                      |
| `npm run build`            | Compila para producción; falla si el catálogo tiene errores          |
| `npm run catalogo:generar` | Reescribe las piezas a partir de las fotos que hay en `public/`      |
| `npm run media:auditar`    | Dice qué fotos son demasiado pequeñas y por cuáles empezar a reponer |
| `npm test`                 | Pruebas del catálogo y del formulario                                |
| `npm run test:e2e`         | Recorrido completo en el navegador + accesibilidad (axe)             |
| `npm run typecheck`        | Comprueba los tipos                                                  |
| `npm run lint`             | ESLint                                                               |

## Variables de entorno

Copia `.env.example` a `.env.local` y rellena lo que necesites. La única imprescindible para que
el formulario envíe correo es `RESEND_API_KEY`. **Sin ella la web funciona igual**, pero el
formulario avisa de que no puede enviar y ofrece WhatsApp y correo: nunca finge un envío
correcto (que es exactamente lo que hacía la web anterior).

## Estructura

```
app/                    páginas (App Router)
  colecciones/          índice, categoría y ficha de producto
  contacto/             formulario + Server Action que envía el correo
  aviso-legal, privacidad, cookies
components/
  catalogo/             tarjetas, precio, galería con lightbox, ficha
  layout/               cabecera, pie, botón de WhatsApp
content/
  catalogo.ts           EL CATÁLOGO: precios y textos (se edita a mano)
  piezas.generado.ts    las 166 fotos (generado, no tocar)
  legal.ts              datos del titular para las páginas legales
lib/
  catalogo/             validación con zod y consultas del catálogo
  seo.ts                datos estructurados para Google
  site.ts               teléfono, correo, Instagram
scripts/                generador del catálogo y auditoría de fotos
e2e/, tests/            pruebas
legacy/                 la web estática anterior, solo como referencia
```

## Decisiones que conviene no deshacer sin pensarlo

- **El precio siempre a la vista**, como número. Es lo primero que busca quien compara.
- **Cada foto lleva su referencia.** Es el puente entre la web y el WhatsApp por el que entran
  los encargos.
- **Sin cookies, sin analítica, sin scripts de terceros.** Por eso no hay banner de cookies:
  no hay nada que consentir.
- **La galería usa `<dialog>` nativo**, así que el foco se atrapa y se devuelve solo, y funciona
  con teclado sin código nuestro.
- **Las fotos no se amplían más de 1,4× (ficha) o 2× (galería).** 147 de las 166 fotos actuales
  son de 300 px; estirarlas solo enseña los píxeles. Cuando lleguen los originales se ven mejor
  sin cambiar nada.
- **`legacy/` se borra** cuando la web nueva esté aprobada; está solo para comparar textos.
