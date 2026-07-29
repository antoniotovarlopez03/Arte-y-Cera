import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Las fotos de producto viven en public/ y son de origen propio: no hace
  // falta remotePatterns. Se limitan los tamaños generados a los que la web
  // usa de verdad (ver la prop `sizes` de cada componente) para no producir
  // decenas de variantes que nadie pide.
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1920],
    imageSizes: [160, 224, 300, 384],
    // Next 16 exige declarar las calidades que se pueden pedir. Las fotos de
    // producto son pequeñas (300 px la mayoría) y se ven mejor con 90 que con
    // el 75 por defecto; el peso extra es de unos pocos KB.
    qualities: [75, 90],
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
