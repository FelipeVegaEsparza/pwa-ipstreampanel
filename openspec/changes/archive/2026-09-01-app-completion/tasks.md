## 1. Redes sociales (spec `social-networks`)

- [x] 1.1 Implementar `SocialNetworksSection` (lee `socialNetworks` de `useFullClientData`, renderiza solo redes con URL como enlaces externos, oculta si no hay ninguna) y verificar con tests de vitest (oculta sin redes; muestra solo las presentes)
- [x] 1.2 Integrar la sección en `ContentSections` y verificar con `npm run typecheck`

## 2. Videos (spec `videos`)

- [x] 2.1 Implementar `VideosSection` (lee `videos` de `useFullClientData`, ordenado por `order`, visible solo con `videoUrl`, modal de reproducción: iframe YouTube o `<video>` nativo) y verificar con tests de vitest (oculta sin videos; abre modal al hacer clic)
- [x] 2.2 Integrar la sección en `ContentSections` y verificar con `npm run typecheck`

## 3. Listados paginados (spec `listings`)

- [x] 3.1 Crear la página `/noticias` con listado paginado (`useNews` + `Pagination` con `normalizePagination`) y verificar navegando entre páginas con datos mockeados
- [x] 3.2 Crear la página `/podcasts` con listado paginado y enlaces a detalle, y verificar con `npm run typecheck`
- [x] 3.3 Crear la página `/videocasts` con listado paginado y enlaces a detalle, y verificar con `npm run typecheck`
- [x] 3.4 Agregar las rutas en `App.tsx` y los enlaces "Ver todas" en las secciones del home cuando haya más de una página; verificar navegando en navegador

## 4. Instalación PWA y título (spec `pwa-install`)

- [x] 4.1 Implementar `InstallPrompt` (escucha `beforeinstallprompt`, `appinstalled` y `display-mode`; botón que llama `prompt()`) e integrarlo en el header de los templates; verificar con tests de vitest (oculto sin evento; visible con evento)
- [x] 4.2 Implementar `useDocumentTitle(clientId)` que fija `document.title` con el `projectName` y llamarlo en `TenantApp`; verificar que el título de la pestaña cambia

## 5. Player avanzado (spec `player-metadata`)

- [x] 5.1 Implementar Media Session en `PlayerContext` (metadata title/artist/artwork + handlers play/pause/next/prev según el tema actual) y verificar con `npm run typecheck`
- [x] 5.2 Agregar `useStreamingStatus` (polling ligero ~15s, sin caché persistente) y usarlo en el player/templates como complemento; verificar con `npm run typecheck`

## 6. Verificación de integración

- [x] 6.1 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build:client -- fusionaustral` y confirmar que pasan
- [x] 6.2 Smoke en navegador: redes sociales y videos aparecen solo con datos; listados paginados navegan; el botón "Instalar" no rompe y `document.title` es el del cliente; el player muestra metadata en Media Session
