## Why

El template `minimalista` hoy es un sitio con header/hero/contenido completo. Se quiere rediseñar como un **reproductor "now playing"** al estilo de radios tipo radiotuya.cl: centrado en el streaming (tema actual + siguiente), con fondo dinámico que usa la portada del tema, y que solo muestre radio, TV, redes sociales y un botón de compartir (sin las secciones de contenido en la home).

## What Changes

- **Rediseño del template `minimalista`**: pantalla completa tipo reproductor (cover centrada, título/artista, EN VIVO + oyentes, barra de avance, play/pausa, siguiente tema).
- **Fondo dinámico**: usa la portada del tema actual como fondo (desenfocado con overlay), cambiando junto al tema; adaptable a todas las pantallas.
- **Solo radio / TV / redes / compartir**: el template no muestra las secciones de contenido en su home; el header ofrece logo, redes sociales, botón "Señal de TV" (solo si `videoStreamingUrl` existe) y botón de compartir.
- **TV en modal**: el botón "Señal de TV" abre un modal con la reproducción HLS.
- **Compartir**: botón que comparte/copia el enlace del sitio (Web Share API con fallback de copia).

## Capabilities

### New Capabilities

- Ninguna nueva.

### Modified Capabilities

- `templates`: el template `minimalista` cambia su comportamiento de renderizado a un reproductor now-playing (home sin secciones de contenido).

## Impact

- **Modificado**: `src/templates/minimalista/MinimalistaTemplate.tsx` y su CSS.
- **Nuevo (reutilizable)**: extracción del hook `useHlsVideo` a `src/modules/tv/`, componente de TV en modal y botón de compartir (Web Share + copia) en `src/modules/`.
- **API**: sin cambios (usa `basicData`, `socialNetworks`, `videoStreamingUrl`, `/streaming`).
- **No afecta**: los demás templates ni el resto de la app.
