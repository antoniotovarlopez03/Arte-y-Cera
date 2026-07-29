import { defineConfig, devices } from '@playwright/test';

const PUERTO = 3311;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PUERTO}`,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
    { name: 'movil', use: { ...devices['iPhone 13'] } },
  ],
  // Se prueba contra el build de producción: es lo que verá la gente, con sus
  // páginas estáticas y sus imágenes optimizadas.
  webServer: {
    command: `npm run build && npx next start --port ${PUERTO}`,
    port: PUERTO,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
