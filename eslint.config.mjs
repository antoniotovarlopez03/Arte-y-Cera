import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/* eslint-config-next 16 ya exporta configuración plana, así que no hace falta
   FlatCompat (que además entra en bucle al resolver el plugin de React). */
const configuracion = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    ignores: [
      'legacy/**',
      '.next/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
];

export default configuracion;
