import Link from 'next/link';
import { categorias } from '@/lib/catalogo';
import { clasesBoton } from '@/lib/ui';

export default function NoEncontrada() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center">
      <p className="font-display text-5xl font-bold text-blanco">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Esta página no existe</h1>
      <p className="mt-4 leading-relaxed text-dorado">
        Puede que el enlace esté mal escrito o que la colección haya cambiado de nombre. Estas son
        las que hay ahora mismo:
      </p>

      <ul className="mt-8 flex flex-wrap justify-center gap-2">
        {categorias.map((categoria) => (
          <li key={categoria.slug}>
            <Link
              href={categoria.href}
              className="inline-block rounded-full border border-cream/20 bg-verde-profundo px-4 py-2 text-sm text-dorado hover:border-blanco hover:text-blanco"
            >
              {categoria.nombre}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <Link href="/" className={clasesBoton('primario')}>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
