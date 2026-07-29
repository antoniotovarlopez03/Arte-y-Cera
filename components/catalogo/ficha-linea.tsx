import Image from 'next/image';
import Link from 'next/link';
import { GaleriaPiezas } from '@/components/catalogo/galeria-piezas';
import { Precio } from '@/components/catalogo/precio';
import { TarjetaLinea } from '@/components/catalogo/tarjeta-linea';
import { IconoFlecha, IconoWhatsapp } from '@/components/iconos';
import { Migas } from '@/components/ui/migas';
import type { Categoria, Linea, Pieza } from '@/lib/catalogo/esquemas';
import { site, whatsappUrl } from '@/lib/site';
import { clasesBoton } from '@/lib/ui';

/**
 * Ancho máximo al que conviene mostrar una foto: hasta 1,4× su tamaño real y
 * nunca más de 416 px. Las fotos que hay hoy son de 300 px, así que esto evita
 * la portada borrosa que saldría al estirarlas a media pantalla. Cuando lleguen
 * los originales, el tope de 416 px es el que manda y se ven nítidas.
 */
function anchoSeguro(pieza: Pieza, tope = 416): number {
  return Math.min(Math.round(pieza.ancho * 1.4), tope);
}

/**
 * Ficha de producto. La usan dos rutas:
 *   · /colecciones/[categoria]/[linea]      cuando la categoría tiene varias
 *   · /colecciones/[categoria]              cuando solo tiene una línea
 * De ese modo nunca hay una página intermedia con un solo elemento dentro.
 */
export function FichaLinea({ linea, categoria }: { linea: Linea; categoria: Categoria }) {
  const otras = categoria.lineas.filter((l) => l.slug !== linea.slug);
  const mensajeWhatsapp = `Hola, me interesan las ${linea.nombre.toLowerCase()} de ${categoria.nombre.toLowerCase()} que he visto en la web.`;

  return (
    <>
      <div className="mx-auto max-w-6xl px-5 pt-8">
        <Migas
          migas={[
            { href: '/', texto: 'Inicio' },
            { href: '/colecciones', texto: 'Colecciones' },
            ...(categoria.esFicha
              ? [{ texto: categoria.nombre }]
              : [{ href: categoria.href, texto: categoria.nombre }, { texto: linea.nombre }]),
          ]}
        />
      </div>

      <article className="mx-auto max-w-6xl px-5 pt-6 pb-16">
        <header className="grid gap-10 lg:grid-cols-[minmax(0,26rem)_1fr] lg:items-start lg:gap-14">
          {/* Foto de portada. Dos decisiones:
              · No se amplía más de 1,4× su tamaño real: las fotos actuales son
                de 300 px y estirarlas solo enseña píxeles.
              · object-contain en vez de cover, porque muchas fotos son montajes
                de varias vistas de la misma vela y recortarlas se come la mitad
                del trabajo. En la rejilla sí se recorta, por orden visual. */}
          <div className="mx-auto w-full" style={{ maxWidth: `${anchoSeguro(linea.portada)}px` }}>
            <Image
              src={linea.portada.src}
              alt={linea.portada.alt}
              width={linea.portada.ancho}
              height={linea.portada.alto}
              sizes="(max-width: 1024px) 92vw, 416px"
              quality={90}
              priority
              className="aspect-4/5 w-full rounded-pieza bg-cream object-contain p-2 shadow-pieza"
            />
          </div>

          {/* Precio, medidas y qué entra: la información que decide el
              encargo, arriba y sin acordeones. */}
          <div>
            {!categoria.esFicha && (
              <Link
                href={categoria.href}
                className="text-xs tracking-[0.14em] text-gold-ink uppercase hover:underline"
              >
                {categoria.nombre}
              </Link>
            )}
            <h1 className="mt-2 font-display text-4xl leading-tight font-bold text-ink sm:text-5xl">
              {categoria.esFicha ? categoria.nombre : linea.nombre}
            </h1>
            <span className="filete mt-5" />
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-soft">
              {linea.resumen}
            </p>

            <div className="mt-7 rounded-pieza border border-sand bg-cream/60 p-6 sm:p-7">
              <Precio precios={linea.precios} nota={linea.notaPrecio} tamano="grande" />

              <dl className="mt-6 space-y-4 text-sm">
                {linea.medidas && (
                  <div>
                    <dt className="text-ink-soft">Tamaño</dt>
                    <dd className="font-medium text-ink">{linea.medidas}</dd>
                  </div>
                )}
                {linea.incluye.length > 0 && (
                  <div>
                    <dt className="text-ink-soft">Incluye</dt>
                    <dd>
                      <ul className="mt-1.5 space-y-1.5">
                        {linea.incluye.map((item) => (
                          <li key={item} className="flex gap-2 text-ink">
                            <span
                              aria-hidden="true"
                              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-deep"
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-ink-soft">Plazo</dt>
                  <dd className="text-ink">
                    Se pinta por encargo. Escríbenos con la fecha de tu celebración y te confirmamos
                    si llegamos.
                  </dd>
                </div>
              </dl>

              <div className="mt-7 flex flex-col gap-3">
                <a
                  href={whatsappUrl(mensajeWhatsapp)}
                  target="_blank"
                  rel="noopener"
                  className={clasesBoton('whatsapp')}
                >
                  <IconoWhatsapp className="h-4 w-4" />
                  Pedir por WhatsApp
                </a>
                <Link
                  href={{ pathname: '/contacto', query: { pieza: linea.href } }}
                  className={clasesBoton('secundario')}
                >
                  Pedir presupuesto por email
                </Link>
              </div>
              <p className="mt-3 text-center text-xs text-ink-soft">{site.tiempoRespuesta}</p>
            </div>
          </div>
        </header>

        <p className="mt-14 max-w-prose text-base leading-relaxed text-ink-soft">
          {categoria.descripcion}
        </p>

        <section className="mt-14" aria-labelledby="titulo-piezas">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 id="titulo-piezas" className="font-display text-2xl font-semibold text-ink">
              {linea.piezas.length} piezas ya pintadas
            </h2>
            <p className="text-sm text-ink-soft">
              Cada foto lleva su referencia: dínosla y sabemos exactamente cuál te gusta.
            </p>
          </div>
          <div className="mt-6">
            <GaleriaPiezas piezas={linea.piezas} nombreLinea={linea.nombre} />
          </div>
        </section>

        {otras.length > 0 && (
          <section className="mt-20" aria-labelledby="titulo-otras">
            <h2 id="titulo-otras" className="font-display text-2xl font-semibold text-ink">
              Otros acabados de {categoria.nombre.toLowerCase()}
            </h2>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {otras.map((otra) => (
                <TarjetaLinea key={otra.slug} linea={otra} />
              ))}
            </div>
          </section>
        )}

        {categoria.esFicha && (
          <p className="mt-16 text-sm">
            <Link
              href="/colecciones"
              className="inline-flex items-center gap-2 text-ink-soft hover:text-ink"
            >
              <IconoFlecha className="h-4 w-4 rotate-180 text-gold-deep" />
              Ver todas las colecciones
            </Link>
          </p>
        )}
      </article>

      {/* Barra fija en móvil: en un catálogo se navega con el pulgar y el
          precio y el botón tienen que estar siempre a mano. */}
      <div className="sticky bottom-0 z-20 border-t border-sand bg-ivory/95 backdrop-blur-sm sm:hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-3">
          <Precio precios={linea.precios} />
          <a
            href={whatsappUrl(mensajeWhatsapp)}
            target="_blank"
            rel="noopener"
            className={clasesBoton('whatsapp', 'px-5 py-2.5')}
          >
            <IconoWhatsapp className="h-4 w-4" />
            Preguntar
          </a>
        </div>
      </div>
    </>
  );
}
