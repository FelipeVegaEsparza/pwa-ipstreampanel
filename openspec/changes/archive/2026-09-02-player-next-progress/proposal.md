## Why

El endpoint `/streaming` entrega `nextTrack` (título, artista, portada, duración) y la `duration` del `currentTrack` en segundos, pero el reproductor actual solo muestra el tema en curso. Para mejorar la experiencia se muestra el siguiente tema y una barra de avance con el tiempo transcurrido/duración del tema actual.

## What Changes

- **Siguiente tema**: se muestra `nextTrack` (portada pequeña, título y artista) en los reproductores (hero de los templates y player bar).
- **Barra de avance**: barra de progreso del tema actual con etiquetas de tiempo (`mm:ss` / `mm:ss`), calculada localmente: se ancla el inicio cuando se detecta un cambio de tema (clave = portada o `título|artista`) y avanza mientras el reproductor está en reproducción. La duración viene de `currentTrack.duration` (segundos).

## Capabilities

### New Capabilities

- `player-progress`: Muestra el siguiente tema en reproducción y una barra de avance con el tiempo del tema actual, anclada al cambio de tema y pausada cuando el reproductor está en pausa.

### Modified Capabilities

- Ninguna; se consumen capacidades existentes (`api-client`, `templates`, `player-metadata`).

## Impact

- **Nuevo código**: `src/modules/player/useTrackProgress.ts` (hook de avance), `src/modules/player/TrackProgress.tsx` (barra + tiempos), `src/modules/player/NextTrack.tsx` (siguiente tema).
- **Modificado**: `RadioPlayerHero`, los templates `minimalista`/`moderna` y `PlayerBar` para integrar next-track y barra de avance.
- **API**: sin cambios (usa `streaming.currentTrack`, `streaming.nextTrack`, `streaming.currentTrack.duration`).
- **Dependencias**: ninguna.
- **No afecta**: resto de la app ni el modelo de despliegue.
