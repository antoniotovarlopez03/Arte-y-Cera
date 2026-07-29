import { IconoWhatsapp } from '@/components/iconos';
import { whatsappUrl } from '@/lib/site';

/**
 * Botón flotante de WhatsApp. Se mantiene del sitio original porque es el
 * canal real de este negocio, pero discreto: sin animación, sin globo de
 * "¡Escríbenos!" y por debajo de la ficha de producto en móvil (z-30) para
 * que nunca tape la barra de acciones de la pieza que se está mirando.
 */
export function BotonWhatsapp() {
  return (
    <a
      href={whatsappUrl('Hola, os escribo desde la web de Arte y Cera.')}
      target="_blank"
      rel="noopener"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-4 z-30 flex h-13 w-13 items-center justify-center rounded-full bg-[#0f7a40] text-white shadow-pieza transition-transform hover:scale-105 print:hidden"
    >
      <IconoWhatsapp className="h-7 w-7" />
    </a>
  );
}
