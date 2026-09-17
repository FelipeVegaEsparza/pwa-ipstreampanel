## 1. Hook de pronóstico

- [x] 1.1 Exportar `latValue`/`lonValue` desde `src/modules/weather/useWeather.ts` y agregar `useWeatherForecast(location)` con Open-Meteo daily, timeout, reintento online/visible y unidad por país. Verificar con `npm run typecheck`.
- [x] 1.2 Tests de `useWeatherForecast`: parseo de días, sin coordenadas no consulta, y error de red devuelve lista vacía. Verificar con `npm run test`.

## 2. Componente de pronóstico

- [x] 2.1 Crear `src/modules/weather/WeatherForecast.tsx` (+ `.module.css`): tira de días con nombre, icono, máxima y mínima, con `title` de condición y scroll horizontal. Verificar con `npm run typecheck`.
- [x] 2.2 Tests de `WeatherForecast`: renderiza N días con "Hoy" y las temperaturas; sin días no renderiza nada. Verificar con `npm run test`.

## 3. Integración en el stack

- [x] 3.1 Crear `WeatherForecastSection` y agregar el id `weather` a `sections.ts` (label "Clima", `sectionHasContent` por coordenadas, órdenes) y a `sectionFor` en `ContentSections.tsx`. Verificar con `npm run typecheck`.
- [x] 3.2 Ajustar/agregar tests de `ContentSectionStack` para la sección "Clima" (aparece con ubicación y se oculta sin ella). Verificar con `npm run test`.

## 4. Documentación y verificación final

- [x] 4.1 Documentar el pronóstico en `docs/` (fuente, unidades, degradación).
- [x] 4.2 Ejecutar `npm run typecheck && npm run lint && npm run test && npm run build` y confirmar que todo pasa.

## 5. Ubicación en covered

- [x] 5.1 En `getSectionOrder`, para `covered` ubicar la sección `weather` antes de las noticias (primera del orden). Verificar con `npm run test`.
