## Context

Ver `proposal.md` - Why. El estado actual relevante:

- `src/core/api/client.ts` aplica `DEFAULT_RETRIES = 3` a toda solicitud, incluidos POST; `sendContactMessage` ya usa `retries: 0` como excepción puntual.
- `TenantContext` resuelve el tenant solo desde `VITE_CLIENT_ID`; la spec `multitenancy` lo declara como comportamiento correcto, pero `app-shell` todavía promete un fallback `/c/{clientId}` que no existe.
- El service worker se genera con `generateSW` (`navigateFallback: 'index.html'`) y `offline.html` solo se precachea, sin fallback.
- El reproductor comparte un `Audio` global; `setStreamUrl` sólo recarga si la URL nueva ya es la cargada y el sondeo CORS puede reiniciar la reproducción.
- Los hooks de datos (`usePaginatedList`, páginas de detalle) usan React Query sin distinguir tipos de error ni `isPlaceholderData`.

## Goals / Non-Goals

**Goals:**

- Corregir los defectos de comportamiento sin cambiar la estructura de despliegue por cliente ni el contrato de la API.
- Centralizar la lógica repetida (acceso seguro a storage, política de reintentos, distinción de errores) para no duplicarla en cada módulo.
- Mantener el camino feliz idéntico: mismos intervalos de refresco razonables, misma UI y mismos endpoints.

**Non-Goals:**

- No implementar resolución runtime de tenant por subdominio ni `/c/{clientId}` (se alinea la spec con la decisión vigente).
- No tocar el chat ni el formulario de contacto.
- No rediseñar templates ni el sistema de secciones.
- No introducir dependencias nuevas.

## Decisions

### D1. Política de reintentos por idempotencia

`request()` reintentará solo métodos idempotentes (`GET`/`HEAD`). Para el resto, el valor por defecto de `retries` pasa a ser `0`; quien necesite reintentar una escritura debe declararlo explícitamente. Alternativa considerada: mantener el default y pasar `retries: 0` en cada escritura (lo actual) - se descarta porque es fácil olvidarlo al agregar un endpoint POST nuevo. Este cambio convierte `sendContactMessage({ retries: 0 })` en redundante pero inofensivo; no se elimina para no reescribir su test.

### D2. Acceso seguro al almacenamiento local

Nuevo helper `src/core/storage/safeStorage.ts` con `readString`, `writeString` y un `getOrCreateDeviceId` que tolera excepciones y mantiene un respaldo en memoria (a nivel de módulo) cuando `localStorage` falla. `PollCard` y `register.ts` lo consumen. Alternativa considerada: try/catch inline en cada sitio - se descarta por duplicación y porque ya provocó una inconsistencia (`register.ts` protegido, `PollCard` no).

### D3. Offline vía `injectManifest`

Satisfacer el fallback a `offline.html` requiere `setCatchHandler`, que `generateSW` no expone. Se migra a `strategies: 'injectManifest'` con un `src/sw.ts` mínimo que precachea el shell (mismo `globPatterns`), mantiene las reglas `runtimeCaching` actuales (NetworkOnly para streaming/chat, NetworkFirst para `/api/public`) y agrega un catch handler que responde `offline.html` a navegaciones sin caché. Alternativa considerada: mantener `generateSW` y añadir un `runtimeCaching` de navegación - no permite fallback de página y deja la navegación desconectada rota. Riesgo: mayor superficie del SW; se mitiga copiando las reglas actuales y validando con build + inspección de `dist/sw.js`.

### D4. Errores HTTP tipados

`src/core/api/index.ts` lanzará un `ApiError` con `status` para que las páginas de detalle distingan 404 de otros errores, y las páginas/listados puedan mostrar "no encontrado" vs "error recuperable con reintento". Alternativa considerada: parsear el mensaje `HTTP 404` - se descarta por frágil.

### D5. Paginación sin datos enmascarados

`usePaginatedList` deja de usar `placeholderData` o, si se mantiene, las páginas condicionan el estado de error a `isError` (no a `items.length`). Se prefiere exponer `isPlaceholderData` al consumidor y que las páginas muestren skeleton/error según `isError`. Esto también elimina el parpadeo de "página anterior" que hoy se muestra como si fuera la solicitada.

### D6. Reproductor

- `setStreamUrl`: tras actualizar la URL solicitada, si el reproductor está sonando se llama a `ensureLoaded(url)` para cargar la nueva fuente; el sondeo CORS registra el modo aplicado (`appliedCorsRef`) y solo re-aplica la fuente si el modo difiere.
- `useTrackProgress`: se guarda `elapsedRef` con la posición actual; al pasar a `isPlaying === true` se re-ancla `startRef = Date.now() - elapsedRef * 1000`, de modo que la pausa no se computa.
- `useHlsVideo`: se ignora todo error no fatal (`if (!data.fatal) return`) y no se trata `stalled` como fatal; si no hay vía de reproducción (`!Hls.isSupported()` y sin HLS nativo) se marca `status = 'error'`.
- `videos`: las URLs `.m3u8` se enrutan a HLS en lugar de `<video>` nativo.

### D7. Tenant

Se mantiene la resolución por build (`VITE_CLIENT_ID`). Se elimina de la spec `app-shell` el fallback `/c/{clientId}` y el disparador por subdominio por contradecir `multitenancy` y `docs/deploy.md`. La descripción de "resolución híbrida" en `openspec/config.yaml` es contexto de workflow y queda como deuda documental fuera de este cambio (no se edita configuración de workflow aquí).

### D8. Ajustes menores

Locale `es-CL` en `format.ts`; `useDocumentTitle` con fallback a `getBakedClientName()`; timeout de "copiado" limpiado en `ShareModal`; matcher de host del SW con igualdad exacta o subdominio (`=== 'panelipstream.cl' || endsWith('.panelipstream.cl')`); `tsc -b` antes de `vite build` en `build-client.mjs`; MIME `application/manifest+json` para `manifest.webmanifest` en nginx.

## Risks / Trade-offs

- [El default `retries: 0` para POST podría reducir la resiliencia en escrituras idempotentes] → Se documenta y se permite opt-in explícito por método.
- [La migración a `injectManifest` puede alterar el ciclo de actualización del SW] → Se conserva `registerType: 'autoUpdate'` y se valida que `dist/sw.js` precachee los mismos assets y aplique las mismas reglas.
- [Cambiar `usePaginatedList` puede alterar la UX de carga entre páginas] → Se preserva `staleTime` y se sustituye el placeholder por un estado de carga explícito.
- [El fallback de `deviceId` en memoria no persiste entre recargas] → Es preferible a registrar IDs nuevos; el registro se reintenta cuando vuelva el storage y el endpoint es idempotente por `deviceId`.
- [Reconciliar spec `app-shell` con `multitenancy` podría chocar con una expectativa de `/c/{clientId}`] → Decisión explícita D7 y se deja constancia en el proposal; revertir la spec sería un cambio aparte.

## Migration Plan

No hay migración de datos. Orden sugerido: helpers compartidos (D1, D2, D4) → consumidores (polls, detalle, listados) → reproductor (D6) → PWA/build/nginx (D3, D8). Reversión: el cambio es código puro, se revierte con el commit. Sin cambios de backend ni de datos.

## Open Questions

- Ninguna que bloquee specs, enfoque o tareas. La reconciliación de la descripción "híbrida" en `openspec/config.yaml` se tratará como deuda documental separada.
