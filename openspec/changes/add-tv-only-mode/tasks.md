# Tasks

## 1. Detección de servicio y gating de hooks

- [ ] 1.1 Implementar `deriveServiceMode(basicData)` en `src/core` y el hook `useServiceMode(clientData)` (`radio` / `tv` / `both`, con `services` como pista y fallback a `radio`); verificar con tests unitarios (radio, tv, both, sin URLs, `services` desconocido).
- [ ] 1.2 Agregar la opción `enabled` a `useStreaming` y propagarla a `useLiveRadio` para no consultar `/streaming` en modo `tv`; verificar con tests de los hooks.

## 2. Reproductor de TV reutilizable

- [ ] 2.1 Extraer `TvPlayer` (video + `useHlsVideo` + error con "Reintentar") desde `TvSection` y el modal de `minimalista`, y hacer que `TvSection` lo use; verificar con el test de `TvSection`.

## 3. Adaptación de templates

- [ ] 3.1 En `minimalista` (default), en modo `tv` mostrar el video inline en el área central y ocultar la UI de radio (artwork, next track, play, VU); verificar con test de render en modo `tv` y en modo `radio`.
- [ ] 3.2 En `covered` y `playlist`, en modo `tv` reemplazar su hero/deck por el video inline; verificar con tests de render.
- [ ] 3.3 En los templates con `PlayerBar` (`app`, `blue`, `moderna`, `moderno`, `tradicional`, `petroleo`, `moderno2`), en modo `tv` mostrar el video inline y no montar `PlayerBar`; verificar con tests de render (o el test de render de templates).
- [ ] 3.4 Ajustar los fixtures de tests que quedaron en modo `tv` sin buscarlo (p. ej. `ContentSections.test`), agregando `radioStreamingUrl` donde se espera `both`, y agregar casos explícitos de `tv`; verificar con `npm run test`.

## 4. Stack de secciones y verificación

- [ ] 4.1 En `ContentSectionStack`, omitir la sección `tv` cuando el modo es `tv` (para no duplicar el video principal); verificar con test de `ContentSections`.
- [ ] 4.2 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`; verificar que pasan.
- [ ] 4.3 Validar el cambio con `openspec validate add-tv-only-mode` sin issues.
