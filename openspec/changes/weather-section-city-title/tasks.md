## 1. Título con la ciudad

- [x] 1.1 En `src/modules/weather/WeatherForecastSection.tsx`, derivar `city` desde `clientData.basicData.location` y pasar el título dinámico `Proyección del clima en {city}` al `<Section>`. Verificar con `npm run typecheck`.
- [x] 1.2 Actualizar `src/modules/content/ContentSections.test.tsx` para esperar el nuevo título (p. ej. `Proyección del clima en Santiago`) en los escenarios de clima. Verificar con `npm run test`.

## 2. Visibilidad según ciudad

- [x] 2.1 En `src/modules/content/sections.ts`, actualizar el caso `weather` de `sectionHasContent` para exigir, además de coordenadas, una `city` no vacía (`city.trim()`). Verificar con `npm run typecheck`.
- [x] 2.2 En `src/modules/weather/WeatherForecastSection.tsx`, condicionar `visible` a que exista ciudad (además de `days.length > 0`) para que el stack no la renderice con título vacío. Verificar con `npm run typecheck`.
- [x] 2.3 Agregar tests: con ciudad y coordenadas se muestra el título con la ciudad; con coordenadas pero sin ciudad la sección no se renderiza; sin coordenadas tampoco. Verificar con `npm run test`.

## 3. Documentación

- [x] 3.1 Actualizar `docs/clima.md`: el nombre de la sección de pronóstico pasa a "Proyección del clima en {ciudad}" y se documenta que requiere ciudad configurada. Verificar por revisión del archivo.

## 4. Prerrequisito de archivo y validación

- [x] 4.1 Archivar (o sincronizar) el change pendiente `weather-forecast` para que el requisito base "Sección de pronóstico del clima" exista en `openspec/specs/content-sections/spec.md`. Verificar que `openspec validate weather-section-city-title --json` deje de reportar el INFO de `MODIFIED ... not found`.
- [x] 4.2 Ejecutar `npm run lint` y `npm run test` completos; verificar que `openspec validate weather-section-city-title` pase sin issues.
