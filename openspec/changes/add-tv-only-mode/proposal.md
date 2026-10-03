# Proposal: add-tv-only-mode

## Why

Un cliente que solo ofrece TV (por ejemplo `meptv`: `videoStreamingUrl` presente
y `radioStreamingUrl` en `null`) cae en el template por defecto y muestra igual
el reproductor de radio deshabilitado ("Fuera del aire", botón play muerto),
mientras la TV queda escondida tras un botón o dentro del stack de secciones. El
sitio se ve roto para radios/TV que solo emiten video.

**Objetivos**

- Detectar el modo de servicio del cliente: `radio`, `tv` o `both`.
- Cuando es **solo TV**: mostrar el reproductor de video **inline como contenido
  principal** y ocultar **toda** la UI relacionada con radio (hero now-playing,
  PlayerBar, VU meter, next track, progreso, estado/oyentes, Media Session y el
  polling a `/streaming`).
- Mantener sin cambios el comportamiento de `radio` y de `radio + tv`.

**No objetivos**

- No se agrega ni cambia ningún endpoint ni campo de la API: se infiere por
  `radioStreamingUrl` / `videoStreamingUrl` (documentados) y, opcionalmente,
  `services` como pista.
- No se rediseña el modo radio ni el modo both.
- No se introducen nuevos templates: se adaptan los existentes por modo.

## What Changes

- Se agrega la capacidad `service-mode`: un modo derivado de los datos del
  cliente y la regla "solo TV = video inline + sin UI de radio".
- Los templates pasan a adaptar su layout según el modo: en `tv` reemplazan su
  hero/deck de radio por el video y no montan el reproductor de radio.
- El polling de streaming y la Media Session no se activan en modo `tv`.
- El stack de secciones no duplica la TV cuando ya se muestra como contenido
  principal en modo `tv`.

## Capabilities

### New Capabilities

- `service-mode`: detección del modo de servicio (`radio` / `tv` / `both`) y
  reglas de presentación para el modo solo TV.

### Modified Capabilities

- `templates`: los templates adaptan su layout según el modo de servicio
  (ocultan la UI de radio y muestran el video inline en modo `tv`).
- `player-metadata`: el polling de streaming y la Media Session se omiten en
  modo `tv` (no hay radio).
- `content-sections`: la sección de TV no se duplica cuando el video ya es el
  contenido principal en modo `tv`.

## Impact

- Código: `src/templates/*` (layout por modo), `src/modules/tv` (video inline
  reutilizable), `src/modules/player/useLiveRadio.ts` y
  `src/core/hooks/useStreaming.ts` (gating), `src/modules/content/ContentSections.tsx`
  (evitar duplicado de TV), y un hook de detección.
- API: sin cambios; se consumen `radioStreamingUrl` / `videoStreamingUrl` ya
  documentados (`services` solo como pista opcional).
- Specs: `service-mode` (nueva) y `templates`, `player-metadata`,
  `content-sections` (modificadas).
