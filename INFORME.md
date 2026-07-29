# Arte y Cera · qué se ha cambiado y por qué

Para Antonio. Está escrito para leerse sin saber programar; lo técnico va al final.

**Puedes verla aquí:** https://arte-y-cera.vercel.app

Tu web actual (arteycera.es) **sigue funcionando y no se ha tocado nada**. Esto es una versión
nueva en paralelo, para que la veas y decidas.

---

## 1. Lo que estaba roto

### El formulario de contacto no enviaba nada

Es lo más serio de todo. Cuando alguien rellenaba el formulario y pulsaba «Enviar mensaje», la
web le respondía *«¡Gracias! Tu mensaje se ha preparado. Te responderemos muy pronto»*… y no
enviaba nada a ninguna parte. El mensaje se perdía y la persona se quedaba esperando una
respuesta que no podía llegar.

No sabemos cuántos encargos se han perdido así, pero cada uno de ellos creía haber contactado
contigo.

### Faltaban dos imágenes en el repositorio

La foto de portada (`portada-miguel.jpg`) estaba en la web publicada, pero nunca se subió al
repositorio de GitHub. Consecuencia práctica: si alguien descargaba el proyecto para trabajar en
él, la web salía con la portada roto. También era la imagen que se veía al compartir el enlace por
WhatsApp.

### La web pesaba 4,8 MB y tardaba 10 segundos en aparecer

Sobre todo por los vídeos: uno solo ocupaba 12,5 MB. En un móvil con datos, la foto principal
tardaba **9,9 segundos** en verse. La mayoría de la gente se va antes.

### Google apenas podía entenderla

- No había `robots.txt` ni mapa del sitio: Google solo conocía la portada.
- Toda la web era **una sola página**, así que no existía ninguna dirección propia para «cirios
  pascuales» o «velas de bautizo». Quien busca «vela de bautizo personalizada» no tenía a dónde
  llegar.
- El subdominio de Netlify (`resplendent-dodol-376226.netlify.app`) servía exactamente lo mismo
  que arteycera.es: dos webs idénticas compitiendo entre ellas.

### No había aviso legal, privacidad ni cookies

Con un formulario que recoge nombre y correo, eso es obligatorio en España (LSSI y RGPD).

---

## 2. Lo que hace la web nueva

### Cada colección y cada acabado tiene su página

```
arteycera.es/colecciones
arteycera.es/colecciones/cirios-pascuales
arteycera.es/colecciones/cirios-pascuales/elaborados
arteycera.es/colecciones/velas-de-bautizo/al-detalle
…
```

Son 17 páginas donde antes había una. Cada una con su título, su descripción y su precio, que es
lo que Google necesita para enseñarlas a quien busca justo eso.

### Cada foto tiene un código

Debajo de cada foto verás algo como **CP-E-18** o **BZ-B-15**. Y en cada pieza hay un botón
«Preguntar por la CP-E-18» que abre WhatsApp **con el mensaje ya escrito**.

Esto es lo que más te va a cambiar el día a día: se acabó el «quiero una como la de la foto,
¿cuál? la tercera… ¿la de arriba?». El cliente te dice el código y las dos personas sabéis
exactamente de qué vela se habla. Además, el enlace de una pieza concreta se puede compartir: si
una novia le manda a su madre `…/basicas?pieza=MB-B-07`, se le abre esa vela y no otra.

### El precio, siempre a la vista

En las tarjetas, en la ficha y en una barra fija abajo cuando se mira desde el móvil. Con el
tamaño, qué incluye y qué pasa con los plazos.

### El formulario funciona de verdad

Ahora envía el mensaje a `contacto@arteycera.es`, con anti-spam, y con el botón de WhatsApp al
lado por si la persona prefiere eso. **Y si algún día el envío falla, lo dice** en lugar de
fingir que ha ido bien.

Para que funcione en la web publicada hace falta una cosa tuya: una clave gratuita de
[Resend](https://resend.com) (ver punto 4).

### Va mucho más rápido

Medido con Lighthouse de Google, en móvil:

|                              | Antes (arteycera.es) | Ahora   |
| ---------------------------- | -------------------- | ------- |
| Nota de rendimiento          | 62                   | **93**  |
| Nota de accesibilidad        | 95                   | **100** |
| Peso de la página            | 4.803 KB             | **517 KB** |
| Tiempo hasta ver la foto     | 9,9 s                | **3,1 s** |
| Tiempo hasta ver algo        | 3,0 s                | **0,9 s** |

Se han quitado la esfera 3D, el cielo de estrellas, el halo del cursor, los contadores que subían
y los fondos animados. No es que estuvieran mal hechos: es que competían con las fotos de tus
velas, y las velas son lo que vende.

### Sin cookies y sin banner

No hay analítica ni scripts de nadie, así que no hay cookies que consentir y no hace falta el
molesto aviso. Las fuentes y las imágenes se sirven desde tu propio dominio.

---

## 3. Dos cosas que hay que hablar

### Las fotos son pequeñas

**147 de tus 166 fotos miden unos 300 píxeles de ancho.** Son diminutas: al ampliarlas se ven los
píxeles, y justo lo que vende una vela pintada a mano es acercarse y ver el trazo.

La web está hecha para que eso no cante (nunca amplía una foto más de lo razonable), pero la
solución de verdad es mandar los originales. Si puedes, empieza por estas ocho, que son las que
salen de portada en cada colección:

```
CP-B-02   CP-E-18   BZ-L-04   BZ-B-15
BZ-E-04   BZ-D-19   MB-B-03   MB-E-01
```

Importante: **manda las fotos originales, no reenviadas por WhatsApp**, porque WhatsApp las
reduce. Las de Navidad y las de toallas (1.100 px) están bien: se ven perfectas.

### La foto de portada anterior era de inteligencia artificial

La imagen del taller que había en la portada estaba generada con IA, y se nota: las dos personas
no tienen cara. En un negocio que vende trabajo hecho a mano, la primera imagen que ve alguien no
puede ser una imagen falsa: es justo lo que hace dudar de si las velas son de verdad.

La portada nueva usa una de tus fotos reales (las toallas de Lorenzo y María con sus velas).
Cuando tengas una foto buena del taller de verdad, con vosotros trabajando, se cambia en un
minuto y será mucho mejor que cualquier imagen generada.

---

## 4. Qué necesito de ti

1. **Datos fiscales** para el aviso legal y la privacidad: nombre o razón social, NIF y un
   domicilio. Sin eso esas dos páginas están incompletas y no se pueden publicar.
2. **Una clave de Resend** para que el formulario envíe correo (es gratis hasta 3.000 correos al
   mes). Hay que añadir dos registros en el DNS del dominio; te lo hago yo si me das acceso.
3. **Plazos reales**: cuánto tardas en un cirio, cuánto en una vela de bautizo, si pides anticipo,
   cuánto cuesta el envío. Ahora la ficha dice «escríbenos y te confirmamos», que es honesto pero
   es la duda número uno de quien tiene una fecha marcada.
4. **Confirmar los precios**. Los he copiado tal cual estaban en tu web: 200/260 € los cirios,
   20/30/35/40 € las de bautizo, 55/100 y 70/130 € las de mesa, 20 € Navidad, 18 € las toallas y
   15 € la toalla junto a la vela.
5. **Las fotos originales**, aunque sea por tandas.

---

## 5. Cómo cambiar cosas tú mismo

Todo el catálogo está en un único archivo: `content/catalogo.ts`. Para cambiar un precio, buscas
la línea y cambias el número:

```ts
precios: [{ importe: 260 }],     // los cirios elaborados
```

Para añadir fotos: las copias en su carpeta de `public/images/colecciones/` con el nombre que
siguen las demás (`cirios-basicos-11.webp`) y ejecutas `npm run catalogo:generar`. Las referencias
se calculan solas.

Si te equivocas en algo importante, **la web no se publica**: el proceso de compilación se detiene
y dice qué está mal. Es a propósito, para que no se pueda publicar un catálogo con una foto que no
existe o un precio en blanco.

Está todo explicado en el `README.md`.

---

## 6. Cuando quieras publicarla

La web nueva está en una dirección temporal (`arte-y-cera.vercel.app`) que **no aparece en Google**
a propósito: mientras tu web actual siga siendo la oficial, no queremos dos webs iguales
compitiendo.

El día que decidas cambiar:

1. Apuntar arteycera.es a Vercel (dos registros de DNS).
2. Activar la variable `SITIO_PUBLICO=1`, que es la que da permiso a Google para indexar.
3. Bloquear el subdominio antiguo de Netlify para cerrar el contenido duplicado.

Es reversible: si algo no te gusta, se vuelve a Netlify en cinco minutos.
