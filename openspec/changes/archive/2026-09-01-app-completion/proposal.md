## Why

La app ya muestra el contenido de lectura e interactivo de cada radio. Faltan piezas del contrato y de la experiencia PWA para considerarla completa: **redes sociales** y **videos (ranking)** (endpoints del contrato sin UI), **listados paginados** (noticias/podcasts/videocasts con "ver todas"), la **instalación PWA** (botón + `document.title` por cliente) y el **player con MediaSession** (controles y metadata en pantalla de bloqueo).

## What Changes

- **Sección Redes Sociales**: muestra los enlaces sociales del cliente (`GET /social-networks`) cuando al menos una red esté configurada; data-driven como el resto.
- **Sección Videos**: muestra el ranking de videos (`GET /videos`) cuando haya elementos, con reproducción (YouTube/nativo) al hacer clic.
- **Listados paginados**: páginas `/noticias`, `/podcasts` y `/videocasts` con paginación (`page`/`limit`, componente `Pagination`, `normalizePagination`) y enlaces "Ver todas" desde las secciones del home.
- **Instalación PWA**: botón "Instalar" usando `beforeinstallprompt`, y `document.title` con el nombre del cliente.
- **Player con MediaSession**: metadata del tema actual en el lock screen (Media Session API), acciones play/pause/next, y polling ligero del estado vía `/streaming/status` como complemento.

## Capabilities

### New Capabilities

- `social-networks`: Renderiza los enlaces de redes sociales del cliente (data-driven, visible solo si hay al menos una red).
- `videos`: Renderiza el ranking de videos del cliente (data-driven) con reproducción al hacer clic.
- `listings`: Páginas de listado paginado para noticias, podcasts y videocasts con "ver todas" y paginación.
- `pwa-install`: Botón de instalación PWA (beforeinstallprompt) y título del documento por cliente.
- `player-metadata`: Media Session del reproductor (metadata del tema, acciones de control) y polling ligero del estado.

### Modified Capabilities

- Ninguna; se consumen capacidades existentes (`api-client`, `templates`, `app-shell`).

## Impact

- **Nuevo código**: `src/modules/social/`, `src/modules/videos/`, páginas de listado en `src/modules/content/` (o `news/`, `podcasts/`, `videocasts/`), `src/modules/pwa/InstallPrompt.tsx`, mejoras en `src/modules/player/`.
- **API consumida**: `GET /social-networks`, `GET /videos`, `GET /news?page&limit`, `GET /podcasts?page&limit`, `GET /videocasts?page&limit`, `GET /streaming/status`.
- **Dependencias**: ninguna nueva (Media Session API es nativa; YouTube se embebe por iframe).
- **No afecta**: encuestas/chat, modelo de despliegue, templates existentes (solo se integran nuevas secciones).
