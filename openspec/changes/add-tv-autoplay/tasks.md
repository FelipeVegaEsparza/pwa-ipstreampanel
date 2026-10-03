# Tasks

## 1. Autoplay en el hook

- [x] 1.1 Extender `useHlsVideo` para intentar `play()` al haber imagen (manifiesto en HLS / metadatos en nativo), degradar a `muted` si el navegador lo rechaza y exponer `muted`, `needsInteraction` y `enableSound`; verificar con tests del hook (play ok, bloqueado → muted, bloqueado dos veces → needsInteraction).
- [x] 1.2 Basar `status='playing'` en el evento `playing` del `<video>` (HLS y nativo); ajustar los tests existentes de `useHlsVideo`.

## 2. Control de sonido en el reproductor

- [x] 2.1 En `TvPlayer`, mostrar el botón "Activar sonido" cuando `muted` y un botón "Reproducir" cuando `needsInteraction` (accesibles, `aria-pressed`); verificar con test de `TvPlayer`.
- [x] 2.2 Estilos del botón/overlay en `TvPlayer.module.css`; verificar con `npm run build`.

## 3. Verificación

- [x] 3.1 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`; verificar que pasan.
- [x] 3.2 Validar el cambio con `openspec validate add-tv-autoplay` sin issues.
