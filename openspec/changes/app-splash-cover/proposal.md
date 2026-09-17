## Why

Al abrir la URL de un cliente se ve un flash: primero el template por defecto (`minimalista`) y luego el template seleccionado en el panel, además de un instante en blanco antes de que cargue JavaScript. Se quiere un splash que use la portada del cliente para ocultar esa transición y mostrar directo el template elegido.

## What Changes

- **Splash con la portada del cliente**: el HTML inicial (antes de JS) muestra un splash con la portada (`coverUrl`, fallback a `logoUrl`) como fondo, inyectado en build time.
- **Loader en React**: `LoadingScreen` reutiliza la portada inyectada y un spinner.
- **Gate del template**: `TenantApp` renderiza el splash mientras no haya datos del cliente, y monta el template seleccionado recién cuando `selectedTemplate` está disponible, evitando el flash del template por defecto.
- **Helper de splash**: `src/core/seo/splash.ts` con `renderSplash`/`injectSplash` (+ tests) y un plugin de Vite que reemplaza el marcador `<!-- app-splash -->`.
- **Build**: `build-client.mjs` expone la portada resuelta en `VITE_SPLASH_IMAGE`.
- **Documentación**: se documenta el comportamiento del splash.

Fuera de alcance: splash del sistema operativo al abrir la PWA instalada (Android/iOS no lo controla el HTML).

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `app-shell`: se agrega un requisito de splash de carga con la portada del cliente y el gate del template hasta conocer `selectedTemplate`.

## Impact

- **Nuevo código**: `src/core/seo/splash.ts` (+ tests).
- **Modificado**: `index.html`, `vite.config.ts`, `scripts/build-client.mjs`, `src/app/LoadingScreen.tsx`, `src/app/App.tsx`, `docs/`.
- **Sin cambios**: contrato del API, manifest PWA, service worker, templates individuales.
- **Multi-tenant**: la portada mostrada es la del `clientId` del build.
