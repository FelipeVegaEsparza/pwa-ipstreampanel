# Tasks

## 1. Tipografías self-hosted

- [x] 1.1 Agregar los `.woff2` de Bebas Neue y Montserrat (subconjunto latino) en `public/fonts/`; verificar que los archivos existen y pesan lo esperado.
- [x] 1.2 Crear el CSS con `@font-face` de ambas familias e importarlo desde el template; verificar con `npm run build` que los `.woff2` quedan en `dist/` y dentro del precache del service worker.
- [x] 1.3 Definir las familias del template (`--template-display-font`, `--primary-font`) y verificar con `npm run typecheck`.

## 2. Registro y orden del template `moderno2`

- [x] 2.1 Crear `src/templates/moderno2/Moderno2Template.tsx` (contenedor `.page` + `<Outlet/>`) y registrarlo en `src/templates/index.tsx`; verificar con `npm run typecheck`.
- [x] 2.2 Actualizar `src/templates/index.test.tsx` para esperar el registro de `moderno2` y el fallback al template por defecto; verificar con `npm run test`.
- [x] 2.3 Agregar `MODERNO2_ORDER` y su rama en `getSectionOrder` (`src/modules/content/sections.ts`); verificar con `npm run test` del orden por template.
- [x] 2.4 Agregar en `src/modules/content/ContentSections.test.tsx` el caso de `moderno2` con orden y omisión de secciones sin datos; verificar con `npm run test`.

## 3. Encabezado display

- [x] 3.1 Extender `src/ui/Section.tsx` con modo opt-in (`bgText` que emite `data-bg-text` y título que admite fragmento resaltado) sin cambiar el comportamiento por defecto; verificar con un test que el atributo sólo aparece cuando se pasa `bgText`.
- [x] 3.2 Activar la variante de encabezado en `ContentSections` cuando `selectedTemplate === 'moderno2'`; verificar con `npm run test`.
- [x] 3.3 Implementar el efecto en `Moderno2Template.module.css` (`::before` con `attr(data-bg-text)`, color `--section-bg-text-color` y `.highlight`); verificar con `npm run build`.

## 4. Hero, navegación y layout

- [x] 4.1 Implementar el hero con `useLiveRadio` (portada, título, artista y control de reproducción) y la navegación por anclas a `sectionAnchorId` con drawer móvil; verificar con un test de render del hero y del menú.
- [x] 4.2 Componer GC bar, `<Outlet/>`, footer y el player persistente en el layout; verificar con `npm run typecheck` y un test de render del template completo.

## 5. Clima multi-ciudad

- [x] 5.1 Implementar `MultiCityWeather` (tarjeta principal = `basicData.location` y grilla de las 9 ciudades fijas) reutilizando `useWeather`; verificar con test de fetch mockeado que muestra la principal y las 9 tarjetas.
- [x] 5.2 Manejar el fallo por ciudad (tarjeta "sin datos") y la ausencia de ciudad principal; verificar con tests de esos escenarios.
- [x] 5.3 Agregar refresco periódico (~10 min) y al volver visible la pestaña; verificar con test de timers falsos.
- [x] 5.4 Integrar la vista en el layout de `moderno2` con su CSS responsive (320px|1fr → 1 columna <900px → 2 columnas <640px) y actualizar `docs/clima.md` con la vista multi-ciudad; verificar con test de render y revisión del doc.

## 6. Historial de canciones

- [x] 6.1 Implementar el store `useSongHistory` (localStorage por `clientId`, dedupe por clave de tema y máximo de entradas) alimentado por `useStreaming`; verificar con tests unitarios (agrega, no duplica, respeta el límite y persiste).
- [x] 6.2 Implementar `SongHistorySection`, visible sólo cuando hay entradas; verificar con test (con entradas muestra la lista, sin entradas no renderiza).
- [x] 6.3 Integrar la sección de historial en el layout de `moderno2`; verificar con test de render.

## 7. Verificación de integración

- [x] 7.1 Ejecutar `npm run lint`, `npm run typecheck` y `npm run test`; verificar que pasan sin errores.
- [x] 7.2 Ejecutar `npm run build` y confirmar que las fuentes, el template `moderno2` y las secciones quedan en `dist/`.
- [x] 7.3 Validar el cambio con `openspec validate add-moderno2-template` sin issues.

## 8. Navegación pegada al scroll

- [x] 8.1 Hacer `sticky` la barra de navegación de `moderno2` para que acompañe el scroll, con el menú móvil desplegándose bajo la barra; verificar con `npm run typecheck`, tests de `moderno2` y `npm run build`.

## 9. Noticias y tarjetas oscuras

- [x] 9.1 Usar la variante `featured` de noticias en `moderno2` (1 principal izquierda + 3 derecha) y aplicar la paleta oscura de tarjetas del template; verificar con test de `ContentSections` y `npm run build`.

## 10. Programación por día

- [x] 10.1 Agregar la variante `tabs` a `ProgramsSection` (días Lunes–Domingo arriba y tarjetas con imagen, horario, días y descripción del día seleccionado) y usarla en `moderno2`; verificar con tests de `ProgramsSection`/`ContentSections` y `npm run build`.

## 11. Sin sección de redes

- [x] 11.1 Quitar `social` del orden de `moderno2` (las redes ya están en header y footer); verificar con test de `ContentSections` y `npm run build`.

## 12. VU meter en el reproductor

- [x] 12.1 Agregar un fondo opcional de VU meter al `PlayerBar` y activarlo en `moderno2`; verificar con tests de `PlayerBar`/`moderno2` y `npm run build`.

## 13. Todas las secciones del panel

- [x] 13.1 Incluir el resto de secciones con datos (podcasts, videocasts, galerías, eventos y encuestas) en el orden de `moderno2`; verificar con test de `ContentSections` y `npm run build`.

## 14. Barra de mensajes bajo la navegación

- [x] 14.1 Integrar la GC bar dentro de la navegación principal (mismo ancho, debajo de los enlaces) en `moderno2`; verificar con tests de `moderno2` y `npm run build`.
