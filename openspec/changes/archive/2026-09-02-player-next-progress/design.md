## Context

El reproductor ya muestra el tema actual (título, artista, portada, oyentes, estado) vía `useStreaming` (polling 30s) y usa `usePlayer` para el audio. El endpoint `/streaming` entrega `currentTrack.duration` (segundos), `nextTrack` y `position`, pero **no** el tiempo transcurrido del tema (`lastUpdate` es el "ahora" del servidor, no el inicio del tema). Por eso el avance se calcula localmente: ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Mostrar `nextTrack` (portada, título, artista) en los reproductores.
- Barra de avance con `mm:ss` transcurrido / duración, anclada al cambio de tema y pausada al pausar.

**Non-Goals:**
- Sincronización exacta del avance con el servidor (la API no expone elapsed; el avance se estima localmente desde que se detecta el cambio de tema).
- Control de seek (radio en vivo; no se busca dentro del tema).

## Decisions

### D1. `useTrackProgress` anclado al cambio de tema
Hook que recibe `duration` (segundos), `trackKey` (portada o `título|artista`) e `isPlaying`. Reinicia `startRef = Date.now()` cuando cambia `trackKey`; un `setInterval` de 1s (activo solo si `isPlaying`) actualiza `elapsed`. Devuelve `{ progress, current, duration }` (en segundos). El avance se reinicia al cargar la app a mitad de un tema (limitación aceptable de radio en vivo).
*Alternativa*: usar `lastUpdate` como inicio — descartada porque el servidor la actualiza en cada consulta, no al cambiar el tema.

### D2. Componentes `TrackProgress` y `NextTrack`
- `TrackProgress`: barra (`width = progress%`) + etiquetas `mm:ss actual / mm:ss duración`; se oculta si no hay duración.
- `NextTrack`: fila con miniatura (via `SmartImage` con fallback), título y artista; se oculta si `nextTrack` es `null`.
Ambos estilizados con variables `--tpl-*` para adaptarse a cada template.

### D3. Integración
Se agregan en el hero de los reproductores: `RadioPlayerHero` (7 templates), `minimalista` y `moderna` (hero propio). `TrackProgress` también se agrega a `PlayerBar` (barra fina). El `trackKey` se deriva de `currentTrack.coverUrl ?? título|artista`.

## Risks / Trade-offs

- [Avance no exacto al cargar a mitad de tema] → Se reinicia al detectar el siguiente cambio de tema; aceptable para radio en vivo.
- [Portada del siguiente tema rota o no pública] → `SmartImage` con fallback a la portada/logo de la radio.
- [Muchos renders por segundo] → Solo 1 actualización/segundo con el intervalo, y `setElapsed` con valor numérico.

## Migration Plan

1. Crear `useTrackProgress`, `TrackProgress` y `NextTrack`.
2. Integrar en `RadioPlayerHero`, `minimalista`, `moderna` y `PlayerBar`.
3. Verificar: `npm run typecheck`, `npm run test`, `npm run build:client`, smoke en navegador (next-track visible y barra avanzando).
