## Context

El pronóstico se renderiza en `WeatherForecastSection` (compartida por todos los templates vía `ContentSections`) dentro de un `<Section title="Clima">`. La ciudad disponible es `clientData.basicData.location.city`. Hoy la visibilidad de la sección depende de que `useWeatherForecast` devuelva días (`days.length > 0`), y `sectionHasContent('weather')` en `sections.ts` solo exige coordenadas; los menús de `blue` y `playlist` usan `sectionHasContent` para filtrar enlaces, mientras el stack renderiza todas las secciones y cada componente decide si mostrarse.

Restricción de contexto: el change `weather-forecast` (que introdujo la sección y su requisito "Sección de pronóstico del clima") está completo pero **sin archivar**, por lo que `openspec/specs/content-sections/spec.md` aún no contiene ese requisito. Ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Título de la sección con la ciudad configurada: "Proyección del clima en {ciudad}".
- Ocultar la sección cuando no haya ciudad configurada, aunque existan coordenadas.

**Non-Goals:**
- No cambiar las etiquetas de navegación (`SECTION_LABELS.weather`) ni el bloque de clima actual de las cabeceras.
- No usar la región como respaldo de la ciudad (decisión del usuario: sin ciudad, no se muestra la sección).

## Decisions

### D1. Derivar el título en `WeatherForecastSection`
Se calcula `city` desde `clientData.basicData.location.city` y se pasa `title={`Proyección del clima en ${city}`}`. Se mantiene `SECTION_LABELS.weather = 'Clima'` porque los menús necesitan etiquetas cortas y estáticas y el alcance acordado excluye la navegación.

Alternativa descartada: mover el título a `WeatherForecast`/`useWeatherForecast` (acopla el texto de UI al hook de datos y complica los tests del hook).

### D2. Visibilidad condicionada a ciudad + coordenadas
Se actualiza `sectionHasContent('weather')` para exigir además `city` no vacía (así los menús no enlazan a una sección inexistente), y `WeatherForecastSection` usa `visible={days.length > 0 && Boolean(city)}` (el stack no consulta `sectionHasContent`). `useWeatherForecast` no cambia: sigue consultando solo con coordenadas.

Alternativa descartada: usar `sectionHasContent` para gatear el render del stack (cambio mayor y fuera de alcance).

### D3. Dependencia con `weather-forecast` sin archivar
El delta usa `MODIFIED` sobre "Sección de pronóstico del clima", requisito que vive en el change pendiente `weather-forecast`. Antes de archivar este change hay que archivar (o sincronizar) `weather-forecast`, para que el requisito base exista en `openspec/specs/content-sections/spec.md`.

## Risks / Trade-offs

- [Archivar este change falla si `weather-forecast` sigue sin archivar] → Prerrequisito explícito en tasks.md: archivar/sincronizar `weather-forecast` primero.
- [Tests existentes que buscan el texto "Clima" como título] → Actualizar `ContentSections.test.tsx` (u otros) al nuevo título dinámico.
- [Ciudad con solo espacios] → Tratarla como no configurada (`city.trim()`), para no mostrar "en  ".
