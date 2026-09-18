## Why

Hoy las secciones de Noticias, Podcasts y Videocasts sacan al usuario del home: al hacer clic en un ítem navega a una página de detalle (`/noticias/:slug`, `/podcasts/:id`, `/videocasts/:id`) y "Ver todas/todos" navega a una página de listado. Eso rompe la experiencia de app/PWA, que se siente más fluida cuando el contenido se abre in-place. Se quiere que el contenido se abra en modales, manteniendo las rutas solo como respaldo para enlaces directos.

## What Changes

- En Noticias, Podcasts y Videocasts, hacer clic en un ítem SHALL abrir un modal con su contenido (lectura, audio o video) sin navegar fuera del home. Aplica a todos los templates.
- Las acciones "Ver todas/todos" SHALL abrir un modal de listado en lugar de navegar a la página.
- Se quitan los enlaces internos a las páginas de detalle ("Ver noticia completa", "Ver ficha").
- Las páginas y rutas de listado y detalle (`/noticias`, `/noticias/:slug`, `/podcasts`, `/podcasts/:id`, `/videocasts`, `/videocasts/:id`) SHALL conservarse para acceso por URL directa (deep link/recarga), sin cambios de contrato de API.
- **BREAKING** (solo navegación interna): la app ya no navega a las páginas de listado/detalle; los enlaces directos siguen funcionando.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `content-sections`: el contenido de Noticias/Podcasts/Videocasts se abre en modal in-place y "Ver todas/todos" abre un modal de listado.
- `listings`: la acción "Ver todas" del home abre un modal de listado; la página de listado sigue disponible por URL directa.

## Impact

- Código: `src/modules/content/NewsSection.tsx`, `PodcastsSection.tsx`, `VideocastsSection.tsx` y `ContentSections.tsx`; nuevos componentes de modal de contenido y de listado reutilizables.
- Se conservan `NewsListPage`, `PodcastsListPage`, `VideocastsListPage`, `NewsDetailPage`, `PodcastDetailPage`, `VideocastDetailPage` y sus rutas en `App.tsx`.
- Tests de secciones y de listados; verificación de que los deep links siguen funcionando.
- Sin cambios de API, datos ni dependencias.
