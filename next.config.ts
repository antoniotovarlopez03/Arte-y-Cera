import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // La optimización de imágenes de Vercel (el paso que redimensiona cada
  // foto al vuelo) tiene una cuota gratuita mensual, y con 166 piezas por
  // varios tamaños de pantalla se agota antes de fin de mes: cuando se
  // agota, Vercel devuelve 402 y las fotos dejan de cargar en toda la web.
  // Las fotos ya vienen redimensionadas y comprimidas a un tamaño razonable
  // desde `recuperar-originales.mjs` (máximo 1600 px, WebP), así que no hace
  // falta que Vercel las procese otra vez: se sirven tal cual.
  images: {
    unoptimized: true,
  },

  // Cabeceras de seguridad básicas. La web no usa scripts de terceros ni
  // analítica, así que la CSP puede ser estricta de verdad.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
