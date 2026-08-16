import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { site } from '@/lib/site';

/**
 * Imagen que se ve al compartir el enlace en WhatsApp, Instagram o Google.
 *
 * En la web original apuntaba a una imagen del subdominio de Netlify que ni
 * siquiera estaba en el repositorio, así que el enlace se compartía sin
 * previsualización. Aquí se genera en el build a partir de una foto real.
 */
export const alt = 'Arte y Cera · Velas pintadas a mano';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Imagen() {
  const logo = await readFile(
    path.join(process.cwd(), 'public/images/logo/logo-portada.png'),
  );
  const logoBase64 = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: '#faf7f0',
        color: '#0f0d0b',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '72px',
          width: '58%',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#14453d',
          }}
        >
          Hecho a mano · Pieza única
        </div>
        <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>
          Velas pintadas a mano, una a una
        </div>
        <div style={{ width: 96, height: 3, backgroundColor: '#14453d', marginTop: 32 }} />
        <div style={{ fontSize: 28, color: '#4a4038', marginTop: 32, lineHeight: 1.4 }}>
          Cirios pascuales, bautizos, bodas y Navidad
        </div>
        <div style={{ fontSize: 24, color: '#4a4038', marginTop: 40 }}>
          {site.url.replace('https://', '')}
        </div>
      </div>

      {/* El logo, no una foto de producto: es lo que pidió Antonio para la
          previsualización del enlace. Centrado sobre el mismo verde oscuro
          de marca, no sobre su propio fondo negro, para que no desentone con
          el crema de la izquierda. */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '42%',
          height: '100%',
          backgroundColor: '#0e332d',
        }}
      >
        {/* No es una etiqueta de la web: la renderiza Satori para componer el
            PNG, así que next/image no tiene sentido aquí. */}
        <img src={logoBase64} alt="" width={400} height={400} style={{ width: 320, height: 320 }} />
      </div>
    </div>,
    size,
  );
}
