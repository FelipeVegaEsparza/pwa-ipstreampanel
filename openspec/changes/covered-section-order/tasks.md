## 1. Reorden de secciones solo en `covered`

- [x] 1.1 En `src/modules/content/ContentSections.tsx` expresar las secciones como lista ordenada (componentes con sus props `clientData`/`isLoading`) y, cuando `selectedTemplate === 'covered'`, anteponer en orden: `NewsSection`, `PodcastsSection`, `VideocastsSection`, `GalleriesSection`, `EventsSection`, `AnnouncersSection`; el resto conserva su orden relativo. Verificar con `npm run typecheck` y `npm run test`.
- [x] 1.2 Cubrir con test que, con `selectedTemplate === 'covered'`, el render del home posiciona las secciones en el orden editorial pedido antes que el resto.
- [x] 1.3 Cubrir con test que un template distinto de `covered` conserva el orden actual de secciones (sin regresión en las demás templates).

## 2. Bloque de identidad de la radio en `covered`

- [x] 2.1 Agregar en `src/templates/covered/CoveredTemplate.tsx`, entre `<main>` y `<footer>`, un bloque de dos columnas que muestre a la izquierda el cover de la radio (`SmartImage` con `basicData.coverUrl`, fallback `basicData.logoUrl`) y a la derecha `basicData.projectName` como título y `basicData.projectDescription` como descripción. Verificar con `npm run typecheck` y `npm run test`.
- [x] 2.2 Estilar el bloque en `CoveredTemplate.module.css` con grid adaptativo (columnas en desktop, apilado en móvil) reutilizando las variables de contenido/acento del template; verificar el layout en móvil y desktop con smoke en navegador.
- [x] 2.3 Cubrir con test que el bloque aparece antes del footer en `covered` con cover, y que degrada (solo texto, sin romper) cuando no hay cover ni logo.

## 3. Verificación de integración

- [x] 3.1 Ejecutar `npm run lint`, `npm run typecheck` y `npm run test` y confirmar que pasan.
- [x] 3.2 Smoke en navegador: home de un cliente `covered` (con datos y con secciones vacías), otra template sin cambios y una ruta de detalle.
