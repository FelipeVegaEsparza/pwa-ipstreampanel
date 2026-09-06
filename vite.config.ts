/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // loadEnv lee .env / .env.<mode> (Vite no expone VITE_* en process.env durante
  // la evaluación de la config). build-client.mjs además inyecta las variables
  // en el entorno del proceso, que tienen prioridad.
  const env = loadEnv(mode, process.cwd(), '')
  const clientName =
    process.env.VITE_CLIENT_NAME || env.VITE_CLIENT_NAME || 'IPStream PWA'

  return {
  base: '/',
  build: {
    // hls.js vive en su propio chunk bajo demanda (~574 kB min); el resto de la
    // app queda muy por debajo del límite por defecto.
    chunkSizeWarningLimit: 600
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icon-192.png',
        'icon-512.png',
        'icon-maskable-512.png',
        'apple-touch-icon.png'
      ],
      manifest: {
        name: clientName,
        short_name: clientName.length > 12 ? `${clientName.slice(0, 12)}…` : clientName,
        description: `App PWA de ${clientName}`,
        lang: 'es',
        theme_color: '#1a1a2e',
        background_color: '#1a1a2e',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,webp,woff2}'],
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: ({ url }) =>
              url.pathname.includes('/streaming') || url.pathname.includes('/chat'),
            handler: 'NetworkOnly',
            method: 'GET',
            options: { cacheableResponse: { statuses: [0, 200] } }
          },
          {
            urlPattern: ({ url }) =>
              url.hostname.includes('panelipstream.cl') &&
              url.pathname.startsWith('/api/public'),
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'ipstream-api-v1',
              expiration: { maxEntries: 300, maxAgeSeconds: 10 * 60 },
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] }
            }
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true
  }
  }
})
