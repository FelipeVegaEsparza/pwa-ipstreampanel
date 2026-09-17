## Why

El panel ya expone `basicData.location` (ciudad + coordenadas de la radio, global) en `/basic-data` y en el payload completo. Se quiere que los templates muestren el clima de la ciudad de la radio. Para no depender de una API key ni de un servicio del panel, el frontend consulta un proveedor de clima público (Open-Meteo, gratis y mundial) usando las coordenadas expuestas.

## What Changes

- **Tipo `location`**: se agrega el objeto `location` (city, region, country, latitude, longitude) al modelo `BasicData`.
- **Módulo clima reutilizable**: componente `Weather` + hook que consulta Open-Meteo (forecast, sin API key) con las coordenadas, mapea el código de condición a texto en español y muestra temperatura + ciudad.
- **Unidades**: °C por defecto; °F si `country === 'US'`.
- **Degradación elegante**: si no hay `location`, si la red falla o el proveedor no responde, el bloque no se muestra (no rompe la app).
- **Integración**: `minimalista` (zona del reloj, pantallas grandes) y `covered` (header, junto a la fecha). Reutilizable en los demás templates después.

## Capabilities

### New Capabilities

- `weather`: Muestra el clima de la ciudad de la radio (temperatura, condición y ciudad) usando la `location` expuesta por la API y un proveedor público sin clave, con degradación elegante.

### Modified Capabilities

- `api-client`: los tipos de `BasicData` incluyen `location` (no cambia el consumo).

## Impact

- **Nuevo código**: `src/modules/weather/` (componente, hook y estilos).
- **Modificado**: `core/types` (location), `minimalista` y `covered`.
- **API consumida**: `https://api.open-meteo.com/v1/forecast` (tercero público, sin key, CORS habilitado).
- **No afecta**: resto de la app ni el modelo de despliegue.
