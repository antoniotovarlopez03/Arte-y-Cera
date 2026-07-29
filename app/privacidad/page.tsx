import type { Metadata } from 'next';
import Link from 'next/link';
import { AvisoIncompleto, PaginaTexto } from '@/components/ui/pagina-texto';
import { faltanDatosDelTitular, TITULAR, ULTIMA_REVISION } from '@/content/legal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacidad',
  description: 'Qué datos recoge la web de Arte y Cera, para qué y durante cuánto tiempo.',
  alternates: { canonical: '/privacidad' },
  robots: { index: false, follow: true },
};

export default function PaginaPrivacidad() {
  return (
    <PaginaTexto
      titulo="Privacidad"
      entradilla={`Qué datos pedimos, para qué los usamos y cuánto los guardamos. Última revisión: ${ULTIMA_REVISION}.`}
    >
      {faltanDatosDelTitular() && <AvisoIncompleto />}

      <section>
        <h2>Quién trata tus datos</h2>
        <ul>
          <li>Responsable: {TITULAR.nombre ?? '— pendiente —'}</li>
          <li>NIF: {TITULAR.nif ?? '— pendiente —'}</li>
          <li>Domicilio: {TITULAR.direccion ?? '— pendiente —'}</li>
          <li>
            Contacto: <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
        </ul>
      </section>

      <section>
        <h2>Qué datos recogemos y para qué</h2>
        <p>
          Solo los que escribes en el formulario de contacto: nombre, correo electrónico y, si
          quieres, teléfono, la fecha de tu celebración y lo que nos cuentes en el mensaje. Se usan
          para una única cosa: responderte y preparar el presupuesto de tu encargo.
        </p>
        <p>
          No hay analítica, ni píxeles de redes sociales, ni perfilado, ni cesión de datos a nadie
          con fines publicitarios. Tampoco se envían boletines: si no nos escribes, no te
          escribimos.
        </p>
      </section>

      <section>
        <h2>Base legal</h2>
        <p>
          Tu consentimiento, que das al marcar la casilla del formulario, y el interés legítimo en
          atender la consulta que nos haces. Puedes retirarlo cuando quieras escribiéndonos.
        </p>
      </section>

      <section>
        <h2>Cuánto tiempo los guardamos</h2>
        <p>
          El mensaje se conserva mientras dure la conversación y, si el encargo se hace, durante los
          plazos que exige la normativa fiscal. Si la consulta no llega a nada, se borra en cuanto
          deja de tener sentido conservarla.
        </p>
      </section>

      <section>
        <h2>Quién más ve tus datos</h2>
        <p>
          El correo del formulario se envía a través de <strong>Resend</strong> (Resend, Inc.), que
          actúa como encargado del tratamiento, y se recibe en el buzón de {site.email}. El
          alojamiento de la web corre en <strong>Vercel</strong>. Ninguno de los dos usa tus datos
          para otra cosa que prestar el servicio.
        </p>
      </section>

      <section>
        <h2>Tus derechos</h2>
        <p>
          Puedes pedirnos acceso a tus datos, su corrección, su supresión, la limitación del
          tratamiento o su portabilidad, escribiendo a{' '}
          <a href={`mailto:${site.email}`}>{site.email}</a>. Si crees que no lo hemos hecho bien,
          puedes reclamar ante la Agencia Española de Protección de Datos (aepd.es).
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Esta web no usa cookies ni ninguna otra tecnología de seguimiento. Lo contamos con más
          detalle en <Link href="/cookies">la página de cookies</Link>.
        </p>
      </section>
    </PaginaTexto>
  );
}
