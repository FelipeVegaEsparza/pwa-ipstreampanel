# Design

## Context

Ver `proposal.md` para la motivación. El estado actual relevante:

- `GET /api/public/{clientId}` (endpoint agregado que consume
  `getAllClientData`) **ya devuelve** el campo `gcBar` con un arreglo de
  mensajes `{ id, text, order, createdAt, updatedAt }` (verificado contra el
  cliente real `cmtezi0ci00014raq8hrhhwfp`). Por eso no se agrega un fetch
  nuevo: se extiende el tipo de la respuesta agregada.
- Los 10 templates reciben `clientData: FullClientData | undefined` vía
  `TemplateProps` (`src/templates/index.tsx`). `petroleoblue` delega en
  `PetroleoTemplate` con `variant="blue"`.
- `PetroleoTemplate` ya tiene un ticker de noticias **arriba** del header
  (`styles.topStrip` / `styles.tickerTrack`), con animación `tickerMove` y
  fallback `prefers-reduced-motion` en su CSS. Se reutiliza el patrón de
  animación, no el bloque de noticias.
- `docs/instruccionesapi.md` aún no documenta el endpoint `gc-bar`.

## Goals / Non-Goals

**Goals:**

- Un único componente compartido de barra, sin duplicar lógica entre templates.
- Respetar el orden `order` y el multitenant (clientes sin mensajes no ven la
  barra).
- Animación fluida y sin saltos, con accesibilidad (lectura única y
  `prefers-reduced-motion`).
- Inserción consistente debajo del header en los 10 templates.

**Non-Goals:**

- No se agrega un endpoint ni una función de fetch nueva; se usa el campo
  agregado `gcBar`.
- No se modifica el ticker de noticias existente de `petroleo`.
- No se permite configurar colores/velocidad desde el panel (solo texto y
  orden, que son los campos que expone la API).
- No se agregan controles de pausa/cierre de la barra.

## Decisions

### 1. Extender `FullClientData` en lugar de un fetch dedicado

Se agrega `GcBarMessage` y `gcBar?: GcBarMessage[]` a `src/core/types/index.ts`.
El campo se marca opcional porque no todos los clientes lo incluirán y la API
es externa.

- **Por qué**: el dato ya llega en la misma respuesta que usan todos los
  templates, evitando una solicitud adicional, un estado de carga propio y
  problemas de sincronización. Coincide con el resto del contenido "de panel"
  que consume `clientData`.
- **Alternativa descartada**: `getGcBar()` + hook react-query. Agregaría una
  request por cliente y un render en dos fases sin beneficio, ya que el campo
  viene incluido.

### 2. Componente compartido `GcBar` como presentacional puro

`src/modules/content/GcBar.tsx` recibe `messages?: GcBarMessage[]`, filtra
textos vacíos, ordena por `order` y devuelve `null` si no queda ninguno. No
consulta la API ni conoce el tenant. Los templates solo lo montan.

- **Por qué**: separación datos (API) / presentación (UI) y cero duplicación
  entre 10 templates.
- **Alternativa descartada**: render inline del marquee en cada template.
  Duplicaría lógica y estilos.

### 3. Marquee CSS puro con track duplicado

La barra renderiza la secuencia de textos como un track y una copia idéntica
`aria-hidden`; la animación `translateX(-50%)` en loop con `linear infinite`
produce un scroll continuo sin salto. Se muestra solo la copia real a lectores
de pantalla, y `@media (prefers-reduced-motion: reduce)` desactiva la animación.

- **Por qué**: CSS puro no bloquea el hilo principal, se adapta a cualquier
  ancho y no depende de mediciones por JavaScript. Duplicar el track es la
  técnica estándar para loop sin corte.
- **Alternativa descartada**: JS con `requestAnimationFrame` o
  `scrollLeft`. Más complejo, con más riesgo de jank y de bugs en resize.

### 4. Ubicación: debajo del header en todos los templates

- Templates con `<header>` (`minimalista`, `moderna`, `blue`, `moderno`,
  `tradicional`, `app`): insertar la barra inmediatamente después de cerrar el
  header.
- `covered`: insertar la barra entre el hero y la barra de fecha/clima/instalación
  PWA.
- `blue` y `petroleo`: la barra se contiene al ancho máximo del contenido
  (1160px en `blue`; `--page-max-width` en `petroleo`) y se centra, en vez de
  ocupar todo el ancho del viewport.
- `petroleo`: insertar debajo del `headerWrap`, antes de `<main>`, para no
  mezclarla con el ticker de noticias que está arriba. `petroleoblue` hereda.
- `playlist` (sin header): insertar en la parte superior del layout de
  contenido, tras el bloque de marca/móvil.

Como la barra vive fuera del `<Outlet />` de cada template, aparece en todas
las rutas (home, listados y detalles). El estilo visual (colores) se define con
los tokens existentes para integrarse en cada diseño.

- **Por qué**: consistencia con la decisión del usuario ("bajo el header" en
  todos) y cobertura automática de todas las rutas.

### 5. Documentar el contrato

Se documenta `GET /api/public/{clientId}/gc-bar` en
`docs/instruccionesapi.md` (índice + sección con respuesta y campos), ya que el
proyecto exige verificar y mantener el contrato documentado.

## Risks / Trade-offs

- **Doble barra en `petroleo` (noticias + GC)** → Mitigación: son tiras
  distintas y con semánticas distintas; la GC queda debajo del header. Si
  molesta visualmente, se puede ocultar el ticker de noticias en un cambio
  posterior.
- **El campo `gcBar` no está documentado aún por el panel** → Mitigación: el
  tipo lo marca opcional y el componente tolera ausencia/`null`/vacío; se
  documenta el endpoint en `docs/instruccionesapi.md`.
- **Textos muy largos generan animaciones de distinta duración** → Mitigación:
  duración fija por ciclo; el track duplicado garantiza el loop sin salto
  independientemente del largo.
- **Accesibilidad del movimiento** → Mitigación: un solo bloque legible (la
  copia es `aria-hidden`) y fallback estático con `prefers-reduced-motion`.
- **Overflow horizontal** → Mitigación: contenedor con `overflow: hidden` y
  `white-space: nowrap`.

## Migration Plan

- Cambio puramente aditivo en el frontend: no requiere migración de datos ni
  cambios en el panel. Desplegar la PWA; si un cliente no tiene mensajes, no
  hay cambios visibles. Rollback = revertir el despliegue.

## Open Questions

- Ninguna que afecte specs, enfoque o tareas.
