## Context

Ver `proposal.md` - Why. Estado actual relevante:

- `InstallPrompt` captura `beforeinstallprompt` a nivel de módulo (puede dispararse antes de montar el componente) y muestra un botón de texto "Instalar app" solo si hay prompt diferido y la app no está en modo standalone.
- Los templates ya renderizan `<InstallPrompt />`, así que reemplazar el componente alcanza a todos.
- `public/app-android.png` y `public/app-apple.png` están disponibles como assets (se copian en cada build).

## Goals / Non-Goals

**Goals:**

- Dos botones con las imágenes de plataforma en lugar del botón de texto.
- Android instala; si no hay prompt, muestra instrucciones.
- Apple muestra instrucciones (iOS no dispara `beforeinstallprompt`).
- Ocultar cuando ya está instalada.

**Non-Goals:**

- Cambiar manifest/service worker.
- Detección exhaustiva de dispositivos; basta con ofrecer ambos botones.

## Decisions

### D1. Dos botones siempre visibles (salvo instalada)

Se muestran ambos botones mientras la app no esté instalada. El botón Android intenta el prompt; el botón Apple muestra el modal. Alternativa: mostrar solo el botón de la plataforma detectada - más complejo y frágil (user agents); ofrecer ambos es simple y el modal cubre el caso no soportado.

### D2. Resultado del prompt con estados

`promptInstall()` devuelve `accepted | dismissed | unavailable`. El modal de Android solo se abre en `unavailable` (sin prompt). Si el usuario acepta se ocultan los botones; si descarta, no se insiste con un modal.

### D3. Modal accesible y reutilizable

Nuevo `InstallHelpModal` con `platform: 'apple' | 'android'`, `role="dialog"`, `aria-modal`, cierre con Escape, botón y clic en el fondo. El contenido por plataforma son pasos numerados.

### D4. Estado a nivel de módulo + reset para tests

Se mantiene la captura en módulo de `beforeinstallprompt`/`appinstalled`. Se expone `resetInstallPromptForTests()` para aislar los tests.

### D5. Ocultar al instalar

El listener de `appinstalled` marca la app como instalada y limpia el prompt; `isStandalone()` cubre el arranque ya instalado.

## Risks / Trade-offs

- [Mostrar el botón Apple también en Android/desktop] → El modal de iOS es informativo; no rompe nada.
- [El prompt nativo puede no estar disponible en algunos navegadores] → El botón Android cae al modal de instrucciones.
- [Estado de módulo compartido entre tests] → `resetInstallPromptForTests()` en `beforeEach`.
