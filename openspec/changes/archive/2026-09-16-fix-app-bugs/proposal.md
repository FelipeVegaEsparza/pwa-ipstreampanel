## Why

La aplicación funciona en el camino feliz (typecheck, lint y 112 tests pasan), pero una revisión del código contra `docs/instruccionesapi.md` y las specs del proyecto encontró defectos de comportamiento que no cubren las herramientas: votos duplicados por reintentos de POST, crashes por `localStorage` sin guardar, la página offline que nunca se muestra, detalle que confunde "no encontrado" con error de red, y varios problemas del reproductor (cambio de stream en caliente, progreso tras pausa, HLS). Se corrigen sin alterar el comportamiento válido actual.

## What Changes

- **Escrituras sin reintento**: `votePoll` (y cualquier POST futuro) deja de heredar los 3 reintentos de `request()`, que hoy pueden duplicar un voto porque la API no deduplica server-side. El reintento de 5xx/red queda solo para GET.
- **Almacenamiento tolerante a fallos**: accesos a `localStorage` en votación protegidos con try/catch; la home degrada en vez de caer cuando el storage está bloqueado.
- **Página offline real**: el service worker registra un fallback de navegación hacia `offline.html` cuando no hay caché, en vez de servir siempre el shell.
- **Resolución de tenant coherente**: se elimina de `app-shell` el fallback por ruta `/c/{clientId}` (y el subdominio) que nunca se implementó y contradice `multitenancy` (build por cliente). La spec queda alineada con la arquitectura real.
- **Detalle con error distinguido**: noticia/podcast/videocast separan 404 ("no encontrado") de error de conexión, y este último ofrece reintentar.
- **Paginación sin datos obsoletos**: el error al cambiar de página se muestra con reintento en vez de quedar enmascarado por los datos de la página anterior.
- **Reproductor**: al cambiar la `streamUrl` en caliente se carga la nueva fuente; el progreso se reanuda sin sumar el tiempo en pausa; la TV/HLS recupera errores no fatales, marca error si no hay soporte y ofrece reintento.
- **DeviceId estable**: si la persistencia local no está disponible, se usa un fallback en memoria para no registrar instalaciones repetidas con IDs distintos.
- **Ajustes menores**: título con fallback al nombre del build, locale `es-CL` consistente, guardas en `poll.options`, timeout de "copiado" limpiado, matcher de host del service worker más estricto, `tsc -b` antes del build de cliente y MIME JSON del manifest en nginx.

Fuera de alcance: el chat (su sección no está montada) y cualquier funcionalidad nueva no solicitada.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `api-client`: las solicitudes de escritura (POST) no se reintentan; solo los GET reintentan errores 5xx/red.
- `polls`: degrada si `localStorage` no está disponible y no marca la encuesta como votada ante error.
- `app-shell`: se elimina el fallback por ruta `/c/{clientId}`; la página offline se muestra como fallback de navegación; el `deviceId` es estable aun sin persistencia.
- `content-detail`: distingue "no encontrado" (404) de error de conexión y ofrece reintento.
- `listings`: el error de una página se muestra con reintento y no se enmascara con la página anterior.
- `player-metadata`: carga la nueva `streamUrl` cuando cambia y usa `/streaming/status` en un ciclo de polling ligero.
- `player-progress`: al reanudar tras una pausa no se suma el tiempo en pausa.
- `content-sections`: la sección de TV en vivo gestiona errores HLS no fatales, marca error si no hay soporte y permite reintentar.
- `videos`: las URLs HLS (`.m3u8`) del ranking se reproducen con HLS en vez de `<video>` nativo.
- `pwa-install`: el título del documento usa el nombre del build como fallback cuando no hay `projectName`.

## Impact

- **Código**: `src/core/api/{client,index}.ts`, `src/core/hooks/*`, `src/modules/polls/PollCard.tsx`, `src/modules/player/{PlayerContext,useTrackProgress,useMediaSession,useHlsVideo}`, `src/modules/content/*DetailPage.tsx`, `src/modules/weather` (locale), `src/modules/share/ShareModal.tsx`, `vite.config.ts`, `nginx.conf`, `scripts/build-client.mjs`.
- **API**: sin cambios de contrato; se agrega política de reintento para escrituras. No se inventan endpoints.
- **PWA/build**: ajustes de service worker, manifest y build que no cambian la estructura de despliegue por cliente.
- **Multi-tenant**: la corrección del tenantId de storage y caché mantiene el aislamiento por `clientId`.
- **No afecta**: backend del panel, templates como componentes, ni el flujo de contacto.
