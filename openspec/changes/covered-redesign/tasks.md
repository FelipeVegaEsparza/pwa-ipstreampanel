## 1. Template covered

- [x] 1.1 Reescribir `CoveredTemplate` como componente propio: header (logo, fecha, EN VIVO, redes con íconos, instalar) y hero de reproductor (portada, ON AIR, título/artista/álbum, play, compartir, oyentes/bitrate, barra fina de avance, siguiente tema), con fondo dinámico de la portada; renderiza `<Outlet/>` bajo el hero
- [x] 1.2 CSS propio (`covered`) con tema claro de contenido + acento, hero adaptativo (desktop/móvil)

## 2. Verificación

- [x] 2.1 Ejecutar `npm run typecheck`, `npm run test` y `npm run build:client -- fusionaustral` y confirmar que pasan
- [x] 2.2 Smoke en navegador (template covered): hero muestra el reproductor y bajo él se ven las secciones de contenido disponibles (data-driven)
