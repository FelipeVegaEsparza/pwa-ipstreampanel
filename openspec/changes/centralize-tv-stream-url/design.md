# Design: centralize-tv-stream-url

## Context

Ver `proposal.md - Why`. Hoy la URL de la TV en vivo se deriva con la misma
expresión repetida en 11 puntos:

```
(clientData?.basicData?.videoStreamingUrl ?? '').trim() || null
```

`TvSection` y los 10 templates la calculan por separado y la pasan a `TvPlayer`.
`src/core/service/index.ts` ya aloja la detección pura `deriveServiceMode`, por lo
que es el lugar natural para la nueva regla. `useHlsVideo` ya resuelve la
reproducción (hls.js o HLS nativo) y llama a `play()`; el refactor no cambia ese
comportamiento. El HLS de videocasts (`src/modules/videos/HlsVideo.tsx`) usa
`video.videoUrl`, una fuente distinta que no se toca.

## Goals / Non-Goals

**Goals:**

- Una única función pura que resuelva la URL estable de la TV por cliente.
- Que los 11 call sites la usen y ninguno vuelva a derivarla por su cuenta.
- Sin cambios de comportamiento de reproducción ni de API.

**Non-Goals:**

- No agregar detección `dj`/`vod`, manejo de fuera del aire ni EPG.
- No tocar radio (`/streaming/status`) ni el HLS de videocasts.
- No cambiar `useHlsVideo` ni `TvPlayer`.

## Decisions

### 1. Helper puro en `core/service` (no hook)

`getTvStreamUrl(basicData: BasicData | null | undefined): string | null` en
`src/core/service/index.ts`, junto a `deriveServiceMode`. Se elige función pura
sobre hook porque los templates ya tienen `clientData` disponible y no
necesitan estado adicional; es directamente testeable y evita duplicar el
consumo de datos (regla del proyecto). Alternativa descartada: un
`useTvStreamUrl(clientData)` que solo envolvería la misma lógica.

### 2. Fuente única = `videoStreamingUrl`

La función solo hace `trim()` y devuelve `null` cuando el valor está vacío. No
construye `/live`, `/dj`, `/vod` ni altera la URL: el redirect del panel decide
la señal al aire. Esto conserva la regla multi-tenant de degradar ante `null`.

### 3. Separación de capas

Datos (`basicData`) → regla pura (`core/service`) → presentación (`TvSection` y
templates). La UI no reimplementa la resolución ni conoce el formato del stream.

### 4. Fuera de alcance explícito

`src/modules/videos/HlsVideo.tsx` sigue tomando `video.videoUrl`: es contenido
VOD, no la señal de TV en vivo.

## Risks / Trade-offs

- [Algún template podría seguir derivando la URL] → se reemplazan los 11 sitios
  y se cubre con el helper testeado.
- [Fixture con la ruta vieja] → `templates.render.test.tsx` usa `/live/tv.m3u8`;
  se actualiza para no arrastrar la ruta obsoleta.
- [Refactor sin cambio visible] → riesgo bajo; si algo falla, el rollback es
  volver a la expresión inline.

## Migration Plan

- Cambio aditivo y localizado; no requiere API, datos ni despliegue especial.
- Rollback: revertir el commit del refactor.
