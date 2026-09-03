## Why

El template `covered` hoy usa el shell genérico (hero + contenido igual a otros templates). Se quiere un diseño propio inspirado en magicafm.cl: un gran hero de reproductor con portada y estado "reproduciendo ahora", y debajo **todo el contenido de los endpoints** disponibles (noticias, programas, galerías, podcasts, videocasts, videos, encuestas, eventos, auspiciadores, locutores, promociones, redes y TV) ya provistos por las secciones data-driven.

## What Changes

- **Rediseño del template `covered`**: componente propio con header (logo, fecha, EN VIVO, redes, instalar), hero de reproductor (portada grande, ON AIR, título/artista/álbum, play, compartir, oyentes/bitrate, barra de avance y siguiente tema), fondo dinámico con la portada.
- **Contenido completo**: bajo el hero, `covered` renderiza el `Outlet` (home = `ContentSections` que ya muestra todos los endpoints; rutas de detalle también).
- Tema claro de contenido con acento de marca; adaptativo (2 columnas en grande, apilado en móvil).

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `templates`: el template `covered` pasa a un diseño hero + contenido completo estilo magicafm.

## Impact

- **Modificado**: `src/templates/covered/CoveredTemplate.tsx` y su CSS.
- **Reutiliza**: `useStreaming`, `usePlayer`, `useTrackProgress`, `NextTrack`, `SmartImage`, `ShareButton`, `BrandIcon`/`getSocialLinks`, `InstallPrompt`, `Outlet`/`ContentSections`.
- **API**: sin cambios (todas las secciones usan los endpoints ya consumidos).
- **No afecta**: los demás templates.
