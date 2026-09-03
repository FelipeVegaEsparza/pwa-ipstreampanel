## 1. Piezas reutilizables

- [x] 1.1 Extraer `useHlsVideo` a `src/modules/tv/useHlsVideo.ts` y refactorizar `TvSection` para usarlo; verificar con `npm run typecheck`
- [x] 1.2 Crear `ShareButton` (Web Share API con fallback a copiar enlace + estado "copiado"); verificar con tests de vitest

## 2. Rediseño del template minimalista

- [x] 2.1 Reescribir `MinimalistaTemplate` como reproductor now-playing: fondo dinámico con crossfade de la portada del tema, portada central, título/artista, EN VIVO + oyentes, barra de avance, play/pausa y siguiente tema; sin secciones de contenido en la home
- [x] 2.2 Header con logo, redes sociales (solo las configuradas), botón "Señal de TV" (solo si `videoStreamingUrl`), botón compartir e instalación; verificar responsive (desktop y móvil)
- [x] 2.3 Modal de TV (usa `useHlsVideo`) abierto por "Señal de TV", con cierre; verificar con `npm run typecheck`
- [x] 2.4 CSS del template adaptable a todas las pantallas (full viewport, centrado, overlay de contraste)

## 3. Verificación de integración

- [x] 3.1 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build:client -- fusionaustral` y confirmar que pasan
- [x] 3.2 Smoke en navegador (template minimalista): fondo dinámico con la portada, tema actual y siguiente visibles, botón "Señal de TV" abre el modal (o no aparece sin video), compartir funciona, redes visibles, y la home no muestra secciones de contenido
