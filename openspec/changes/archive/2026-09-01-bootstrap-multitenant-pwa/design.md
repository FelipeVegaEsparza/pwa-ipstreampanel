## Context

Proyecto greenfield (`app-pwa`) con solo el contrato de la API (`instruccionesapi.md`) y config de OpenSpec. El proyecto de referencia (`app-pwa-base-ipstreampanel`) usa JavaScript plano + Express con un deploy por cliente vía `config.json`; su capa de datos (`api.js`/`data-manager.js`) ya valida el patrón de caché por TTL, retry con backoff, dedupe y polling de streaming a 30s, y documenta incompatibilidades reales del contrato (p. ej. `/streaming` difiere del doc, covers con auth, hosts de audio sin CORS). Este cambio establece la base para todos los módulos futuros: ver proposal.md - Why.

Restricciones de diseño: la API es pública y CORS-abierta (deploy estático posible, sin backend propio); cada build de cliente lleva su `clientId` inyectado; los datos de streaming/chat no deben quedar obsoletos por caché. El requisito de despliegue es **un deploy independiente por cliente en Dockploy** con actualizaciones centralizadas (un solo repo) y el **template elegido desde el panel** vía `selectedTemplate`.

## Goals / Non-Goals

**Goals:**
- Base instalable: Vite + React + TypeScript, enrutado SPA, PWA real (manifest, service worker, offline).
- Resolución de tenant por `clientId` inyectado en build (config por cliente `clients/<nombre>/client.json`).
- Capa de API tipada, resiliente y con caché por TTL aislada por `clientId`.
- Sistema de templates seleccionados desde el panel (`selectedTemplate`) sin redesplegar.
- Modelo de despliegue por cliente (Modelo C): build por cliente + deploy independiente en Dockploy.
- Reproductor mínimo funcional dentro de los templates (streamUrl desde `basicData` + estado en vivo vía `/streaming` con polling).

**Non-Goals:**
- Implementar los módulos de contenido completos (noticias, programas, chat, encuestas, etc.); solo quedan tipados, contadores y el shell.
- Reproductor completo (jingles, nextTrack, MediaSession, video/HLS); el player avanzado es un cambio posterior.
- Integración OneSignal (requiere `oneSignalAppId` y coexistencia de service workers).
- Backend propio (formulario de contacto vía Resend, etc.).
- SEO/SSR.

## Decisions

### D1. Stack: React + TypeScript + Vite (SPA con CSR)
Se construye una SPA renderizada en cliente. La API es pública, CORS abierta y sin autenticación, por lo que no hay necesidad de un servidor: se puede desplegar como estático. React se elige por el ecosistema maduro de estado de servidor (TanStack Query) y PWA.
*Alternativas consideradas*: Next.js/Nuxt (SSR) — se descarta porque SEO/SSR no son objetivo y añade complejidad de hosting; Vue/Svelte — viables pero sin ventaja sobre el ecosistema React+Query; vanilla JS — patrón del proyecto base, difícil de mantener a escala multi-módulo.

### D2. Estado de datos: TanStack Query sobre un cliente HTTP propio
La capa `core/api` es un cliente `fetch` tipado con retry/backoff, dedupe en vuelo, timeouts y caché en memoria por TTL (comportamiento definido en `api-client`). TanStack Query consume ese cliente y aporta: claves de caché, `staleTime`/`gcTime` por recurso, polling (`refetchInterval`) y estados loading/error/empty.
*Alternativas*: cachear todo manualmente como el proyecto base (`data-manager.js`) — se descarta por duplicación de lógica y menos control de revalidación; SWR — equivalente funcional, se elige Query por convenciones de equipo y typed generics.

### D3. Resolución de tenant por clientId inyectado
Cada build de cliente inyecta su `clientId` (`VITE_CLIENT_ID`, desde `clients/<nombre>/client.json`). `TenantProvider` lo resuelve de forma **síncrona al arrancar** y expone `{ clientId, name, baseUrl }`. Se eliminan el registro de subdominios (`public/clients.json`) y las rutas `/c/{clientId}`: en este modelo **cada deploy ES un cliente**. Todas las claves de Query incluyen `clientId` para aislar datos.
*Alternativa*: resolución híbrida subdominio+ruta (diseño inicial) — descartada por complejidad innecesaria para el requisito de deploy por cliente.

### D8. Modelo de despliegue por cliente (Modelo C)
Un solo repo con el core y `clients/<nombre>/client.json` (config de cada radio: `clientId`, `name`). `scripts/build-client.mjs` inyecta el clientId vía `VITE_CLIENT_ID` y genera `dist/<nombre>/` listo para desplegar de forma **independiente por cliente** en Dockploy (Dockerfile + nginx con SPA fallback). Un commit en el repo permite reconstruir todos los clientes → **cambios llegan a todos a la vez**; los desarrollos específicos viven en `clients/<nombre>/` sin tocar el core. `npm run new-client -- <nombre> <clientId> [nombre]` crea el `client.json` y valida el build.
*Alternativas*: fleet con paquete npm + auto-update (proyecto base) — descartada por deriva de versiones y N repos; deploy multi-tenant único — descartado porque cada cliente requiere deploy independiente en Dockploy y aislamiento de customizaciones.

### D9. Sistema de templates seleccionados desde el panel
La app consulta `GET /api/public/{clientId}` y lee `selectedTemplate`. El registro `src/templates/` mapea ese id a un componente React (layout + tema). Si el id no existe o es `null`, se usa el template por defecto (`minimalista`). Cambiar el template en el panel se refleja al recargar, **sin redesplegar**. Cada template incluye un reproductor mínimo: toma `basicData.radioStreamingUrl` como fuente, muestra `currentTrack`/`listeners`/`status` vía `useStreaming` (polling 30s) y un botón play/pause conectado al `PlayerProvider`.
*Alternativa*: template fijo por cliente en `client.json` (requiere rebuild) — descartada; el panel ya expone `selectedTemplate` y permite cambiarlo en caliente.

### D4. PWA con `vite-plugin-pwa` (Workbox, `generateSW`)
Estrategias: precache del app shell (bundle, HTML, manifest, íconos, página offline); runtime `network-first` para respuestas de la propia API con datos recacheables; **network-only** para `/streaming`, `/streaming/status` y `/chat/*` (evita estado en vivo obsoleto); fallback de navegación a la página offline. El manifest se genera con el nombre del cliente (`VITE_CLIENT_NAME`).
*Alternativa*: service worker manual (base) — se descarta por mantenibilidad; `injectManifest` — se reserva para cuando OneSignal exija control fino del SW.

### D5. Enrutado y reproductor persistente
`react-router` con el template como página raíz. El reproductor de audio es un singleton (`PlayerProvider`) montado por encima de las rutas, de modo que la navegación no lo desmonta. `PlayerBar` (barra fija inferior) se renderiza junto al template.
*Alternativa*: reproductor por página — se descarta porque rompe la continuidad de audio entre rutas.

### D6. Tipos y adaptadores separados de la UI
`core/types` modela el contrato (respuestas de `instruccionesapi.md`). `core/adapters` normaliza variaciones (p. ej. `pagination.pages`/`totalPages`, `weekDays` numéricos, `e.name || e.title` en eventos). La UI consume solo modelos de dominio.
*Racional*: la norma del proyecto (config.yaml) exige separar datos de API, lógica de negocio y UI, y no duplicar el consumo.

### D7. Estilos: CSS Modules + tokens CSS
Base con custom properties (colores, radios, espaciado) en `ui/`, componentes primitives y CSS Modules por módulo. Cada template define su propio CSS Module para un look distinto.
*Alternativa*: Tailwind — viable, pero el theming por tenant (templates) es más natural con tokens CSS nativos.

## Risks / Trade-offs

- [Template id del panel que aún no existe en `src/templates/`] → `getTemplate` cae al template por defecto (`minimalista`); no rompe la app.
- [El panel no expone `selectedTemplate` para algunos clientes] → Default `minimalista`; el diseño se mantiene coherente.
- [Streaming sin CORS en hosts de audio] → Se reproduce sin `crossOrigin` (patrón validado en el proyecto base); el VU meter degrada.
- [Covers de tracks con auth] → Fallback a portada/logo de la radio vía `buildImageUrl`.
- [SPA con deep links en hosting estático puede devolver 404] → nginx `try_files` → `index.html`; el SW sirve la página offline como último recurso.
- [Service worker podría cachear datos vivos de la API] → Workbox `network-only` explícito para streaming/chat y TTLs cortos para el resto.
- [Caché de Query sin particionar mezclaría clientes] → Todas las query keys incluyen `clientId`.

## Migration Plan

1. Scaffold de Vite + React + TS y dependencias (react-router, TanStack Query, vite-plugin-pwa).
2. `clients/fusionaustral/client.json` con el cliente de prueba (`cmtezi0ci00014raq8hrhhwfp`) + `.env` de dev.
3. Implementar `TenantProvider` (clientId inyectado) y `core/api` (cliente HTTP) + `core/types`/`core/adapters`.
4. Implementar sistema de templates (`src/templates/`) con `minimalista` y `moderna`, y `useStreaming` para el reproductor mínimo.
5. Configurar PWA (manifest con nombre del cliente, SW, estrategias de caché) y página offline.
6. `scripts/build-client.mjs` + `Dockerfile` + `nginx.conf` para deploy por cliente.
7. Verificar: `npm run build:client -- fusionaustral`, tests, smoke en navegador (template + streaming + play).
8. Rollback: revertir los commits del scaffolding; el proyecto no tiene código previo que romper.

## Open Questions

- Hosting/dominios definitivos por cliente: se resuelve en el deploy (Dockploy) sin cambiar specs ni enfoque.
- Nombres de templates del panel que el equipo quiere mapear: se agregan al registro `src/templates/` sin cambios de arquitectura.
- Tokens visuales por defecto (paleta): se usan valores por defecto; la personalización por tenant es posterior.
