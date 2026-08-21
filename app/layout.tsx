import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { EB_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { BotonWhatsapp } from '@/components/layout/boton-whatsapp';
import { categorias, formatearPrecio, precioMinimo, todasLasPiezas } from '@/lib/catalogo';
import { site } from '@/lib/site';

/* El menú se arma aquí, en el servidor, y baja como prop. Si la cabecera
   importara el catálogo directamente, zod y las 162 piezas acabarían en el
   bundle del navegador solo para pintar seis enlaces. */
const COLECCIONES_MENU = categorias.map((categoria) => ({
  slug: categoria.slug,
  nombre: categoria.nombre,
  nombreMenu: categoria.nombreMenu ?? categoria.nombre,
  piezas: categoria.totalPiezas,
  href: categoria.href,
  desde: formatearPrecio(Math.min(...categoria.lineas.map(precioMinimo))),
  portada: {
    src: categoria.portada.src,
    alt: categoria.portada.alt,
    ancho: categoria.portada.ancho,
    alto: categoria.portada.alto,
  },
}));

/* Igual de plano, pero de piezas: es lo que necesita el panel de la cesta de
   la cabecera para enseñar la foto y el precio de lo que llevas, sin que
   ese componente tenga que importar el catálogo entero (ver el porqué justo
   arriba). */
const PIEZAS_CESTA = todasLasPiezas();

/* Las fuentes se sirven desde el propio dominio (next/font las descarga en
   build). La web original las pedía a fonts.googleapis.com en cada visita:
   dos conexiones extra antes de poder pintar el texto.

   EB Garamond es la que Antonio eligió para su propio WordPress. Sustituye a
   Playfair Display, que venía del sitio que le montaron: Playfair es una didone
   de alto contraste, de portada de revista de moda, y al lado de unas velas de
   cera pintadas a mano queda fría. La Garamond es una humanista, más cálida y
   más de oficio, y va con el verde que también es suyo.

   Tiene el ojo medio más pequeño, así que los cuerpos de los titulares están
   subidos respecto a lo que pedía Playfair. */
const display = EB_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--fuente-display',
  display: 'swap',
});

const sans = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--fuente-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.titulo,
    template: `%s · ${site.nombre}`,
  },
  description: site.descripcion,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: site.url,
    siteName: site.nombre,
    title: site.titulo,
    description: site.descripcion,
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  // Para dar de alta la web en Google Search Console y poder pedirle que
  // vuelva a rastrear una página (por ejemplo, tras cambiar el og:image).
  verification: { google: '8XYoAdzU6fv9fSbyWmbABYInevwn7-TuW3MwSWaTwSM' },
};

export const viewport: Viewport = {
  themeColor: '#faf7f0',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-verde focus:px-5 focus:py-2 focus:text-sm focus:text-ivory"
        >
          Saltar al contenido
        </a>
        <SiteHeader colecciones={COLECCIONES_MENU} piezas={PIEZAS_CESTA} />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BotonWhatsapp />
        <Analytics />
      </body>
    </html>
  );
}
