## Context

El panel expone `basicData.location` (city/region/country/latitude/longitude), ya verificado consistente entre `/basic-data` y el payload completo. Los templates ya tienen UI de cabecera (reloj en `minimalista`, fecha en `covered`) donde encaja el clima. La app no debe guardar API keys de proveedores; Open-Meteo no requiere clave y permite CORS: ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Componente `Weather` reutilizable (un solo lugar de lógica, usable por cualquier template).
- Consulta a Open-Meteo con lat/lon, temperatura (C/F según país) + condición en español + ciudad.
- Degradación elegante (sin `location` o sin red → oculto).
- Integración inicial en `minimalista` y `covered`.

**Non-Goals:**
- Pronóstico por horas/días, mapa, unidades configurables por el oyente.
- Geolocalización del oyente (el clima es de la ciudad de la radio).
- Cache persistente del clima (una consulta puntual; puede refrescarse al recargar).

## Decisions

### D1. Proveedor: Open-Meteo (sin clave, mundial)
Se consulta `https://api.open-meteo.com/v1/forecast?latitude=..&longitude=..&current_weather=true&temperature_unit=celsius` (o `fahrenheit` si `country === 'US'`). Respuesta: `current_weather.temperature` y `weathercode`.
*Alternativas*: OpenWeatherMap/WeatherAPI requieren API key expuesta en el cliente — descartadas.

### D2. `Weather` reutilizable
`src/modules/weather/Weather.tsx` + hook `useWeather(location)`. Hook con `useEffect`+`AbortController`; devuelve `{ temp, code, city }` o `null`. El componente renderiza `null` si no hay datos (oculto). Estilos vía tokens/CSS del template (se pasa `className`).
*Racional*: consistente con `DigitalClock`/`VuMeter` (piezas reutilizables por template).

### D3. Mapeo de condición WMO → español
Función pura `weatherLabel(code)` con los rangos estándar de la OMM (despejado, parcial, niebla, llovizna, lluvia, nieve, tormenta...). Código desconocido → sin texto (solo temp/ciudad).

### D4. Integración
- `minimalista`: dentro del área del reloj (pantallas grandes).
- `covered`: en el header, junto a la fecha.
Ambas pasan `location={clientData?.basicData?.location}`; si `null`, no se muestra.

## Risks / Trade-offs

- [Open-Meteo no disponible/red caída] → Componente oculto; sin romper (por diseño).
- [Lat/lon sin ciudad configurada] → `location` null → oculto.
- [Latencia extra de tercero] → Solo si hay `location`; no bloquea el render del reproductor.

## Migration Plan

1. Agregar `location` al tipo `BasicData`.
2. Crear módulo `weather` (hook + componente + mapa de condición).
3. Integrar en `minimalista` y `covered`.
4. Verificar: `npm run typecheck`, `npm run test`, `npm run build:client`, smoke en navegador con `location` inyectado.
