## Context

El template `covered` (rediseño en `covered-redesign`) renderiza hero propio + `Outlet`; en la home el `Outlet` corresponde a `ContentSections` (`src/app/App.tsx`), que es la misma composición de secciones compartida por todos los templates vía su ruta index. Ese orden compartido es el que se desea cambiar únicamente para `covered`. Ver proposal.md - Why.

`ContentSections` ya es consciente del template: deriva `programVariant` según `data?.selectedTemplate === 'covered'`, por lo que condicionar el orden al template sigue un patrón existente. Cada sección es un componente propio (`NewsSection`, `PodcastsSection`, etc.) que recibe `clientData`/`isLoading` y se auto-oculta sin datos.

## Goals / Non-Goals

**Goals:**
- En la home de `covered`, bajo el hero: noticias → podcasts → videocasts → galerías → eventos → locutores, y después el resto (encuestas, TV, promociones, programas, videos, auspiciadores, redes, chat) en su orden relativo actual.
- Bloque de identidad de la radio antes del footer en `covered` (cover | título + descripción desde `basicData`).
- Sin cambios de API, sin duplicar el consumo de datos.

**Non-Goals:**
- Cambiar el orden de secciones en los demás templates.
- Rediseñar secciones individuales (se reutilizan tal cual).
- Agregar nuevas secciones de contenido ni modificar rutas de detalle.

## Decisions

### D1. Orden por template dentro de `ContentSections`
En `src/modules/content/ContentSections.tsx` se mantiene el listado de componentes como fuente única de verdad y, cuando `selectedTemplate === 'covered'`, se reordenan antes de renderizar: se anteponen las 6 secciones editoriales en el orden pedido y el resto conserva su orden relativo. Los demás templates renderizan en el orden actual.

*Alternativa*: crear una home propia para `covered` (otro componente en el index route). Se descarta porque el index route es compartido en `App.tsx` y rompería el patrón actual; el condicional por template ya existe en este módulo.

### D2. Implementación del reorden como lista explícita
Se recomienda expresar el orden como un arreglo de componentes con sus props (`clientData`, `isLoading`) en vez de JSX fijo, para poder intercalar/rotar por template sin duplicar elementos. Cubre estados de carga/null: cada sección ya oculta su contenedor si no hay datos, por lo que reordenar no introduce saltos ni espacios.

*Alternativa*: mover secciones a `covered` vía `children`. Más invasivo y duplica render; se descarta.

### D3. Bloque de identidad en `CoveredTemplate`
En `src/templates/covered/CoveredTemplate.tsx` se agrega, entre `<main>` y `<footer>`, un bloque de dos columnas (grid adaptativo, apilado en móvil) con `SmartImage` a la izquierda (cover de la radio, fallback `logoUrl`) y a la derecha `projectName` como título y `projectDescription` como párrafo, tomados de `clientData?.basicData`. Si falta el cover y el logo, la columna de imagen degrada (sin romper) y el bloque muestra el texto.

### D4. Estilos en el CSS del template
Se agregan clases al `CoveredTemplate.module.css` existente usando las variables de contenido/acento del template (`--tpl-*`/`--content-*`), manteniendo tema claro y responsive.

## Risks / Trade-offs

- [Regresión en otras templates por el reorden compartido] → El orden por template se activa solo con `selectedTemplate === 'covered'`; se cubre con test que verifica el orden default intacto.
- [Acoplamiento contenido↔template dentro de `ContentSections`] → Aceptado: ya existe el precedente de `programVariant`; se limita a una rama de orden, sin duplicar secciones.
- [Bloque sin imagen (cover y logo nulos)] → Degrada mostrando solo texto; cubierto en spec y diseño.

## Migration Plan

1. Implementar el reorden condicional en `ContentSections.tsx`.
2. Agregar el bloque de identidad en `CoveredTemplate.tsx` + estilos CSS.
3. Verificar `npm run typecheck`, `npm run test` y smoke en navegador (home `covered` con y sin datos; otras templates sin cambios).
