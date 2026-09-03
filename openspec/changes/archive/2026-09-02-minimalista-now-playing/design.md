## Context

El template `minimalista` es un componente React propio (no usa `TemplateShell`). Ya dispone de `useStreaming` (30s), `usePlayer`, `useMediaSession`, `SmartImage`, `NextTrack` y `TrackProgress`. Para el rediseño se extrae el HLS a un hook reutilizable y se agregan piezas de TV-modal y compartir: ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Home de `minimalista` = reproductor now-playing (sin secciones de contenido).
- Fondo dinámico = portada del tema (desenfocado + overlay), full-screen adaptable.
- Acciones: logo + redes + "Señal de TV" (modal HLS) + compartir + instalar.

**Non-Goals:**
- Rediseñar los otros templates (se mantienen con contenido).
- OneSignal/push, VU meter con Web Audio (posible fase posterior).

## Decisions

### D1. Fondo dinámico con crossfade
Se renderiza la portada del tema como fondo (`<img>` con `object-fit: cover` + `filter: blur`) bajo un overlay oscuro. Al cambiar la portada se usa un crossfade (imagen previa que se desvanece) para una transición suave.
*Alternativa*: `background-image` sin animación — se descarta por el salto brusco al cambiar de tema.

### D2. Home sin contenido
`minimalista` no renderiza `<Outlet/>` en su home: el layout del template es el reproductor. Las rutas de contenido quedan disponibles en los otros templates.
*Racional*: el cliente quiere un template solo-player para esta estética.

### D3. TV en modal reutilizable
Se extrae `useHlsVideo` a `src/modules/tv/useHlsVideo.ts` (usado por `TvSection` y por el modal del template). El botón "Señal de TV" solo aparece si `videoStreamingUrl` existe.
*Racional*: centralizar la lógica HLS y reutilizarla.

### D4. Compartir con fallback
`ShareButton`: usa `navigator.share({ title, url })` si está disponible; si no, copia la URL al portapapeles y muestra un estado "Enlace copiado". Se integra en el header del template.

## Risks / Trade-offs

- [Fondo muy cargado en pantallas pequeñas] → El overlay oscuro garantiza contraste; el layout usa flex centrado y permite scroll.
- [Share API no disponible (desktop)] → Fallback a copiar el enlace.
- [Portada de tema ausente] → El fondo usa la portada/logo de la radio como fallback; si no hay ninguno, overlay oscuro plano.

## Migration Plan

1. Extraer `useHlsVideo` y crear el botón/modal de TV y `ShareButton`.
2. Reescribir `MinimalistaTemplate` (now-playing + fondo dinámico) y su CSS.
3. Verificar: `npm run typecheck`, `npm run test`, `npm run build:client`, smoke en navegador (fondo cambia, next track, tv modal, share).
