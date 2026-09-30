# Design: add-moderno2-template

## Context

Ver `proposal.md - Why`. El proyecto registra templates en
`src/templates/index.tsx` y los selecciona por `selectedTemplate`. Cada template
renderiza un `<Outlet/>` alimentado por `ContentSectionStack`
(`src/modules/content/ContentSections.tsx`), que ordena secciones data-driven
según `getSectionOrder(template)` y las oculta con `sectionHasContent`. El
encabezado de cada sección lo produce el componente compartido `Section`
(`src/ui/Section.tsx`), estilable por variables CSS.

Los datos del tema en vivo se obtienen con `useStreaming` (polling cada 30 s) y
`useLiveRadio`; el clima con `useWeather`/`useWeatherForecast` (Open-Meteo,
coordenadas de `basicData.location`). Las fuentes del build se precachean con
Workbox y `vite-plugin-pwa` ya incluye `woff2` en `globPatterns`.

## Goals / Non-Goals

**Goals:**

- Integrar `moderno2` con el mínimo código nuevo, reutilizando shell,
  reproductor, secciones y módulos existentes.
- Clima multi-ciudad con la ciudad del panel como tarjeta principal.
- Historial de canciones sin depender de endpoints inexistentes.
- Fuentes y efectos de titular fieles al diseño original, sin CDN externo.

**Non-Goals:**

- No se replica el chat ni la sección "Emisoras" (ver proposal).
- No se modifica el comportamiento por defecto de los templates existentes.
- No se introducen endpoints ni campos nuevos de la API.

## Decisions

### 1. `moderno2` como template registrado que reutiliza el shell

Se agrega `src/templates/moderno2/` y se registra en `src/templates/index.tsx`,
reutilizando `<Outlet/>` + `ContentSectionStack` y el player persistente.

- Alternativa descartada: página standalone que duplique las secciones. Duplica
  lógica de datos y contradice el shell compartido.

### 2. Orden de secciones y encabezado "display"

Se agrega `MODERNO2_ORDER` en `src/modules/content/sections.ts` (noticias,
programas, TV, videos, locutores, auspiciadores/promociones, redes, clima) y se
extiende `Section` de forma opt-in con `data-bg-text` y un título que admite
fragmento resaltado. `ContentSections` activa esa variante cuando
`selectedTemplate === 'moderno2'`, siguiendo el patrón de variantes ya usado
(`NEWS_VARIANTS`, `PROGRAM_VARIANTS`).

- El efecto `attr(data-bg-text)` requiere el atributo en el DOM; no es posible
  sólo con CSS. Se emite de forma opt-in para no alterar otros templates.
- El color del texto de fondo usa `--section-bg-text-color` (corrige el
  `#CCC` hardcodeado del original).

### 3. Clima multi-ciudad reutilizando `useWeather`

Nuevo `MultiCityWeather` en `src/modules/weather/`:
- tarjeta principal: `basicData.location` (ciudad del panel);
- grilla: 9 ciudades fijas (Valparaíso, Concepción, Antofagasta, La Serena,
  Temuco, Puerto Montt, Punta Arenas, Iquique, Arica) pasadas como objetos
  compatibles con `BasicLocation`.

Cada tarjeta usa `useWeather` de forma independiente, de modo que un fallo se
aísla por tarjeta. Se añade refresco periódico (≈10 min) y al volver visible.

- Alternativa descartada: una sola llamada Open-Meteo con coordenadas múltiples.
  Menos requests, pero complica el parseo y el aislamiento de errores por ciudad.

### 4. Historial de canciones en el cliente

Store basado en `localStorage` (clave por `clientId`), alimentado por los
cambios de `currentTrack` que ya observa `useStreaming`. Deduplica por clave de
tema (portada o título+artista) y acota la lista a un máximo de entradas.

El historial se renderiza en la composición del propio template (no en
`ContentSectionStack`), porque su fuente es local y no un recurso de la API; se
muestra sólo cuando hay entradas.

- Alternativa descartada: endpoint de historial. No existe en la API pública.

### 5. Fuentes self-hosted

Los `.woff2` (Bebas Neue + Montserrat) se agregan a `public/fonts/` y se
declaran con `@font-face` en un CSS global del template. `vite-plugin-pwa` ya
precachea `woff2`, por lo que funcionan offline sin cambios en `sw.ts`.

- Alternativa descartada: Google Fonts CDN. Rompe offline y agrega dependencia
  externa.
- Se usan subconjuntos latinos para no engordar el bundle.

### 6. Hero y navegación

El hero reutiliza `useLiveRadio`, `SmartImage` y el control del `PlayerContext`.
La navegación son anclas a `sectionAnchorId` con drawer en móvil (mismo patrón
que `PlaylistTemplate`). El contenido se envuelve en el contenedor de ancho
`--container-width` (1200px) y la paleta se define con variables CSS del
template (naranja `#ff6b00`/`#ff9500` sobre oscuro).

## Risks / Trade-offs

- [Historial limitado a lo visto por ese navegador] → Se acota por spec y se
  etiqueta la sección como historial local; no se presenta como global de la
  radio.
- [Hasta 10 requests a Open-Meteo por usuario] → Refresco espaciado (~10 min) y
  sólo con la vista visible; si molesta, migrar a llamada batched.
- [`useWeather` no refresca periódicamente hoy] → Envolver/ajustar con intervalo
  en `MultiCityWeather`, sin tocar el comportamiento de los usos actuales.
- [Encabezado display podría "filtrarse" a otros templates] → Variante opt-in
  por `selectedTemplate` y selectores acotados al contenedor del template.
- [Fuentes self-hosted aumentan el peso del build] → woff2 subset latino y sólo
  las dos familias usadas.
- [Streaming no debe quedar obsoleto] → Se mantiene `NetworkOnly` para
  `/streaming`; el historial se alimenta del estado fresco, no de caché.

## Migration Plan

- Cambio aditivo: `DEFAULT_TEMPLATE_ID` sigue siendo `minimalista`; `moderno2`
  se activa por `selectedTemplate` desde el panel, sin reconstruir el cliente.
- Rollback: quitar el id del registro devuelve el fallback al template por
  defecto.
- Sin migración de datos; el `localStorage` del historial es prescindible.

## Open Questions

- ¿El historial debe aparecer también como ítem del menú de navegación o sólo
  como sección? (No cambia specs ni tareas.)
