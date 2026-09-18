## Why

La sección de pronóstico del clima se titula genéricamente "Clima", por lo que no indica a qué ciudad corresponde el pronóstico. Además, si el cliente tiene coordenadas pero no tiene ciudad configurada, la sección puede mostrarse con un pronóstico sin nombre de lugar, lo que resulta confuso en un producto multi-tenant donde cada radio corresponde a una ciudad distinta.

## What Changes

- El título de la sección de pronóstico pasa de "Clima" a **"Proyección del clima en {ciudad}"**, usando el nombre de la ciudad configurada en `basicData.location`.
- La sección de pronóstico SHALL ocultarse cuando el cliente no tenga una ciudad configurada, aunque tenga coordenadas.
- El cambio aplica solo al encabezado de la sección de pronóstico del stack de contenido (presente en todos los templates). No cambia las etiquetas de navegación (`SECTION_LABELS.weather`) ni el bloque de clima actual de las cabeceras.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `content-sections`: la sección de pronóstico del clima cambia su título para incluir la ciudad configurada y su visibilidad pasa a requerir ciudad además de coordenadas.

## Impact

- Código: `src/modules/weather/WeatherForecastSection.tsx` (título dinámico), `src/modules/content/sections.ts` (`sectionHasContent` de `weather`).
- Tests: `src/modules/content/ContentSections.test.tsx`, tests del módulo weather.
- Docs: `docs/clima.md` (nombre de la sección).
- Sin cambios de API, dependencias ni endpoints.
