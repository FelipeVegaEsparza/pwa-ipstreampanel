## 1. Helpers compartidos

- [x] 1.1 En `src/core/api/client.ts`, reintentar solo métodos idempotentes (`GET`/`HEAD`): el valor por defecto de `retries` para escrituras (POST/PUT/PATCH/DELETE) pasa a `0`. Verificar con `npm run test` (los tests de `client.test.ts` deben seguir pasando y agregar un caso de POST 5xx sin reintento).
- [x] 1.2 Introducir un error HTTP tipado (`ApiError` con `status`) en la capa de API y usarlo en `fetchJSON` y en los helpers POST de `src/core/api/index.ts`. Verificar con `npm run typecheck` y tests unitarios que expongan `status` en el error.
- [x] 1.3 Crear `src/core/storage/safeStorage.ts` con `readString`/`writeString` tolerantes a excepciones y un `getOrCreateDeviceId` con respaldo en memoria estable por sesión. Verificar con tests unitarios que simulan `localStorage` bloqueado.

## 2. Encuestas

- [x] 2.1 Refactorizar `src/modules/polls/PollCard.tsx` para usar `safeStorage` en la lectura y escritura de `poll_{pollId}`, y proteger `poll.options` con `(poll.options?.length ?? 0)`. Verificar con `npm run test`.
- [x] 2.2 Agregar/ajustar tests de `PollCard`: con `localStorage` que lanza, el componente se renderiza y permite votar; un error de red no persiste `poll_{pollId}` ni marca votado. Verificar con `npm run test`.

## 3. Detalle y listados

- [x] 3.1 En `NewsDetailPage`, `PodcastDetailPage` y `VideocastDetailPage`, distinguir 404 ("no encontrado") de error de conexión/5xx y mostrar un `ErrorScreen` recuperable con `onRetry` para este último. Verificar con tests que renderizan ambos casos.
- [x] 3.2 Ajustar `src/core/hooks/usePaginatedList.ts` y las páginas de listado para que el error de una página se muestre con reintento y no quede enmascarado por `placeholderData` (usar `isError`/`isPlaceholderData`). Verificar con tests de `NewsListPage`/`PodcastsListPage`/`VideocastsListPage` que simulan fallo de la página 2.

## 4. Reproductor

- [x] 4.1 En `src/modules/player/PlayerContext.tsx`, cargar la nueva `streamUrl` cuando cambie con reproducción activa y no reiniciar la fuente si el sondeo CORS concluye en el mismo modo ya aplicado (registrar el modo aplicado). Verificar con tests de cambio de URL en caliente.
- [x] 4.2 En `src/modules/player/useTrackProgress.ts`, re-anclar el reloj al reanudar tras una pausa usando la posición acumulada. Verificar con test de pausa larga + reanudación sin salto.
- [x] 4.3 En `src/modules/player/useHlsVideo.ts`, ignorar errores no fatales, no tratar `stalled` como fatal y marcar `error` cuando no haya vía de reproducción HLS. Verificar con tests que simulan `data.fatal` verdadero/falso y ausencia de soporte.
- [x] 4.4 En `src/modules/videos/VideosSection.tsx`/`embed.ts`, enrutar URLs `.m3u8` a reproducción HLS en vez de `<video>` nativo. Verificar con test de render para una URL `.m3u8`.

## 5. PWA y tenant

- [x] 5.1 En `src/modules/pwa/register.ts`, reutilizar `getOrCreateDeviceId` con respaldo en memoria para no generar IDs nuevos cuando falla la persistencia. Verificar con tests de almacenamiento bloqueado (no debe haber múltiples `POST /pwa/register` con IDs distintos).
- [x] 5.2 Migrar a `strategies: 'injectManifest'` en `vite.config.ts` con `src/sw.ts` que precachee el shell, conserve las reglas `runtimeCaching` actuales y agregue el fallback de navegación a `offline.html`. Verificar con `npm run build` e inspección de `dist/sw.js` (offline precacheado, catch handler presente, streaming/chat NetworkOnly).
- [x] 5.3 Endurecer el matcher de host del service worker a `=== 'panelipstream.cl' || endsWith('.panelipstream.cl')`. Verificar por inspección del `runtimeCaching` generado.
- [x] 5.4 En `src/core/hooks/useDocumentTitle.ts`, usar `getBakedClientName()` como fallback y actualizar el título ante cambios. Verificar con test de `projectName` nulo.

## 6. Ajustes menores

- [x] 6.1 Unificar el locale a `es-CL` en `src/modules/content/format.ts` (y cualquier otro `es-ES` visible). Verificar con tests de formato existentes.
- [x] 6.2 Limpiar el `setTimeout` de `src/modules/share/ShareModal.tsx` al desmontar o al recopiar. Verificar con test que monta/desmonta antes de los 2s sin warnings.
- [x] 6.3 Declarar `application/manifest+json` para `manifest.webmanifest` en `nginx.conf`. Verificar con `nginx -t` o inspección de la configuración.
- [x] 6.4 Ejecutar `tsc -b` antes de `vite build` en `scripts/build-client.mjs`. Verificar con `npm run build:client -- radio-prueba` y confirmar que un error de tipos detiene el build.

## 7. Verificación final

- [x] 7.1 Ejecutar `npm run typecheck && npm run lint && npm run test && npm run build` y confirmar que todo pasa (112 tests previos siguen verdes).
- [ ] 7.2 Smoke manual con `clients/fusionaustral/client.json`: home, votar (una sola vez), detalle de noticia con URL directa, TV si aplica, instalación PWA y navegación offline (`offline.html` visible). Documentar el resultado.
