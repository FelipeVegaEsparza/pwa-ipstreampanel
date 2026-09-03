## Why

El proyecto `app-pwa` es un greenfield: hoy solo contiene el contrato de la API (`instruccionesapi.md`) y la configuración de OpenSpec. El proyecto de referencia (`app-pwa-base-ipstreampanel`) es una PWA en JavaScript plano con Express que despliega un sitio por cliente vía `config.json`. Necesitamos una base moderna y tipada, con **deploy independiente por cliente** (un contenedor por radio en Dockploy), **actualizaciones centralizadas** (un solo repo) y **template elegido desde el panel** (`selectedTemplate`), para construir encima los módulos de contenido (reproductor, noticias, programas, chat, encuestas, etc.).

## What Changes

- **Scaffolding de la aplicación**: se crea una SPA con Vite + React + TypeScript, react-router y TanStack Query, con estructura de carpetas por capas (`core/`, `modules/`, `templates/`, `ui/`).
- **Resolución de `clientId` por build**: cada cliente inyecta su `clientId` en el build desde `clients/<nombre>/client.json` (`VITE_CLIENT_ID`). Sin subdominios ni rutas especiales: cada deploy ES un cliente.
- **Capa de API tipada**: cliente HTTP único sobre `https://panelipstream.cl/api/public/{clientId}` con retry con backoff, deduplicación, caché en memoria con TTL por recurso y degradación silenciosa ante errores. Incluye helper de URLs de imágenes (`/api/uploads/...`).
- **Sistema de templates**: la app lee `selectedTemplate` de la API y renderiza el diseño correspondiente (`src/templates/`, empezando con `minimalista` y `moderna`). Cambiar el template en el panel se aplica al recargar, sin redesplegar. Los templates incluyen un reproductor mínimo (streamUrl desde `basicData` + estado en vivo vía `/streaming` con polling).
- **Shell de PWA**: enrutado SPA, reproductor de audio persistente, manifest (con el nombre del cliente), service worker (Workbox) con estrategias de caché (app shell precacheado; API network-first por recurso; streaming/chats sin caché), página offline e integración de registro `POST /pwa/register`.
- **Tipos de dominio**: modelos TypeScript del contrato de `instruccionesapi.md` (basic data, streaming, programas, noticias, galerías, podcasts, videocasts, encuestas, chat, eventos, promociones, auspiciadores, locutores, redes sociales).

## Capabilities

### New Capabilities

- `multitenancy`: Resolución del `clientId` del tenant activo desde la configuración del build (`clients/<nombre>/client.json`), expone `clientId`, nombre y base URL de la API a toda la aplicación; maneja clientes sin configurar.
- `api-client`: Cliente HTTP tipado de la API pública de IPStream Panel: construye la base URL, fetch con retry/backoff, dedupe y TTL de caché por recurso, funciones para los endpoints GET del contrato y `buildImageUrl`; degrada silenciosamente ante respuestas vacías o nulas.
- `templates`: Renderiza el sitio con el diseño seleccionado en el panel (`selectedTemplate`), con fallback al template por defecto e incluye el reproductor mínimo con estado en vivo.
- `app-shell`: Shell de la PWA: enrutado SPA, reproductor persistente, registro de service worker y manifest, estrategias de caché offline, página offline e integración del registro de instalación PWA.

### Modified Capabilities

- Ninguna. Es un proyecto nuevo sin specs existentes.

## Impact

- **Nuevo código**: `package.json` (React, TypeScript, Vite, react-router, TanStack Query, `vite-plugin-pwa`), `vite.config.ts`, `index.html`, `public/` (manifest, íconos, página offline), `src/` (`main.tsx`, `app/`, `core/config.ts`, `core/api/`, `core/types/`, `core/adapters/`, `core/hooks/`, `templates/`, `modules/`, `ui/`).
- **Modelo de despliegue (Modelo C)**: `clients/<nombre>/client.json` con el `clientId` por radio, `scripts/build-client.mjs` que inyecta `VITE_CLIENT_ID` y genera `dist/<cliente>/`, `scripts/new-client.mjs` para crear clientes, `.env`/`.env.example` para el default de dev, y `Dockerfile` + `nginx.conf` para deploy independiente por cliente en Dockploy.
- **Datos**: el `clientId` por cliente se configura en `clients/<nombre>/client.json`; el template se elige en el panel vía `selectedTemplate`.
- **API consumida**: GET públicos del contrato (`/`, `/basic-data`, `/streaming`, `/streaming/status`, `/programs`, `/news`, `/galleries`, `/podcasts`, `/videocasts`, `/polls`, `/chat/messages`, `/events`, `/promotions`, `/sponsors`, `/announcers`, `/social-networks`) y el POST `/pwa/register`.
- **Dependencias**: react, react-dom, react-router, @tanstack/react-query, vite-plugin-pwa/workbox. Sin backend propio; el deploy es estático.
- **No afecta**: el proyecto base `app-pwa-base-ipstreampanel` queda intacto; este cambio es independiente.
