# Tasks

## 1. Contrato y tipos

- [x] 1.1 Agregar la interfaz `GcBarMessage` (`id`, `text`, `order`, `createdAt`, `updatedAt`) y el campo opcional `gcBar?: GcBarMessage[]` a `FullClientData` en `src/core/types/index.ts`; verificar con `npm run typecheck`
- [x] 1.2 Documentar `GET /api/public/{clientId}/gc-bar` en `docs/instruccionesapi.md` (índice de endpoints + sección con respuesta y campos, siguiendo el formato de las secciones existentes); verificar que la sección y su fila en el índice sean consistentes con el resto del documento

## 2. Componente de barra

- [x] 2.1 Crear `src/modules/content/GcBar.tsx`: componente presentacional que recibe `messages?: GcBarMessage[]`, filtra textos vacíos/solo espacios, ordena por `order` y devuelve `null` si no queda ninguno; verificar con un test unitario que un arreglo vacío/`undefined` no renderiza nada
- [x] 2.2 Renderizar el marquee con track duplicado (la copia con `aria-hidden`) para scroll continuo e infinito; verificar con un test que, con mensajes, el texto aparece en el documento
- [x] 2.3 Crear `src/modules/content/GcBar.module.css` con `overflow: hidden`, `white-space: nowrap`, animación `translateX` en loop `linear infinite` y `@media (prefers-reduced-motion: reduce)` que detenga la animación; verificar visualmente que el loop no da saltos y que con movimiento reducido el texto queda estático

## 3. Integración en templates

- [x] 3.1 Insertar `<GcBar messages={clientData?.gcBar} />` debajo del `</header>` en `minimalista`, `moderna`, `blue`, `moderno`, `tradicional`, `app` y `covered`; verificar con `npm run typecheck`
- [x] 3.2 Insertar la barra debajo del `headerWrap` (antes de `<main>`) en `PetroleoTemplate`, manteniendo intacto el ticker de noticias; verificar que `petroleoblue` también la muestra al heredar de `petroleo`
- [x] 3.3 Insertar la barra en la parte superior del layout de contenido de `PlaylistTemplate`, que no tiene header; verificar que se renderiza sin romper el layout responsive
- [x] 3.4 Asegurar que la barra se muestre en todas las rutas (home, listados y detalles) por estar fuera del `<Outlet />`; verificar renderizando cada template en el test de templates
- [x] 3.5 Contener la barra al ancho del contenido en `blue` (1160px) y `petroleo` (`--page-max-width`) con centrado, y mover la barra de `covered` a la posición entre el hero y la barra de instalación PWA; verificar con `npm run typecheck` y `npm run test`

## 4. Pruebas y verificación

- [x] 4.1 Agregar/ajustar `src/templates/templates.render.test.tsx` para incluir `gcBar` en `clientData` y comprobar que el texto del mensaje aparece en los templates; verificar que pasa con `npm run test`
- [x] 4.2 Ejecutar `npm run lint`, `npm run typecheck` y `npm run test` y confirmar que todo pasa sin errores
