## Why

Al terminar el splash, el template monta con el reproductor sin datos de streaming, así que el hero muestra el logo/portada de la radio y, cuando responde `/streaming`, salta de golpe a la carátula del tema. Además el logo del splash quedó pequeño. Se quiere que la carátula del tema esté lista al montar y que cualquier cambio de imagen sea suave.

## What Changes

- **Prefetch del streaming durante el splash**: `TenantApp` inicia `GET /streaming` mientras se muestra el splash, para que al montar el template la carátula del tema ya esté en caché y no haya salto desde el logo.
- **Crossfade de imágenes**: `SmartImage` gana un modo `crossfade` (fundido cruzado al cambiar la fuente) que se aplica al artwork del hero de los templates; el cambio deja de ser un salto seco.
- **Logo del splash más grande**: de 120px a 160px.

Fuera de alcance: precargar todas las imágenes de las secciones y el splash del sistema operativo.

## Capabilities

### New Capabilities

- `artwork-transition`: prepara el estado del reproductor antes de montar el template y hace una transición suave (crossfade) cuando cambia la imagen del artwork.

### Modified Capabilities

- (ninguna)

## Impact

- **Modificado**: `src/app/App.tsx` (prefetch), `src/ui/SmartImage.tsx` (+ CSS/tests), templates que muestran el artwork, `index.html` y `src/app/LoadingScreen.tsx` (tamaño del logo).
- **Sin cambios**: contrato del API, manifest, service worker.
- **Multi-tenant**: el prefetch usa el `clientId` del tenant; la caché de React Query ya está particionada por `clientId`.
