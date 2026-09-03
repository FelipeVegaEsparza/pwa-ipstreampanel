## 1. UI compartida

- [x] 1.1 Crear en `src/ui/` los componentes `Section`, `Card`, `Grid`, `Skeleton`, `EmptyState` y `Pagination` con CSS Modules, y verificar con `npm run typecheck` y render de pruebas
- [x] 1.2 Añadir helper de render de imágenes (lazy-load + `buildImageUrl` + fallback por `onError`) en `src/ui/` y verificar con tests de vitest

## 2. Módulos de lectura (spec `content-sections`)

- [x] 2.1 Implementar el módulo de **Noticias** (lista de tarjetas con imagen, título, `shortText` y fecha; categoría si `source: generic`) consumiendo `useFullClientData`, y verificar que la sección no se muestra con `news` vacío
- [x] 2.2 Implementar el módulo de **Programas** (grilla por día con `normalizeWeekDay` y horario `startTime`–`endTime`), y verificar que se oculta con `programs` vacío
- [x] 2.3 Implementar el módulo de **Galerías** (grid de galerías con `images` en lightbox simple), y verificar que se oculta con `galleries` vacío
- [x] 2.4 Implementar el módulo de **Podcasts** (tarjetas con `imageUrl`, título, `duration`, `episodeNumber`/`season`, enlace a detalle) y el de **Videocasts** (igual, enlace a detalle), y verificar que se ocultan con listas vacías
- [x] 2.5 Implementar los módulos de **Eventos**, **Auspiciadores**, **Promociones** y **Locutores** (tarjetas con sus campos), y verificar que se ocultan con listas vacías
- [x] 2.6 Implementar la sección de **TV en vivo** (solo si `basicData.videoStreamingUrl` existe, con reproducción HLS vía `hls.js` y fallback nativo), y verificar que se oculta si la URL es `null`

## 3. Integración en templates

- [x] 3.1 Integrar las secciones data-driven en el template `minimalista` (usando `Section`), y verificar en navegador que solo aparecen las secciones con datos
- [x] 3.2 Integrar las secciones data-driven en el template `moderna`, y verificar el mismo comportamiento

## 4. Páginas de detalle (spec `content-detail`)

- [x] 4.1 Agregar la ruta `/noticias/:slug` con el componente de detalle de noticia (consulta `getNewsBySlug`) y manejo de no encontrado, y verificar navegando a un slug válido e inexistente
- [x] 4.2 Agregar la ruta `/podcasts/:id` con detalle + reproductor de audio (`audioUrl`) y no encontrado, y verificar con un id válido e inexistente
- [x] 4.3 Agregar la ruta `/videocasts/:id` con detalle + reproductor de video (`videoUrl`) y no encontrado, y verificar con un id válido e inexistente
- [x] 4.4 Verificar que las URLs de detalle cargan por deep link (recargar la ruta directamente sin romperse)

## 5. Verificación de integración

- [x] 5.1 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build:client -- fusionaustral` y confirmar que pasan
- [x] 5.2 Smoke en navegador contra el cliente de prueba: verificar que las secciones con datos se muestran, las vacías se ocultan, la TV aparece solo si `videoStreamingUrl` existe, y los detalles cargan por URL
