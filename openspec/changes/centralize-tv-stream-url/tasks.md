# Tasks

## 1. Fuente central de TV

- [x] 1.1 Agregar `getTvStreamUrl(basicData: BasicData | null | undefined): string | null` en `src/core/service/index.ts` (trim + `null` cuando vacío) y verificar con `npm run typecheck`
- [x] 1.2 Agregar tests unitarios de `getTvStreamUrl` en `src/core/service/index.test.ts` (URL válida, con espacios, `null` y cadena vacía) y verificar con `npm test -- src/core/service`

## 2. Migrar los reproductores de TV

- [x] 2.1 Reemplazar la derivación inline por `getTvStreamUrl` en `src/modules/content/TvSection.tsx` y verificar con `npm test -- src/modules/content/TvSection.test.tsx`
- [x] 2.2 Reemplazar la derivación inline por `getTvStreamUrl` en los 10 templates (`app`, `blue`, `covered`, `minimalista`, `moderna`, `moderno`, `moderno2`, `petroleo`, `playlist`, `tradicional`) y verificar con `npm run typecheck`
- [x] 2.3 Actualizar el fixture de `src/templates/templates.render.test.tsx` de `/live/tv.m3u8` a una URL `/tv/...` y verificar con `npm test -- src/templates`

## 3. Verificación de integración

- [x] 3.1 Correr `npm test && npm run typecheck && npm run lint` y confirmar que ningún reproductor de TV construye rutas `/live`, `/dj` ni `/vod`
