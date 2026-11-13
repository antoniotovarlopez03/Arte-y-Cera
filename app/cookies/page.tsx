import type { Metadata } from 'next';
import Link from 'next/link';
import { BotonCambiarCookies } from '@/components/layout/aviso-cookies';
import { PaginaTexto } from '@/components/ui/pagina-texto';
import { ULTIMA_REVISION } from '@/content/legal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Cookies',
  description: 'Qué cookies usa esta web, para qué sirven y cómo cambiar tu elección.',
  alternates: { canonical: '/cookies' },
  robots: { index: false, follow: true },
};

export default function PaginaCookies() {
  return (
    <PaginaTexto titulo="Cookies" entradilla={`Última revisión: ${ULTIMA_REVISION}.`}>
      <section>
        <h2>Dos herramientas de analítica, y solo si aceptas</h2>
        <p>
          Esta web usa dos herramientas con cookies, las dos para entender cómo se usa y poder
          mejorarla: <strong>Google Analytics</strong>, que cuenta las visitas y las páginas más
          vistas, y <strong>Microsoft Clarity</strong>, que enseña de forma anónima cómo se navega por
          el catálogo (dónde se hace clic, hasta dónde se baja en cada página). No hay publicidad ni
          píxel de Meta.
        </p>
        <p>
          Ninguna deja cookies hasta que pulsas «Aceptar» en el aviso. Si lo rechazas, no se
          instala ninguna cookie de analítica y la web funciona exactamente igual.
        </p>
      </section>

      <section>
        <h2>Google Analytics y Google Tag Manager</h2>
        <p>
          Google Analytics se carga a través de <strong>Google Tag Manager</strong>, un gestor de
          etiquetas que no deja cookies por sí mismo. Se usa el modo de consentimiento de Google:
          mientras no aceptes, Analytics no guarda cookies ni identificadores en tu navegador, y los
          permisos de publicidad están siempre desactivados. Si aceptas, deja estas cookies:
        </p>
        <ul>
          <li>
            <strong>_ga</strong>: distingue de forma anónima a un navegador de otro para contar
            visitantes. Dura dos años.
          </li>
          <li>
            <strong>_ga_&lt;ID&gt;</strong>: guarda el estado de la visita en curso. Dura dos años.
          </li>
        </ul>
        <p>
          Las gestiona Google Ireland Limited, que puede tratar los datos fuera de la Unión Europea
          con las garantías del Marco de Privacidad de Datos UE-EE. UU. Más detalles en la{' '}
          <a href="https://policies.google.com/technologies/cookies?hl=es" target="_blank" rel="noopener">
            información de Google sobre cookies
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Las cookies de Clarity</h2>
        <ul>
          <li>
            <strong>_clck</strong>: identifica de forma anónima al navegador para no contar dos
            veces la misma visita. Dura un año.
          </li>
          <li>
            <strong>_clsk</strong>: agrupa las páginas que ves en una misma visita. Dura un día.
          </li>
        </ul>
        <p>
          Las gestiona Microsoft Corporation, que puede tratar los datos fuera de la Unión Europea
          con las garantías del Marco de Privacidad de Datos UE-EE. UU. Clarity oculta
          automáticamente lo que escribes en los formularios. Más detalles en la{' '}
          <a href="https://privacy.microsoft.com/es-es/privacystatement" target="_blank" rel="noopener">
            declaración de privacidad de Microsoft
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Lo que no necesita tu permiso</h2>
        <p>
          La cesta guarda en tu navegador (localStorage) las referencias de las piezas que vas
          añadiendo y tu elección sobre las cookies. Es necesario para que la web funcione y nunca
          sale de tu dispositivo. Las visitas se cuentan además con Vercel Web Analytics, que no usa
          cookies ni identifica a nadie.
        </p>
        <p>
          Las fuentes tipográficas y las imágenes se sirven desde este mismo dominio, y los botones
          de WhatsApp e Instagram son enlaces normales: no cargan nada de esas empresas hasta que
          los pulsas.
        </p>
      </section>

      <section>
        <h2>Cambiar de opinión</h2>
        <p>Puedes aceptar o retirar tu permiso cuando quieras:</p>
        <BotonCambiarCookies />
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
