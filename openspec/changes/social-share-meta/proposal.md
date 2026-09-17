## Why

Al compartir el enlace de una radio en WhatsApp, Facebook o X, el preview no muestra su identidad (nombre, logo, descripción) porque el `index.html` tiene metadatos genéricos y los crawlers de redes no ejecutan JavaScript. Cada radio necesita sus propios metadatos Open Graph/Twitter en el HTML servido.

## What Changes

- **Metadatos por cliente en build time**: `scripts/build-client.mjs` consulta `GET /api/public/{clientId}/basic-data` y pasa nombre, descripción, imagen (cover/logo) y URL del sitio al build.
- **Inyección en el HTML**: un plugin de Vite (`transformIndexHtml`) inserta los tags `og:*` y `twitter:*` en `index.html` con escape HTML, y fija `<title>` con el nombre de la radio.
- **Helper compartido y testeable**: `src/core/seo/ogMeta.ts` con `escapeHtml`, `renderOgMeta` e `injectOgMeta`.
- **`siteUrl` opcional en `client.json`**: para `og:url` y como fallback de imagen; si no está, se usa `websiteUrl` del API.
- **Fallbacks sin romper el build**: si el fetch del API falla, se usa `name` de `client.json` y se omiten campos faltantes.
- **Documentación**: `docs/deploy.md` explica `siteUrl` y el comportamiento del preview.

Fuera de alcance: preview por artículo/noticia (requiere SSR o prerender) y soporte de crawlers que sí ejecutan JS.

## Capabilities

### New Capabilities

- `social-share-meta`: metadatos Open Graph/Twitter por cliente inyectados en el HTML del build, con fallback a la configuración del cliente.

### Modified Capabilities

- (ninguna)

## Impact

- **Nuevo código**: `src/core/seo/ogMeta.ts` (+ tests).
- **Modificado**: `scripts/build-client.mjs`, `vite.config.ts`, `index.html`, `docs/deploy.md`, y opcionalmente `clients/<nombre>/client.json` (`siteUrl`).
- **Sin cambios**: runtime de la app, manifest PWA, service worker y contrato del API.
- **Multi-tenant**: los metadatos se generan por build con el `clientId` de cada radio; no se filtran entre clientes.
