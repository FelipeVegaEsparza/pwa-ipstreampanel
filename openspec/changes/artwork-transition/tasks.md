## 1. Prefetch del streaming

- [x] 1.1 En `src/app/App.tsx`, durante el splash, prefetchear `['streaming', clientId]` con `queryClient.prefetchQuery` y `getStreaming`. Verificar con `npm run typecheck` y un test que compruebe que se llama a `/streaming` antes de montar el template.
- [x] 1.2 Verificar que el template no dispara una segunda consulta distinta (misma queryKey) y que `npm run test` sigue verde.

## 2. Crossfade en SmartImage

- [x] 2.1 Agregar el prop `crossfade` a `src/ui/SmartImage.tsx` con las dos capas, promoción al cargar, avance de fallback sin fundido y `SmartImage.module.css` con la transición (y `prefers-reduced-motion`). Verificar con `npm run typecheck`.
- [x] 2.2 Tests de `SmartImage` en modo crossfade: la imagen nueva aparece al cargar, el fallback avanza si falla, y el modo por defecto sigue igual. Verificar con `npm run test`.
- [x] 2.3 Aplicar `crossfade` al `SmartImage` del artwork del hero en los templates (minimalista, covered, blue, moderno, tradicional, app, petroleo, playlist). Verificar con `npm run test` y `npm run build`.

## 3. Logo del splash

- [x] 3.1 Subir el logo del splash a 160px en `index.html` y `src/app/LoadingScreen.tsx` (+ CSS). Verificar con `npm run build:client -- radio-prueba`.

## 4. Documentación y verificación final

- [x] 4.1 Actualizar `docs/splash-carga.md` (tamaño del logo y que el streaming se prepara durante el splash).
- [x] 4.2 Ejecutar `npm run typecheck && npm run lint && npm run test && npm run build` y confirmar que todo pasa.

## 5. Logo del splash más grande

- [x] 5.1 Duplicar el logo del splash a 320px (con tope responsive `80vw`) en `index.html`, `src/app/LoadingScreen.tsx`/`.module.css` y `src/core/seo/splash.ts`, y actualizar `docs/splash-carga.md`. Verificar con `npm run build:client -- radio-prueba`.
