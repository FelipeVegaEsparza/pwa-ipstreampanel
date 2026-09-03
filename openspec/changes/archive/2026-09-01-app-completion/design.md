## Context

La app ya tiene la capa de API completa (`getSocialNetworks`, `getVideos`, `getNews`/`getPodcasts`/`getVideocasts` con paginación, `getStreamingStatus`), la UI compartida (`Section`, `Card`, `Grid`, `Pagination`, `SmartImage`), templates con `Outlet`, y el player con `useStreaming` (polling 30s). Este cambio agrega las piezas faltantes: ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Secciones data-driven de redes sociales y videos.
- Páginas de listado paginado (noticias, podcasts, videocasts) con "ver todas".
- Botón de instalación PWA + `document.title` por cliente.
- Media Session del player + polling ligero con `/streaming/status`.

**Non-Goals:**
- OneSignal/push (requiere integración del SDK y coexistencia de SW; fase posterior).
- SEO/SSR, meta tags dinámicos por página.
- Reproductor de video completo más allá del ranking (lightbox/iframe).

## Decisions

### D1. Redes sociales: sección data-driven
`SocialNetworksSection` lee `socialNetworks` de `useFullClientData` (ya viene en el payload) y renderiza solo las redes con URL, como enlaces externos (`target="_blank"`, `rel="noreferrer"`). Visible solo si hay al menos una red. Se integra en `ContentSections` (al final, antes del chat).
*Alternativa*: consultar `GET /social-networks` aparte — el payload completo ya lo trae; se reutiliza.

### D2. Videos: sección con reproducción
`VideosSection` lee `videos` de `useFullClientData` (ordenado por `order`). Cada tarjeta muestra nombre + thumbnail; al hacer clic abre un modal con el reproductor: si `videoUrl` es de YouTube se usa iframe (`youtube.com/embed/...`), si es archivo se usa `<video>` nativo. Visible solo si hay videos con URL.
*Alternativa*: reproducir en la misma página sin modal — se descarta por simplicidad de UX en móvil.

### D3. Listados paginados
Páginas `/noticias`, `/podcasts`, `/videocasts` que usan hooks con `useQuery` y estado de `page`; consultan `getNews/getPodcasts/getVideocasts(clientId, page, limit)` y renderizan con el componente `Pagination` usando `normalizePagination` (`totalPages`, `hasMore`). Las secciones del home agregan un enlace "Ver todas" cuando `hasMore`/página >1. Rutas se agregan bajo el template (`Outlet`).
*Racional*: reutiliza el componente y adaptadores ya existentes.

### D4. Instalación PWA + título
`InstallPrompt` escucha `beforeinstallprompt` (lo guarda), `appinstalled` y `display-mode` standalone para ocultarse si ya está instalada; al hacer clic llama `prompt()` del evento. Se ubica en el header del template. `useDocumentTitle(clientId)` fija `document.title` con `basicData.projectName`.
*Alternativa*: no mostrar botón y depender solo del navegador — el botón mejora la conversión de instalación.

### D5. Media Session del player
En `PlayerContext`, cuando hay `streamUrl` y un tema actual (`useStreaming`), se setea `navigator.mediaSession.metadata` (title, artist, artwork) y los handlers de play/pause (nexttrack/previoustrack si el API los entrega). Se limpia al desmontar.
*Racional*: API nativa, sin dependencias; mejora la experiencia en móvil con pantalla bloqueada.

### D6. Polling ligero con `/streaming/status`
Se agrega `useStreamingStatus` (refetch ~15s, sin caché persistente) usado por el `PlayerBar`/templates para estados rápidos; `useStreaming` (30s, rico) sigue para el detalle. Sin duplicar caché (cada uno con su query key).

## Risks / Trade-offs

- [beforeinstallprompt no disponible en todos los navegadores/desktop] → El botón simplemente no aparece; la app sigue instalable por el navegador.
- [YouTube embebido requiere `frame-src` permitido] → El CSP/nginx de la PWA y el hosting deben permitir `youtube.com`; en el SW no se cachea iframes.
- [Media Session requiere metadata cada vez que cambia el tema] → Se actualiza en el ciclo de polling sin coste adicional relevante.
- [Listados paginados aumentan requests] → Cacheados con TTL y `normalizePagination`; se respeta el máximo `limit` del contrato.

## Migration Plan

1. `SocialNetworksSection` + integración en `ContentSections`.
2. `VideosSection` con modal de reproducción.
3. Páginas de listado `/noticias`, `/podcasts`, `/videocasts` + enlaces "Ver todas" + rutas.
4. `InstallPrompt` en el header + `useDocumentTitle`.
5. Media Session en `PlayerContext` + `useStreamingStatus` en el player.
6. Verificar: `npm run lint`, `typecheck`, `test`, `build:client`, smoke en navegador.
7. Rollback: revertir el commit del cambio; el resto queda intacto.
