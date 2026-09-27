/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Ruta pública del sitio. Por defecto "/" (dev, preview, hosting en raíz);
// el workflow de GitHub Pages la define como "/radios-chile/".
const base = process.env.BASE_PATH ?? '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        id: base,
        name: 'Radio Chile',
        short_name: 'Radio Chile',
        description: 'Las radios chilenas en vivo, en un solo lugar: noticias, música, deportes, cultura y regiones.',
        lang: 'es-CL',
        dir: 'ltr',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#faf6ef',
        theme_color: '#faf6ef',
        categories: ['music', 'news', 'entertainment'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,webmanifest}'],
        // hls.js sólo se usa para algunas emisoras y nunca sin conexión: se cachea al usarse.
        globIgnores: ['logos/**', '**/hls*.js', '**/*cyrillic*', '**/*vietnamese*', '**/*greek*'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        // Los streams de audio nunca se cachean: son infinitos y en vivo.
        runtimeCaching: [
          {
            // Logos: se cachean a medida que se ven, no en la instalación.
            urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/logos\/[^/]+\.webp$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'station-logos', expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 60 } },
          },
          {
            urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/assets\/.+\.(js|woff2)$/.test(url.pathname),
            handler: 'CacheFirst',
            options: { cacheName: 'assets-on-demand', expiration: { maxEntries: 20 } },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
  build: {
    target: 'es2022',
    // El chunk de hls.js (~370 kB) se carga bajo demanda sólo para streams HLS.
    chunkSizeWarningLimit: 400,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
  },
})
