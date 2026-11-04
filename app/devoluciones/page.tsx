import type { Metadata } from 'next';
import Link from 'next/link';
import { PaginaTexto } from '@/components/ui/pagina-texto';
import { site, whatsappUrl } from '@/lib/site';

/**
 * Política de devoluciones. La pide Google Merchant Center para aprobar los
 * productos, y su URL es la que se pega allí en «Políticas de devoluciones».
 * Si cambian los días para avisar, hay que cambiarlos también en Merchant Center.
 */
const DIAS_PARA_AVISAR = 7;

/** Va aparte de ULTIMA_REVISION: esta página se escribió después que las otras legales. */
const REVISADA = '4 de noviembre de 2026';

export const metadata: Metadata = {
  title: 'Devoluciones',
  description:
    'Política de devoluciones de Arte y Cera: piezas personalizadas, qué hacer si tu vela llega rota o con un defecto y cómo avisarnos.',
  alternates: { canonical: '/devoluciones' },
  robots: { index: false, follow: true },
};

export default function PaginaDevoluciones() {
  return (
    <PaginaTexto titulo="Devoluciones" entradilla={`Última revisión: ${REVISADA}.`}>
      <section>
        <h2>Piezas hechas para ti</h2>
        <p>
          Cada vela, cirio y toalla se pinta o se borda por encargo, con el nombre, la fecha, los
          colores o el motivo que nos pides. Por eso, como permite la ley para los productos
          personalizados (artículo 103 de la Ley General para la Defensa de los Consumidores y
          Usuarios), <strong>no se aceptan devoluciones ni cambios por desistimiento</strong>: una
          pieza con el nombre de otra persona no se puede volver a vender.
        </p>
        <p>
          Antes de dar cada encargo por terminado te enseñamos cómo va quedando, para que la pieza
          sea exactamente la que querías.
        </p>
      </section>

      <section>
        <h2>Si llega rota o con un defecto</h2>
        <p>
          Si la pieza llega dañada en el envío, con un defecto o distinta de lo que acordamos, te la{' '}
          <strong>reponemos o te devolvemos el dinero</strong>, a tu elección, sin ningún coste para
          ti: nos hacemos cargo del envío.
        </p>
        <ul>
          <li>
            Avísanos en los <strong>{DIAS_PARA_AVISAR} días</strong> siguientes a recibirla.
          </li>
          <li>Mándanos una foto de la pieza y, si es un golpe del envío, también del paquete.</li>
          <li>Guarda la pieza y el embalaje hasta que lo resolvamos.</li>
        </ul>
        <p>
          Esto no limita los derechos que te da la garantía legal: si una pieza no es conforme con
          lo que compraste, la ley te protege igualmente.
        </p>
      </section>

      <section>
        <h2>Cómo avisarnos</h2>
        <p>
          Por WhatsApp, en el{' '}
          <a
            href={whatsappUrl('Hola, mi pedido ha llegado con un problema.')}
            target="_blank"
            rel="noopener"
          >
            {site.whatsappVisible}
          </a>
          , o por correo a <a href={`mailto:${site.email}`}>{site.email}</a>. Te respondemos en
          menos de 48 horas. También puedes ver el resto de la información en el{' '}
          <Link href="/aviso-legal">aviso legal</Link>.
        </p>
      </section>
    </PaginaTexto>
  );
}
