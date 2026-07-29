import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaTexto } from '@/components/ui/pagina-texto';
import { ULTIMA_REVISION } from '@/content/legal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cookies',
  description: 'Esta web no usa cookies ni herramientas de seguimiento.',
  alternates: { canonical: '/cookies' },
  robots: { index: false, follow: true },
};

export default function PaginaCookies() {
  return (
    <PaginaTexto titulo="Cookies" entradilla={`Última revisión: ${ULTIMA_REVISION}.`}>
      <section>
        <h2>Esta web no usa cookies</h2>
        <p>
          Ni propias ni de terceros. No hay analítica, ni Google Analytics, ni píxel de Meta, ni
          mapas incrustados, ni vídeos de YouTube que dejen rastro. Por eso no verás un aviso de
          cookies pidiéndote permiso: no hay nada que autorizar.
        </p>
        <p>
          Es una decisión de diseño, no un descuido: el sitio es un catálogo y un formulario, y para
          eso no hace falta seguir a nadie.
        </p>
      </section>

      <section>
        <h2>Qué pasa cuando visitas la web</h2>
        <p>
          El servidor registra la petición (dirección IP, fecha, página pedida y navegador) en sus
          registros técnicos, como cualquier servidor web, para poder funcionar y detectar abusos.
          Esos registros no se cruzan con tus datos ni se usan para publicidad.
        </p>
        <p>
          Las fuentes tipográficas y las imágenes se sirven desde este mismo dominio, así que
          visitar la web no informa a ningún tercero de que has estado aquí.
        </p>
      </section>

      <section>
        <h2>Si escribes por WhatsApp o Instagram</h2>
        <p>
          Los botones de WhatsApp e Instagram son enlaces normales: no cargan nada de esas empresas
          mientras navegas. Solo cuando pulsas uno se abre su aplicación, y a partir de ahí manda su
          propia política de privacidad.
        </p>
      </section>

      <section>
        <h2>Dudas</h2>
        <p>
          Escríbenos a <a href={`mailto:${site.email}`}>{site.email}</a>. También puedes leer{' '}
          <Link href="/privacidad">cómo tratamos los datos del formulario</Link>.
        </p>
      </section>
    </PaginaTexto>
  );
}
