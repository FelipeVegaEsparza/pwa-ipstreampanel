## Why

La app ya es un renderizador data-driven (muestra lo que el backend expone por `clientId`), pero solo renderiza el shell, el reproductor mínimo y contadores. Para que cada radio muestre su contenido real, hay que implementar las secciones de lectura (noticias, programas, galerías, podcasts, videocasts, eventos, auspiciadores, promociones y TV en vivo) y sus páginas de detalle, todas visibles **solo si el backend entrega datos** y ocultas si no.

## What Changes

- **Secciones data-driven**: se renderizan secciones de contenido que aparecen únicamente cuando su recurso del API tiene datos (`noticias`, `programas`, `galerías`, `podcasts`, `videocasts`, `eventos`, `auspiciadores`, `promociones`, `TV en vivo`). Si el recurso viene vacío o `null`, la sección no se muestra.
- **Páginas de detalle**: noticia por slug (`/noticias/:slug`), podcast por id (`/podcasts/:id`) y videocast por id (`/videocasts/:id`), con deep links enrutados.
- **Estados de carga/error/vacío** en cada sección (degradación elegante, sin romper la app).
- **Imágenes con `buildImageUrl`** y lazy-loading.
- **TV en vivo**: si `basicData.videoStreamingUrl` existe, se muestra la sección/player de TV (HLS).
- Se reutilizan las funciones tipadas de `core/api`, los adaptadores (`asArray`, `normalizeWeekDay`, `getNewsCategory`, `normalizePagination`) y los modelos de `core/types` ya existentes.

## Capabilities

### New Capabilities

- `content-sections`: Renderiza las secciones de lectura del contenido de un cliente, cada una solo si su recurso tiene datos; maneja estados de carga/error/vacío y usa adaptadores para normalizar.
- `content-detail`: Páginas de detalle enrutadas para noticia (slug), podcast (id) y videocast (id), con carga por URL directa y manejo de no-encontrado.

### Modified Capabilities

- Ninguna. `api-client` y `templates` ya exponen lo necesario (funciones tipadas, `buildImageUrl`, `useFullClientData`); este cambio solo las consume.

## Impact

- **Nuevo código**: `src/modules/` con una carpeta por módulo (`news/`, `programs/`, `galleries/`, `podcasts/`, `videocasts/`, `events/`, `sponsors/`, `announcers/`, `promotions/`, `tv/`) con sus componentes y hooks de query; componentes de UI compartidos para tarjetas/grids/listas/estados; rutas de detalle en `src/app/App.tsx`; secciones integradas en los templates.
- **API consumida**: `GET /api/public/{clientId}/news`, `/news/{slug}`, `/programs`, `/galleries`, `/podcasts`, `/podcasts/{id}`, `/videocasts`, `/videocasts/{id}`, `/events`, `/sponsors`, `/announcers`, `/promotions`; paginación (`page`/`limit`) para news, podcasts y videocasts.
- **Sin cambios de dependencias**: se reutiliza la capa de datos existente.
- **No afecta**: encuestas y chat (fase 2, interactiva), formularios, ni el modelo de despliegue.
