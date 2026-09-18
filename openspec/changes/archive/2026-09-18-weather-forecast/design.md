## Context

Ver `proposal.md` - Why. Estado actual relevante:

- `useWeather` consulta Open-Meteo con `current_weather=true` y valida lat/lon (`latValue`/`lonValue`), con timeout, reintento al volver online/visible y unidad por país.
- `weatherIcon`/`weatherLabel` traducen el código WMO.
- El stack de contenido (`sections.ts` + `ContentSections.tsx`) renderiza secciones data-driven con orden por template y las oculta si no hay datos.

## Goals / Non-Goals

**Goals:**

- Pronóstico de varios días con la misma ubicación y unidades del clima actual.
- Sección integrada al stack, ordenable por template y oculta sin ubicación.
- Sin API key ni geocoding.

**Non-Goals:**

- Pronóstico por hora.
- Cambiar el proveedor o el clima actual.

## Decisions

### D1. Open-Meteo daily con `timezone=auto`

Se usa el endpoint de pronóstico con `daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`. Alternativa: `current_weather` (no trae días). `timezone=auto` alinea los días a la zona de la ciudad. Se leen `weather_code` o `weathercode` por compatibilidad.

### D2. Reutilizar la validación de coordenadas

Se exportan `latValue`/`lonValue` desde `useWeather` y los usa `useWeatherForecast`, evitando duplicar reglas de coordenadas.

### D3. Nueva sección `weather` en `sections.ts`

Se agrega el id `weather` con label "Clima" a `SectionId`/`SECTION_LABELS`, el caso en `sectionHasContent` (según coordenadas) y la posición en los órdenes (`DEFAULT`, `MODERNO`, `PETROLEO`, `PLAYLIST`, `BLUE`; en `covered` cae tras el bloque editorial). Se renderiza en `sectionFor` con `<WeatherForecastSection>`.

### D4. Degradación

`WeatherForecastSection` devuelve `null` si no hay coordenadas; mientras carga muestra el skeleton de `Section`; si la consulta falla, no hay días y la sección se oculta.

### D5. Presentación

`WeatherForecast` muestra una tira horizontal (scroll en móvil) con el nombre del día (el primero "Hoy"), icono, máxima y mínima. El label del día se calcula con `Intl.DateTimeFormat('es-CL', { weekday: 'short' })`.

## Risks / Trade-offs

- [Consultas extra al proveedor por cada sección] → Una sola consulta por render; sin coordenadas no consulta.
- [La tira de 7 días puede desbordar en móvil] → `overflow-x: auto` con scroll horizontal.
- [El nombre de la variable diaria cambió entre versiones de Open-Meteo] → Se leen ambas (`weather_code`/`weathercode`).
