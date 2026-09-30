# Proposal: add-moderno2-template

## Why

El catálogo de templates no incluye un diseño de "portal de radio" completo con
hero de reproductor, navegación por secciones, titulares con palabra gigante de
fondo y una vista de clima multi-ciudad. Los usuarios piden un template que
replique el diseño de `radioladeliciosa.cl`, pero construido sobre los endpoints
del panel IPStream (multi-tenant, datos dinámicos, degradación ante `null`).

**Objetivos**

- Agregar un template seleccionable `moderno2` con el diseño tipo
  radioladeliciosa: hero now-playing, navegación, secciones con titulares
  `data-bg-text`, player fijo y clima.
- Mostrar el clima de varias ciudades: la tarjeta principal con la ciudad que
  expone la API del panel y una grilla con las 9 ciudades originales fijas.
- Mostrar un historial de canciones construido en el cliente a partir del
  polling de `/streaming`.
- Servir las tipografías del diseño (Bebas Neue, Montserrat) self-hosted para
  no romper la experiencia offline de la PWA.

**No objetivos**

- No se agrega chat (se excluye explícitamente por ahora).
- No se agrega la sección "Emisoras" del sitio original (single-tenant).
- No se inventan endpoints ni campos de API: el historial se arma en cliente.
- No se modifica el comportamiento de los templates existentes.

## What Changes

- Se registra el template `moderno2` en el registro de templates, seleccionable
  desde `selectedTemplate` del panel, con fallback al template por defecto.
- Se agrega un orden de secciones propio para `moderno2` (noticias, programas,
  TV, videos, locutores, auspiciadores/promociones, redes, clima).
- Se agrega la vista de clima multi-ciudad para `moderno2`: tarjeta principal
  con `basicData.location` (ciudad del panel) y grilla fija con 9 ciudades de
  Chile (Valparaíso, Concepción, Antofagasta, La Serena, Temuco, Puerto Montt,
  Punta Arenas, Iquique, Arica).
- Se agrega un historial de canciones acumulado en `localStorage` a partir de
  los cambios de `currentTrack` observados en el polling de `/streaming`.
- Se incorporan las tipografías self-hosted (Bebas Neue y Montserrat) y los
  efectos de titular del diseño original (`data-bg-text` gigante y
  `.section-name` con `highlight`), reutilizando el shell compartido.

## Capabilities

### New Capabilities

- `song-history`: historial de canciones reproducidas construido y persistido
  en el cliente a partir del estado de streaming, sin endpoint de historial.

### Modified Capabilities

- `templates`: se agrega el template seleccionable `moderno2` con su orden de
  secciones, y se documentan sus tipografías self-hosted y efectos de titular.
- `weather`: se agrega la vista multi-ciudad (principal = ciudad del panel +
  grilla fija de regiones de Chile) usada por `moderno2`.

## Impact

- Código: nuevo `src/templates/moderno2/` (componente + CSS + test), registro en
  `src/templates/index.tsx` y `index.test.tsx`, orden en
  `src/modules/content/sections.ts`, nueva vista de clima en
  `src/modules/weather/`, nuevo módulo de historial, y fuentes en `public/` con
  `@font-face`.
- API: solo endpoints existentes (`/api/public/{clientId}`, `/streaming`,
  `/streaming/status`, `/gc-bar`, `/news`, `/programs`, `/videos`,
  `/announcers`, `/sponsors`, `/promotions`, `/social-networks`).
- PWA: se agregan assets de fuente al build; se mantiene la estrategia de caché
  para no dejar obsoletos los datos dinámicos de streaming.
- Specs: `templates` y `weather` (modificadas), `song-history` (nueva).
