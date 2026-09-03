## Context

La base (`bootstrap-multitenant-pwa`) ya tiene: capa de API tipada con todos los endpoints GET del contrato, `core/types` y `core/adapters` con normalización (`asArray`, `normalizeWeekDay`, `normalizePagination`, `getNewsCategory`), `useFullClientData` (obtiene el payload completo del cliente) y un sistema de templates con reproductor mínimo. Este cambio consume esa base para renderizar el contenido: ver proposal.md - Why.

La API entrega en `GET /api/public/{clientId}` los arrays de programas, noticias (últimas 10), galerías, podcasts (últimos 10), videocasts (últimos 10), eventos, auspiciadores, promociones y el `basicData` (con `videoStreamingUrl`). Los detalles se obtienen por endpoint individual (`/news/{slug}`, `/podcasts/{id}`, `/videocasts/{id}`).

## Goals / Non-Goals

**Goals:**
- Secciones de lectura data-driven en los templates: noticias, programas, galerías, podcasts, videocasts, eventos, auspiciadores, promociones y TV en vivo — visibles solo si hay datos.
- Páginas de detalle enrutadas: `/noticias/:slug`, `/podcasts/:id`, `/videocasts/:id`.
- Estados de carga/error/vacío en cada sección sin romper la app.
- Reutilizar la capa de datos existente (sin duplicar consumo de API).

**Non-Goals:**
- Encuestas (voto con `localStorage`) y chat (polling con `serverTime`): fase 2 interactiva.
- Reproductor avanzado de audio (jingles, nextTrack, MediaSession): fase posterior.
- Video en vivo TV en su variante completa (multitrack/EPG): solo reproducción del `videoStreamingUrl` (HLS).
- Backend propio, SEO/SSR.

## Decisions

### D1. Secciones desde `useFullClientData` (una sola llamada)
Las secciones del home leen los arrays de `useFullClientData` (programas, news, galerías, podcasts, videocasts, eventos, sponsors, announcers, promotions), que ya llegan en el payload principal y se cachean (`staleTime` 5 min, network-first en el SW). Las páginas de detalle consultan endpoints individuales.
*Alternativa*: un hook por sección (`useNews`, `usePrograms`, …) → N llamadas al cargar el home. Se descarta: el payload completo ya trae los datos y es más eficiente; los hooks individuales se usan solo en detalle (news por slug, podcast/videocast por id).

### D2. Organización por módulos + UI compartida
Cada módulo vive en `src/modules/<nombre>/` (news, programs, galleries, podcasts, videocasts, events, sponsors, announcers, promotions, tv) con sus componentes y, si hace falta, hooks. Los componentes de UI compartidos (Section, Card, Grid, Skeleton, EmptyState, Pagination) van en `src/ui/`.
*Racional*: consistente con la estructura por capas del proyecto; reuso sin duplicación.

### D3. Componente `Section` data-driven
Un componente `Section` encapsula la lógica común: título opcional, estado de carga (skeleton), render solo si `asArray(data).length > 0` (o si el dato existe, p. ej. TV), y estados vacío/error degradados. Todas las secciones lo usan → mismo comportamiento y menos código por módulo.
*Alternativa*: lógica repetida por sección → se descarta por duplicación.

### D4. Enrutado de detalle en el shell
`App.tsx` agrega las rutas `/noticias/:slug`, `/podcasts/:id`, `/videocasts/:id` bajo el shell (manteniendo `PlayerBar` persistente y el template como layout). Las rutas cargan componentes de detalle que consultan el endpoint individual. El fallback SPA del servidor (nginx `try_files` + SW `navigateFallback`) ya soporta deep links.

### D5. TV en vivo con HLS
La sección de TV se muestra solo si `basicData.videoStreamingUrl` existe. La reproducción usa `<video>` + `hls.js` (el contrato define HLS `.m3u8`); en navegadores con HLS nativo (Safari/iOS) se usa el nativo. `hls.js` se agrega como dependencia.
*Alternativa*: solo `<video src>` nativo → no reproduce HLS en Chrome/Firefox/desktop; se descarta.

### D6. Paginación en listas largas
news/podcasts/videocasts soportan `page`/`limit`; las secciones del home muestran las primeras 10 (ya vienen en el payload) y en detalle/listado se implementa paginación con `normalizePagination` (`totalPages`, `hasMore`).

### D7. Imágenes
Todas las imágenes se resuelven con `buildImageUrl` y se cargan con `loading="lazy"` (y `decoding="async"`).

## Risks / Trade-offs

- [Payload completo pesado en el home] → Cacheado (network-first + staleTime 5 min); las secciones leen del mismo dato sin llamadas extra.
- [HLS no soportado sin hls.js] → `hls.js` con detección nativa; el `<video>` se mantiene como fallback.
- [Covers/tracks con auth o CORS] → Fallback a logo/portada vía `buildImageUrl`; el player degrada (patrón ya validado en la base).
- [Shapes distintos de la API (weekDays, pagination, source generic)] → Adaptadores compartidos (`normalizeWeekDay`, `normalizePagination`, `getNewsCategory`).
- [Sección con datos pero imagen rota] → `onError` del `<img>` oculta la imagen sin romper el ítem.

## Migration Plan

1. Implementar componentes de UI compartidos (`Section`, `Card`, `Grid`, `Skeleton`, `EmptyState`, `Pagination`) + estilos.
2. Implementar cada módulo de lectura consumiendo `useFullClientData` (programas, noticias, galerías, podcasts, videocasts, eventos, auspiciadores, promociones) y la sección de TV con `hls.js`.
3. Integrar las secciones en ambos templates (`minimalista`, `moderna`) de forma data-driven.
4. Agregar rutas de detalle (`/noticias/:slug`, `/podcasts/:id`, `/videocasts/:id`) con sus componentes y manejo de no encontrado.
5. Verificar: `npm run lint`, `typecheck`, `test`, `build:client`, smoke en navegador con datos reales (secciones visibles solo con datos) y deep links.
6. Rollback: revertir el commit del cambio; la base queda intacta.

## Open Questions

- Si el home debe paginar dentro de la propia sección o llevar a una página de listado completo: se define en implementación sin cambiar specs (los datos ya soportan ambos).
- Cantidad de secciones visibles simultáneas por template (orden/destacados): ajuste de UI posterior, no bloquea.
