## 1. Botones de instalación

- [x] 1.1 Reescribir `src/modules/pwa/InstallPrompt.tsx`: dos botones con `/app-android.png` y `/app-apple.png`, Android dispara el prompt (o modal si no está disponible) y Apple abre el modal; ocultar cuando ya está instalada. Verificar con `npm run typecheck`.
- [x] 1.2 Actualizar `InstallPrompt.module.css` para la fila de botones e imágenes. Verificar por inspección.

## 2. Modal de indicaciones

- [x] 2.1 Crear `src/modules/pwa/InstallHelpModal.tsx` (+ `.module.css`) con `platform`, `role="dialog"`, `aria-modal`, cierre con Escape/botón/fondo y pasos por plataforma. Verificar con `npm run typecheck`.
- [x] 2.2 Tests de `InstallPrompt`: muestra los dos botones, Android llama al `prompt`, Android sin prompt abre el modal, Apple abre el modal, se cierra, y se oculta tras `appinstalled`. Verificar con `npm run test`.

## 3. Documentación y verificación final

- [x] 3.1 Documentar el nuevo botón de instalación en `docs/` (Android/Apple y modal).
- [x] 3.2 Ejecutar `npm run typecheck && npm run lint && npm run test && npm run build` y confirmar que todo pasa.
- [x] 3.3 Verificar por inspección que `dist/<cliente>/` incluye `app-android.png` y `app-apple.png`.

## 4. Ubicación en covered

- [x] 4.1 En `CoveredTemplate`, mover `<InstallPrompt />` del header superior al contenido del hero (junto a los controles). Verificar con `npm run test` y `npm run build`.
