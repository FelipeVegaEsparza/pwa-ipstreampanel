## 1. Scaffolding y tooling

- [x] 1.1 Inicializar el proyecto Vite + React + TypeScript en `app-pwa` y verificar que `npm install` y `npm run build` completan sin errores
- [x] 1.2 Agregar dependencias (`react-router-dom`, `@tanstack/react-query`, `vite-plugin-pwa`) y dev deps de testing (`vitest`, `@testing-library/react`, `@testing-library/jest-dom`) y verificar que `npm install` resuelve el árbol de dependencias
- [x] 1.3 Configurar scripts en `package.json` (`dev`, `build`, `preview`, `test`, `lint`, `typecheck`) y verificar que `npm run lint` y `npm run typecheck` pasan sobre el scaffold inicial

## 2. Estructura y configuración base

- [x] 2.1 Crear la estructura `src/` (`app/`, `core/config/`, `core/api/`, `core/types/`, `core/adapters/`, `core/hooks/`, `templates/`, `modules/`, `ui/`) y verificar que el build la incluye
- [x] 2.2 Crear `clients/fusionaustral/client.json` con el cliente de prueba (`cmtezi0ci00014raq8hrhhwfp`) y `.env`/`.env.example` con el clientId por defecto de dev; verificar que ambos son JSON/env válidos
- [x] 2.3 Configurar `vite.config.ts` (plugin react, alias `@` hacia `src`, base `/`) y verificar que `npm run build` compila

## 3. Resolución de tenant (spec `multitenancy`)

- [x] 3.1 Implementar la resolución del `clientId` desde el clientId inyectado en el build (`import.meta.env.VITE_CLIENT_ID`), y verificar con tests de vitest (clientId presente, ausente)
- [x] 3.2 Implementar `TenantProvider`/`useTenant` que expone `{ clientId, name, baseUrl, status }` (`resolving` | `ready` | `notFound`) de forma síncrona, y la pantalla de error para clientes sin configurar; verificar que sin clientId se muestra la pantalla de error sin romper la app
- [x] 3.3 Verificar el aislamiento entre clientes: cada clientId produce su propia base URL sin datos cruzados

## 4. Capa de API (spec `api-client`)

- [x] 4.1 Implementar el cliente HTTP tipado (`core/api/client.ts`) con timeout, retry con backoff exponencial + jitter en errores 5xx/red (sin retry en 4xx) y dedupe de solicitudes en vuelo, y verificar con tests de vitest (5xx se reintenta, 404 no se reintenta)
- [x] 4.2 Implementar la caché en memoria con TTL por recurso particionada por `clientId` (clave `clientId:recurso`) con streaming/chat de TTL mínimo, y verificar con tests de vitest (hit dentro del TTL, expiración, no cruce entre tenants)
- [x] 4.3 Implementar `buildImageUrl` que resuelve rutas relativas `/api/uploads/{clientId}/...` a URLs absolutas y deja las absolutas sin cambios, y verificar con tests de vitest (ambos casos)
- [x] 4.4 Implementar las funciones tipadas de los endpoints GET del contrato (`getBasicData`, `getSocialNetworks`, `getStreaming`, `getStreamingStatus`, `getPrograms`, `getNews`, `getNewsBySlug`, `getVideos`, `getSponsors`, `getGalleries`, `getAnnouncers`, `getEvents`, `getPromotions`, `getPodcasts`, `getPodcastById`, `getVideocasts`, `getVideocastById`, `getPolls`) y `registerPwaInstall`, y verificar con `npm run typecheck` y un smoke manual contra `cmtezi0ci00014raq8hrhhwfp`
- [x] 4.5 Definir los modelos tipados en `core/types` según `instruccionesapi.md` (incluyendo `news.source`, `pagination`, `chat`, encuestas) y los adaptadores en `core/adapters` que normalizan con defaults vacíos ante `null`/arrays vacíos, y verificar que una respuesta vacía/nula no lanza excepciones

## 5. Shell de la aplicación (spec `app-shell`)

- [x] 5.1 Implementar `main.tsx` con `QueryClientProvider` + `TenantProvider` + `PlayerProvider` + router, y verificar que la app arranca en la raíz con el clientId inyectado
- [x] 5.2 Implementar el render del template en la raíz (`TemplateSlot` + `PlayerBar` persistente) con CSS Modules + tokens, y verificar renderizado responsive básico
- [x] 5.3 Implementar `PlayerProvider` (singleton del reproductor de audio) montado por encima de las rutas y persistente, y verificar que el elemento de audio no se desmonta entre renders del template
- [x] 5.4 Crear la pantalla de error (cliente sin configurar / ruta no reconocida) y la pantalla de carga, y verificar que rutas inválidas muestran el error sin ciclo de carga infinito

## 6. PWA (spec `app-shell`)

- [x] 6.1 Configurar `vite-plugin-pwa`: manifest (nombre, íconos, `theme_color`, `display: standalone`), precache del app shell, `network-first` para la API recacheable, `network-only` para `/streaming` y `/chat`, y fallback de navegación a la página offline; verificar que `npm run build` genera el service worker y el manifest
- [x] 6.2 Crear la página offline (`public/offline.html`) y verificar que aparece en modo offline tras cargar la app una vez
- [x] 6.3 Implementar el registro PWA: generar `deviceId` con `crypto.randomUUID`, persistirlo en `localStorage` y enviar `POST /api/public/{clientId}/pwa/register` una sola vez por dispositivo; verificar que la segunda carga no reenvía el POST y que la respuesta `200` se maneja sin error

## 7. Verificación de integración

- [x] 7.1 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build` y confirmar que todos pasan sin errores
- [x] 7.2 Cargar la app en dev/`preview` en `/` y verificar en consola/red: tenant resuelto desde el clientId inyectado, `GET /api/public/{clientId}` responde 200, el template renderiza, la PWA es instalable y el registro `/pwa/register` se envía una sola vez
- [x] 7.3 Verificar la experiencia offline: tras cargar la app, desconectar la red y recargar; el shell debe cargar desde caché y no mostrar datos vivos obsoletos de streaming/chat

## 8. Modelo de despliegue por cliente (Modelo C)

- [x] 8.1 Crear `clients/fusionaustral/client.json` y `scripts/build-client.mjs` que inyecta `VITE_CLIENT_ID`/`VITE_CLIENT_NAME` y genera `dist/<cliente>/`; verificar que `npm run build:client -- fusionaustral` genera el bundle con el clientId
- [x] 8.2 Implementar la resolución por clientId inyectado (`import.meta.env.VITE_CLIENT_ID`) como única fuente del tenant, y verificar con tests de vitest
- [x] 8.3 Crear `.env` (clientId por defecto para `npm run dev`), `.env.example`, el script npm `build:client` y `new-client`; verificar que `npm run dev` en `/` muestra el cliente por defecto y que los tests pasan
- [x] 8.4 Crear `Dockerfile` (build por cliente vía ARG CLIENT) y `nginx.conf` (SPA fallback, caché de assets, no-cache para `/api/`) para deploy independiente en Dockploy; **verificar en la máquina del desarrollador** que `docker build --build-arg CLIENT=fusionaustral` produce una imagen servible (sin Docker disponible en el entorno de desarrollo actual)
- [x] 8.5 Verificar en navegador que el build del cliente abierto en `/` resuelve el clientId inyectado y renderiza la radio

## 9. Sistema de templates (spec `templates`)

- [x] 9.1 Crear el registro `src/templates/` (`getTemplate`/`TemplateSlot`) con los templates `minimalista` y `moderna`, con fallback al default ante ids desconocidos o `null`; verificar con tests de vitest
- [x] 9.2 Implementar `useFullClientData` (lee `selectedTemplate`) y `useStreaming` (polling 30s de `/streaming`), y verificar con `npm run typecheck`
- [x] 9.3 Implementar en los templates el reproductor mínimo: `radioStreamingUrl` como fuente, play/pause conectado a `PlayerProvider` y display de `currentTrack`/`artist`/`listeners`/`status`; verificar con el smoke en navegador (botón habilitado, tema y oyentes visibles)
- [x] 9.4 Configurar el manifest PWA con el nombre del cliente (`VITE_CLIENT_NAME`) y verificar que `dist/<cliente>/manifest.webmanifest` lo refleja
