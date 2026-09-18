## Why

Hoy solo se muestra el clima actual (temperatura y condición) de la ciudad de la radio. Se quiere una sección con el pronóstico de varios días para esa misma ciudad configurada, que aparezca en el stack de contenido de todos los templates y se oculte si no hay ubicación.

## What Changes

- **Hook de pronóstico**: `useWeatherForecast(location)` consulta Open-Meteo (`daily=weather_code,temperature_2m_max,temperature_2m_min`, `timezone=auto`) con la lat/lon de `basicData.location`, con timeout y reintento al volver online/visible, y unidad °C/°F por país.
- **Componente `WeatherForecast`**: tira de días con nombre del día, icono, máxima y mínima, con scroll horizontal en móvil.
- **Nueva sección de contenido `weather`**: se agrega a `sections.ts` (id, label "Clima", orden por template y `sectionHasContent` según coordenadas) y se renderiza en el stack como `<WeatherForecastSection>`.
- **Degradación**: sin coordenadas o si falla la red, la sección no se muestra.
- **Tests**: parseo del pronóstico, render de la tira y ocultado sin ubicación.

Fuera de alcance: pronóstico por hora, geocoding (la ciudad viene en `location`) y cambios al proveedor.

## Capabilities

### New Capabilities

- (ninguna)

### Modified Capabilities

- `weather`: se agrega el pronóstico diario de varios días para la ciudad configurada.
- `content-sections`: se agrega la sección "Clima" (pronóstico) al stack, visible solo si hay ubicación.

## Impact

- **Nuevo código**: `useWeatherForecast` en `src/modules/weather/`, `WeatherForecast` y `WeatherForecastSection` (+ CSS/tests).
- **Modificado**: `src/modules/content/sections.ts`, `src/modules/content/ContentSections.tsx`.
- **Sin cambios**: contrato del API del panel, manifest, service worker.
- **Multi-tenant**: usa la `location` del `clientId` del build; no hay estado compartido entre tenants.
