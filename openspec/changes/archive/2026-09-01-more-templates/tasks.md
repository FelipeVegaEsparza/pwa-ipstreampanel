## 1. Componentes compartidos

- [x] 1.1 Crear `RadioPlayerHero` (setStreamUrl, tema actual, play/pause, oyentes, estado, Media Session; estilizado por variables `--hero-*`) y verificar con `npm run typecheck`
- [x] 1.2 Crear `TemplateShell` (header + hero + Outlet + footer + PlayerBar, mapea `--content-*` desde `--tpl-*`) y verificar con `npm run typecheck`

## 2. Templates nuevos

- [x] 2.1 Crear y registrar `blue` (azul oscuro, acento cian) y verificar render con datos mockeados
- [x] 2.2 Crear y registrar `moderno` (claro, acento púrpura, tarjetas) y verificar render
- [x] 2.3 Crear y registrar `tradicional` (claro clásico, acento rojo) y verificar render
- [x] 2.4 Crear y registrar `app` (estilo app móvil, compacto, oscuro) y verificar render
- [x] 2.5 Crear y registrar `petroleo` (oscuro, acento verde petróleo) y verificar render
- [x] 2.6 Crear y registrar `playlist` (cover grande, oscuro, acento rosa) y verificar render
- [x] 2.7 Crear y registrar `covered` (hero con portada a sangre) y verificar render

## 3. Verificación de integración

- [x] 3.1 Agregar un test que verifique que `getTemplate` devuelve cada template nuevo por su id y el fallback al default
- [x] 3.2 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build:client -- fusionaustral` y confirmar que pasan
- [x] 3.3 Smoke en navegador: seleccionar cada template vía `selectedTemplate` (mockeando la respuesta) y verificar que renderiza sin errores
