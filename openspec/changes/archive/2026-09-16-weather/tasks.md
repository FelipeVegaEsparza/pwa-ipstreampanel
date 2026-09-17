## 1. Tipos

- [x] 1.1 Agregar el modelo `BasicLocation` y el campo `location` a `BasicData` en `core/types` y verificar con `npm run typecheck`

## 2. Módulo clima

- [x] 2.1 Crear el hook `useWeather(location)` que consulta Open-Meteo (forecast con lat/lon, °C o °F según `country`) con `AbortController` y devuelve `{ temp, code, city }` o `null`; verificar con tests de vitest (fetch mockeado)
- [x] 2.2 Crear `weatherLabel(code)` (códigos WMO → español) y verificar con tests (rangos y desconocido)
- [x] 2.3 Crear el componente `Weather` (temperatura + condición + ciudad, `className` configurable) que devuelve `null` sin `location` o sin datos; verificar con tests (render y oculto)

## 3. Integración en templates

- [x] 3.1 Integrar `Weather` en `minimalista` (área del reloj, pantallas grandes) y en `covered` (header, junto a la fecha); verificar con `npm run typecheck`

## 4. Verificación

- [x] 4.1 Ejecutar `npm run typecheck`, `npm run test` y `npm run build:client -- fusionaustral` y confirmar que pasan
- [x] 4.2 Smoke en navegador: con `location` inyectado se muestra el clima; sin `location` no aparece
