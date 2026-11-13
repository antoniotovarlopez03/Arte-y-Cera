import type { Metadata, Viewport } from 'next';
import { Analytics } from '@vercel/analytics/next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { BotonWhatsapp } from '@/components/layout/boton-whatsapp';
import { AvisoCookies } from '@/components/layout/aviso-cookies';
import { BarraEnvios } from '@/components/layout/barra-envios';
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

/* Las fuentes se sirven desde el propio dominio. La web original las pedía a
   fonts.googleapis.com en cada visita: dos conexiones extra antes de poder
   pintar el texto.

   Los archivos están guardados en app/fuentes (versión variable, subconjunto
   latino, licencia SIL Open Font License) en lugar de descargarse de Google
   Fonts en cada build: si Google no responde a tiempo, el build fallaba y la
   web no se publicaba (pasó el 10/11/2026 con Jost).

   EB Garamond es la que Antonio eligió para su propio WordPress. Sustituye a
   Playfair Display, que venía del sitio que le montaron: Playfair es una didone
   de alto contraste, de portada de revista de moda, y al lado de unas velas de
   cera hechas a mano queda fría. La Garamond es una humanista, más cálida y
   más de oficio, y va con el verde que también es suyo.

   Tiene el ojo medio más pequeño, así que los cuerpos de los titulares están
   subidos respecto a lo que pedía Playfair. */
const display = localFont({
  src: './fuentes/eb-garamond-latin-variable.woff2',
  weight: '500 700',
  style: 'normal',
  variable: '--fuente-display',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

const sans = localFont({
  src: './fuentes/jost-latin-variable.woff2',
  weight: '300 600',
  style: 'normal',
  variable: '--fuente-sans',
  display: 'swap',
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
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

/* Google Tag Manager solo en producción: en `next dev` no queremos ensuciar
   las estadísticas con nuestras propias visitas. */
const GTM_ACTIVO = process.env.NODE_ENV === 'production';

/* Modo de consentimiento v2 de Google. Tiene que ejecutarse ANTES de que
   cargue GTM, por eso va como <script> normal en el <head> y GTM después,
   con next/script. Todo empieza denegado; si el visitante ya aceptó en una
   visita anterior (lib/consentimiento.ts guarda «aceptadas» en localStorage)
   se concede la analítica aquí mismo, antes de que GTM lea el estado. La
   publicidad se queda denegada siempre: esta web no hace publicidad. */
const CONSENTIMIENTO_POR_DEFECTO = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
try {
  if (localStorage.getItem('arteycera-cookies') === 'aceptadas') {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }
} catch (e) {}
`;

const FRAGMENTO_GTM = `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${site.gtmId}');
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      {GTM_ACTIVO && (
        <head>
          <script id="consentimiento-google" dangerouslySetInnerHTML={{ __html: CONSENTIMIENTO_POR_DEFECTO }} />
          <Script id="gtm" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: FRAGMENTO_GTM }} />
        </head>
      )}
      <body className="flex min-h-dvh flex-col antialiased">
        {GTM_ACTIVO && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${site.gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-verde focus:px-5 focus:py-2 focus:text-sm focus:text-ivory"
        >
          Saltar al contenido
        </a>
        <BarraEnvios />
        <SiteHeader colecciones={COLECCIONES_MENU} piezas={PIEZAS_CESTA} />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BotonWhatsapp />
        <AvisoCookies />
        <Analytics />
      </body>
    </html>
  );
}
