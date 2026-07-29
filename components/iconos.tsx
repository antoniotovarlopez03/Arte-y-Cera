/**
 * Iconos en SVG inline, solo los que la web usa de verdad.
 * Se evita así una librería de iconos entera (y su JS) para cuatro trazos.
 */

type Props = { className?: string };

export function IconoWhatsapp({ className }: Props) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="currentColor" aria-hidden="true">
      <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.25.62 4.36 1.7 6.17L4 29l8-1.65a12 12 0 0 0 4.02.7c6.62 0 12.02-5.4 12.02-12.03C28.04 8.4 22.64 3 16.02 3Zm0 21.9c-1.3 0-2.58-.26-3.75-.77l-.27-.12-4.74.98.98-4.62-.18-.29a9.83 9.83 0 0 1-1.53-5.28c0-5.46 4.45-9.9 9.93-9.9 2.65 0 5.14 1.03 7.01 2.9a9.83 9.83 0 0 1 2.9 6.99c0 5.46-4.45 9.91-9.35 9.91Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.24-.46-2.37-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.6-.91-2.2-.24-.57-.49-.5-.67-.5-.17 0-.37-.02-.57-.02-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.08 4.48.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}

export function IconoInstagram({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconoSobre({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" strokeLinecap="round" />
    </svg>
  );
}

export function IconoFlecha({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
