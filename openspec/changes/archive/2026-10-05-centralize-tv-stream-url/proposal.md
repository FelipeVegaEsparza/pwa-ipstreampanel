# Proposal: centralize-tv-stream-url

## Why

El panel dejó de exponer el AutoDJ en `/live/<key>.m3u8` y ahora entrega una URL
estable en `basicData.videoStreamingUrl` (`/tv/<streamKey>.m3u8`) que redirige
sola a DJ (`/dj/...`) o AutoDJ (`/vod/...`). La PWA consume ese campo, pero cada
reproductor de TV lo deriva por su cuenta: hoy la regla "usa la URL estable" se
repite en 11 lugares, así que la fuente correcta depende de que cada template la
vuelva a escribir igual. Centralizarla garantiza que **todos los players** usen
siempre la URL estable y que ninguno construya rutas de stream a mano.

## What Changes

- Nueva función pura `getTvStreamUrl(basicData)` en `src/core/service` como
  única fuente de la URL de TV en vivo (trim + `null`).
- Los 11 puntos que hoy derivan `videoStreamingUrl` (`TvSection` + 10 templates)
  pasan a usar el helper.
- Se corrige el fixture `src/templates/templates.render.test.tsx` que todavía usa
  la ruta vieja `/live/tv.m3u8`.
- Se agrega test unitario del helper.

## Capabilities

### New Capabilities

<!-- Ninguna. -->

### Modified Capabilities

- `content-sections`: la TV en vivo SHALL resolver su fuente desde
  `basicData.videoStreamingUrl` como única fuente y SHALL NO construir rutas
  `/live`, `/dj` ni `/vod`.
- `templates`: los reproductores de TV de los templates SHALL usar la misma
  resolución central de la fuente de TV.

## Impact

- Código: `src/core/service/index.ts` (helper), `src/modules/content/TvSection.tsx`,
  `src/templates/*` (10 templates) y sus tests.
- API: sin cambios; se sigue consumiendo `videoStreamingUrl`, documentado en
  `docs/instruccionesapi.md`.
- No afecta al reproductor de radio (`/streaming/status`) ni al HLS de videocasts
  (`video.videoUrl`), que son fuentes distintas.
