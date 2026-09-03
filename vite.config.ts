/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
const clientName = process.env.VITE_CLIENT_NAME || 'IPStream PWA'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons.svg'],
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
          {
            src: 'icons.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any'
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
            urlPattern: ({ url }) => url.hostname.includes('panelipstream.cl'),
            handler: 'NetworkFirst',
            method: 'GET',
            options: {
              cacheName: 'ipstream-api',
              expiration: { maxEntries: 200, maxAgeSeconds: 5 * 60 },
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
})
