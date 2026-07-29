'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const ENLACES = [
  { href: '/', texto: 'Inicio' },
  { href: '/colecciones', texto: 'Colecciones' },
  { href: '/taller', texto: 'El taller' },
] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  // El menú móvil se cierra al navegar y con Escape: si no, el usuario que
  // toca un enlace se queda con el panel encima de la página nueva.
  useEffect(() => {
    setAbierto(false);
  }, [pathname]);

  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('keydown', alPulsar);
    return () => document.removeEventListener('keydown', alPulsar);
  }, [abierto]);

  const esActivo = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-ivory/90 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Arte y Cera, inicio"
        >
          <Image
            src="/images/logo/logo.png"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full"
            priority
          />
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            Arte <span className="text-gold-ink">&amp;</span> Cera
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 md:flex">
          {ENLACES.map((enlace) => (
            <Link
              key={enlace.href}
              href={enlace.href}
              aria-current={esActivo(enlace.href) ? 'page' : undefined}
              className={`text-[0.95rem] transition-colors hover:text-ink ${
                esActivo(enlace.href)
                  ? 'font-medium text-ink underline decoration-gold decoration-2 underline-offset-8'
                  : 'text-ink-soft'
              }`}
            >
              {enlace.texto}
            </Link>
          ))}
          <Link
            href="/contacto"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-ink-2"
          >
            Pedir presupuesto
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-sand text-ink md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            {abierto ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Principal"
          className="border-t border-sand/70 bg-ivory px-5 pb-5 md:hidden"
        >
          <ul className="flex flex-col">
            {ENLACES.map((enlace) => (
              <li key={enlace.href}>
                <Link
                  href={enlace.href}
                  aria-current={esActivo(enlace.href) ? 'page' : undefined}
                  className="block border-b border-sand/50 py-3.5 text-base text-ink"
                >
                  {enlace.texto}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contacto"
            className="mt-5 block rounded-full bg-ink px-5 py-3 text-center text-sm font-medium text-ivory"
          >
            Pedir presupuesto
          </Link>
        </nav>
      )}
    </header>
  );
}
