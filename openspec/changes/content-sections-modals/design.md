## Context

El home entrega solo las últimas 10 noticias/podcasts/videocasts (`clientData`), mientras que las páginas de listado paginan con `GET /news|/podcasts|/videocasts?page&limit` (`usePaginatedList` + `usePageParam`). `NewsSection` ya abre un `NewsModal` (consulta por slug + compartir); `VideocastsSection` abre un overlay para los reproducibles; `PodcastsSection` navega. Las rutas `/noticias`, `/podcasts`, `/videocasts` y sus detalle deben conservarse como respaldo. Ver proposal.md - Why y specs/.

## Goals / Non-Goals

**Goals:**
- Abrir el contenido de Noticias/Podcasts/Videocasts en modales in-place, en todos los templates.
- "Ver todas/todos" abre un modal de listado con paginación (no la página).
- Reutilizar la lógica de listado entre página y modal, sin duplicar.
- Mantener las rutas/páginas de listado y detalle para deep links.

**Non-Goals:**
- No tocar las secciones que ya son inline o modal (galerías, programas, eventos, etc.).
- No cambiar el contrato ni los endpoints de la API.
- No eliminar las páginas ni rutas existentes.

## Decisions

### D1. Shell de modal reutilizable
Se crea un componente `ContentModal` (overlay `position: fixed`, `role="dialog"`, `aria-modal`, cierre con botón y con `Escape`, click en el fondo, y bloqueo de scroll del body) y se reutiliza en todos los modales de contenido/listado. Alternativa descartada: portales con `react-dom` (no se usan hoy; el patrón actual de overlays fijos es suficiente).

### D2. Listados reutilizables entre página y modal
Se extrae el cuerpo de `NewsListPage`/`PodcastsListPage`/`VideocastsListPage` a componentes `NewsList`/`PodcastsList`/`VideocastsList` que reciben `page`, `onPageChange` y `onSelect`. Las páginas conservan `usePageParam` (URL); el modal usa estado local de página, para no alterar la ruta. `usePaginatedList` se reutiliza tal cual.

### D3. Modales de detalle por tipo
- Noticias: se reutiliza `NewsModal` (ya existe) como modal de contenido.
- Podcasts: nuevo modal de detalle con metadatos, `ShareModal`/`ShareButton` y reproductor `<audio controls>` si hay `audioUrl`.
- Videocasts: modal de detalle con reproductor de video (reutiliza `videoEmbedUrl`/`isDirectMediaFile`) cuando hay `videoUrl`; si no, muestra la ficha.
- Se eliminan los enlaces in-app a las páginas ("Ver noticia completa", "Ver ficha"); las rutas siguen existiendo para URL directa.

### D4. Flujo listado → detalle
Al seleccionar un ítem en el modal de listado, se cierra el listado y se abre el modal de detalle correspondiente (evita overlays anidados). El botón "Ver todas/todos" se reemplaza por un botón que abre el modal de listado.

### D5. Accesibilidad y respaldo
El modal cierra con `Escape` y devuelve el foco al disparador. Como las rutas siguen registradas en `App.tsx`, los deep links y la recarga siguen funcionando; el modal es solo la vía de navegación desde el home.

## Risks / Trade-offs

- [Foco/scroll del modal en móvil] → `ContentModal` bloquea el scroll del body y maneja `Escape`; se prueban cierres y foco.
- [Duplicar lógica entre página y modal] → extraer los listados a componentes compartidos (D2).
- [Datos de detalle incompletos en el home] → los modales de noticia ya consultan por slug; podcasts/videocasts usan el ítem del home y, si hace falta, el detalle por id.
- [Tests existentes de listados/páginas] → se mantienen las páginas; se agregan tests de modal.
