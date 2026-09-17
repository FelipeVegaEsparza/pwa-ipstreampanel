## Why

El botón "Instalar app" es un texto genérico y sólo aparece cuando el navegador dispara `beforeinstallprompt` (que no existe en iOS). Se quiere reemplazarlo por botones con marca de plataforma (`app-android.png` y `app-apple.png`): en Android dispara el instalador de la PWA y en Apple muestra un modal con las instrucciones para agregar a la pantalla de inicio.

## What Changes

- **Botones con imágenes por plataforma**: `InstallPrompt` deja de ser un botón de texto y pasa a mostrar dos botones con `/app-android.png` y `/app-apple.png`, en todos los templates que ya lo renderizan.
- **Android dispara el prompt**: al pulsar el botón Android se ejecuta `beforeinstallprompt.prompt()`. Si el prompt no está disponible, se muestra un modal con las indicaciones de Android.
- **Apple muestra instrucciones**: al pulsar el botón Apple se abre un modal con los pasos de "Añadir a pantalla de inicio" en iOS (Safari → Compartir → Añadir a pantalla de inicio).
- **Ocultar al instalar**: ambos botones se ocultan cuando la app ya está instalada (`appinstalled` o modo standalone).
- **Modal accesible**: `role="dialog"`, cierre con Escape, clic en el fondo y botón de cerrar.

Fuera de alcance: cambiar el manifest o el service worker, y otros flujos de instalación.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `pwa-install`: el botón de instalación pasa a ser dos botones con marca por plataforma, con prompt en Android y modal de instrucciones en Apple.

## Impact

- **Modificado**: `src/modules/pwa/InstallPrompt.tsx` y su CSS; nuevo `InstallHelpModal`.
- **Sin cambios**: templates (siguen usando `<InstallPrompt />`), manifest, service worker, contrato del API.
- **Assets**: usa `/app-android.png` y `/app-apple.png` de `public/`.
