## 1. Helper de splash

- [x] 1.1 Crear `src/core/seo/splash.ts` con `renderSplash({ image, name })` e `injectSplash(html, input)` (reemplaza `<!-- app-splash -->` o inserta dentro de `#root`), con escape HTML. Verificar con `npm run typecheck`.
- [x] 1.2 Escribir `src/core/seo/splash.test.ts`: con imagen y sin imagen, con nombre, escape de caracteres especiales y reemplazo del marcador. Verificar con `npm run test`.

## 2. Splash estático (pre-JS)

- [x] 2.1 En `index.html`, agregar el marcador `<!-- app-splash -->` dentro de `#root` y el CSS inline del splash (overlay, nombre, spinner). Verificar por inspección.
- [x] 2.2 En `vite.config.ts`, agregar un plugin `ipstream-splash` con `transformIndexHtml` que llame a `injectSplash` con `VITE_SPLASH_IMAGE`/`VITE_CLIENT_NAME`. Verificar con `npm run build`.

## 3. Build y loader en React

- [x] 3.1 En `scripts/build-client.mjs`, exponer `VITE_SPLASH_IMAGE` con la imagen ya resuelta (cover→logo). Verificar con `npm run build:client -- radio-prueba`.
- [x] 3.2 Actualizar `src/app/LoadingScreen.tsx` (+ CSS) para usar `VITE_SPLASH_IMAGE` como fondo y el nombre del cliente, con spinner. Verificar visualmente y con tests.
- [x] 3.3 En `src/app/App.tsx`, `TenantApp` muestra `<LoadingScreen/>` mientras `isLoading && !data`, antes de montar el template. Verificar con tests de que no se renderiza el template por defecto durante la carga.

## 4. Documentación y verificación final

- [x] 4.1 Documentar el splash en `docs/` (qué imagen usa, gate del template y límites del splash del SO).
- [x] 4.2 Ejecutar `npm run typecheck && npm run lint && npm run test && npm run build` y confirmar que todo pasa.
- [x] 4.3 Verificar por inspección que `dist/radio-prueba/index.html` contiene el splash con la portada y que un cliente sin imagen compila con splash neutro.
