## 1. Lógica y componentes

- [x] 1.1 Crear `useTrackProgress(duration, trackKey, isPlaying)` que reinicia al cambiar `trackKey`, avanza 1s solo si `isPlaying` y devuelve `{ progress, current, duration }`; verificar con tests de vitest (reset al cambiar clave, avance con reproducción, sin avance en pausa)
- [x] 1.2 Crear `TrackProgress` (barra + `mm:ss / mm:ss`, oculta sin duración) y `NextTrack` (miniatura + título + artista, oculta sin nextTrack); verificar con tests de vitest y `npm run typecheck`

## 2. Integración en reproductores

- [x] 2.1 Integrar `NextTrack` y `TrackProgress` en `RadioPlayerHero` y verificar con `npm run typecheck`
- [x] 2.2 Integrar `NextTrack` y `TrackProgress` en el hero de `minimalista` y `moderna` y verificar con `npm run typecheck`
- [x] 2.3 Agregar `TrackProgress` (barra fina) a `PlayerBar` y verificar con `npm run typecheck`

## 3. Verificación de integración

- [x] 3.1 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build:client -- fusionaustral` y confirmar que pasan
- [x] 3.2 Smoke en navegador: el siguiente tema aparece con portada/título/artista y la barra de avance avanza con tiempos `mm:ss`
