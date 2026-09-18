## 1. Shell y listados reutilizables

- [x] 1.1 Crear `ContentModal` (overlay fijo, `role="dialog"`, `aria-modal`, cierre por botón/`Escape`/fondo, bloqueo de scroll del body) con estilos y test de apertura/cierre. Verificar con `npx vitest run` del nuevo test.
- [x] 1.2 Extraer `NewsList`, `PodcastsList` y `VideocastsList` (props `page`, `onPageChange`, `onSelect`) y refactorizar `NewsListPage`/`PodcastsListPage`/`VideocastsListPage` para usarlos conservando `usePageParam`. Verificar con `npm run test` (list pages).

## 2. Modales de detalle

- [x] 2.1 En `NewsSection`, dejar el detalle solo en modal y quitar los enlaces a `/noticias` y `/noticias/:slug` ("Ver noticia completa"/"Ver todas"). Verificar con `npm run test`.
- [x] 2.2 Crear el modal de detalle de podcast (metadatos, `ShareModal`, reproductor `<audio>` si hay `audioUrl`) y usarlo desde `PodcastsSection`. Verificar con `npm run test`.
- [x] 2.3 En `VideocastsSection`, abrir el detalle en modal para todos los ítems (video si hay `videoUrl`, si no la ficha) y quitar el enlace "Ver ficha". Verificar con `npm run test`.

## 3. Modales de listado ("Ver todas/todos")

- [x] 3.1 Implementar el modal de listado de noticias desde "Ver todas", con paginación local y apertura del detalle al seleccionar. Verificar con `npm run test`.
- [x] 3.2 Implementar el modal de listado de podcasts con el mismo flujo. Verificar con `npm run test`.
- [x] 3.3 Implementar el modal de listado de videocasts con el mismo flujo. Verificar con `npm run test`.

## 4. Verificación final

- [x] 4.1 Ejecutar `npm run lint`, `npm run test` completos y `openspec validate content-sections-modals`; verificar que todo pase sin errores.
- [x] 4.2 Verificar que las URLs directas `/noticias`, `/noticias/:slug`, `/podcasts`, `/podcasts/:id`, `/videocasts`, `/videocasts/:id` siguen cargando sus páginas (deep link/recarga).
