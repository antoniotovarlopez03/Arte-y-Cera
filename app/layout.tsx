import type { Metadata, Viewport } from 'next';
import { Jost, Playfair_Display } from 'next/font/google';
import './globals.css';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { BotonWhatsapp } from '@/components/layout/boton-whatsapp';
import { site } from '@/lib/site';

/* Las fuentes se sirven desde el propio dominio (next/font las descarga en
   build). La web original las pedía a fonts.googleapis.com en cada visita:
   dos conexiones extra antes de poder pintar el texto. */
const display = Playfair_Display({
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
        <SiteHeader />
        <main id="contenido" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <BotonWhatsapp />
      </body>
    </html>
  );
}
