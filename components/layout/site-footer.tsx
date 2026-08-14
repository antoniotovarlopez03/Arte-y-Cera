import Image from 'next/image';
import Link from 'next/link';
import { IconoInstagram, IconoWhatsapp } from '@/components/iconos';
import { site, whatsappUrl } from '@/lib/site';

const LEGALES = [
  { href: '/aviso-legal', texto: 'Aviso legal' },
  { href: '/privacidad', texto: 'Privacidad' },
  { href: '/cookies', texto: 'Cookies' },
] as const;

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-verde-profundo text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/logo/logo.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 rounded-full"
            />
            <span className="font-display text-lg font-bold text-blanco">
              Arte <span className="text-blanco">&amp;</span> Cera
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-dorado/70">
            Velas pintadas a mano para un momento muy especial: bautizos, bodas, cirios pascuales y
            Navidad. {site.zona}.
          </p>
        </div>

        <nav aria-label="Secciones">
          <h2 className="font-display text-sm tracking-[0.14em] text-blanco uppercase">Web</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link href="/colecciones" className="text-dorado/80 hover:text-cream">
                Colecciones
              </Link>
            </li>
            <li>
              <Link href="/taller" className="text-dorado/80 hover:text-cream">
                El taller
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="text-dorado/80 hover:text-cream">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm tracking-[0.14em] text-blanco uppercase">
            Hablemos
          </h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="text-dorado/80 hover:text-cream">
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={whatsappUrl('Hola, os escribo desde la web de Arte y Cera.')}
                className="inline-flex items-center gap-2 text-dorado/80 hover:text-cream"
                target="_blank"
                rel="noopener"
              >
                <IconoWhatsapp className="h-4 w-4" />
                {site.whatsappVisible}
              </a>
            </li>
            <li>
              <a
                href={site.instagram.url}
                className="inline-flex items-center gap-2 text-dorado/80 hover:text-cream"
                target="_blank"
                rel="noopener"
              >
                <IconoInstagram className="h-4 w-4" />
                {site.instagram.usuario}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-dorado/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.nombre}. Todos los derechos reservados.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGALES.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className="hover:text-cream">
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
