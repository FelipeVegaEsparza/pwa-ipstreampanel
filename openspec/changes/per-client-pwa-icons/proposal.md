## Why

Hoy todos los builds de cliente comparten los mismos iconos (`public/favicon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`). Cada radio debería mostrar su propia marca tanto en la pestaña como en el icono de instalación de la PWA, sin duplicar assets compartidos ni tocar código del core por cliente.

## What Changes

- **Assets de marca por cliente**: nueva carpeta `clients/<nombre>/icons/` con los 5 archivos de branding (`favicon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`).
- **publicDir fusionado en build**: `scripts/build-client.mjs` construye un `publicDir` temporal (copia de `public/` + overlay de `clients/<nombre>/icons/`) y lo pasa al build mediante `VITE_PUBLIC_DIR`, con limpieza del temporal.
- **Selección en Vite**: `vite.config.ts` usa `publicDir: process.env.VITE_PUBLIC_DIR || 'public'`. El manifest generado por VitePWA conserva los mismos nombres de icono, así que no cambia `manifest.icons` ni `includeAssets`.
- **Overlay parcial**: si un cliente solo define algunos archivos, el resto se hereda de `public/` (por ejemplo, `offline.html` nunca se duplica).
- **Scaffold de cliente nuevo**: `scripts/new-client.mjs` crea `clients/<nombre>/icons/` copiando los iconos compartidos como punto de partida.
- **Documentación**: `docs/deploy.md` explica cómo personalizar los iconos por radio.

Fuera de alcance: generación automática de PNG desde un logo, cambio de `theme_color` por cliente y favicon dinámico en runtime.

## Capabilities

### New Capabilities

- `client-branding`: permite que cada build de cliente sirva su propio favicon e iconos de instalación PWA, con fallback a los assets compartidos.

### Modified Capabilities

- (ninguna)

## Impact

- **Nuevo código/assets**: `clients/<nombre>/icons/` (convención) y `scripts/`.
- **Modificado**: `scripts/build-client.mjs`, `scripts/new-client.mjs`, `vite.config.ts`, `docs/deploy.md`.
- **Sin cambios**: manifest de VitePWA (`manifest.icons`/`includeAssets`), service worker, runtime de la app y contrato de la API.
- **Multi-tenant**: cada build sigue siendo un cliente; los assets no se filtran entre builds.
