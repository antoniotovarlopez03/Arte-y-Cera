import type { Metadata } from 'next';
import { AvisoIncompleto, PaginaTexto } from '@/components/ui/pagina-texto';
import { faltanDatosDelTitular, TITULAR, ULTIMA_REVISION } from '@/content/legal';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Aviso legal',
  description: 'Información legal del titular de la web de Arte y Cera.',
  alternates: { canonical: '/aviso-legal' },
  robots: { index: false, follow: true },
};

export default function PaginaAvisoLegal() {
  const pendiente = faltanDatosDelTitular();

  return (
    <PaginaTexto titulo="Aviso legal" entradilla={`Última revisión: ${ULTIMA_REVISION}.`}>
      {pendiente && <AvisoIncompleto />}

      <section>
        <h2>Titular de la web</h2>
        <ul>
          <li>Denominación: {TITULAR.nombre ?? '— pendiente —'}</li>
          <li>NIF: {TITULAR.nif ?? '— pendiente —'}</li>
          <li>Domicilio: {TITULAR.direccion ?? '— pendiente —'}</li>
          <li>
            Correo de contacto: <a href={`mailto:${site.email}`}>{site.email}</a>
          </li>
          <li>Actividad: {TITULAR.actividad}</li>
          <li>Sitio web: {site.url}</li>
        </ul>
      </section>

      <section>
        <h2>Objeto</h2>
        <p>
          Esta web presenta el catálogo de velas y toallas artesanales de {site.nombre} y permite
          ponerse en contacto para encargar una pieza. No es una tienda en línea: no se realizan
          compras ni pagos a través del sitio. Todos los encargos se acuerdan por WhatsApp o por
          correo antes de fabricar nada.
        </p>
      </section>

      <section>
        <h2>Precios</h2>
        <p>
          Los precios que figuran en el catálogo son orientativos y corresponden a las
          características descritas en cada ficha. Cada pieza se pinta a mano por encargo, de modo
          que un tamaño distinto, un motivo más elaborado o los gastos de envío pueden modificar el
          importe final. El precio en firme se confirma siempre por escrito antes de empezar.
        </p>
      </section>

      <section>
        <h2>Propiedad intelectual</h2>
        <p>
          Las fotografías de las piezas y los diseños pintados son obra de{' '}
          {TITULAR.nombre ?? 'el titular de la web'} y están protegidos por la normativa de
          propiedad intelectual. No está permitido reproducirlos ni usarlos con fines comerciales
          sin autorización por escrito.
        </p>
      </section>

      <section>
        <h2>Responsabilidad</h2>
        <p>
          El titular procura que la información del catálogo esté actualizada y sea correcta, pero
          no responde de errores tipográficos ni de las decisiones que se tomen basándose únicamente
          en la web sin confirmarlas por escrito.
        </p>
      </section>

      <section>
        <h2>Legislación aplicable</h2>
        <p>
          Esta web se rige por la legislación española. Para cualquier controversia serán
          competentes los juzgados y tribunales de {TITULAR.provincia ?? '— pendiente —'}, salvo
          cuando la normativa de consumo establezca otro fuero.
        </p>
      </section>
    </PaginaTexto>
  );
}
