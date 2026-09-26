# Proposal

## Why

IPStream Panel incorporó el endpoint público `GET /api/public/{clientId}/gc-bar`
(ya incluido como campo `gcBar` en la respuesta agregada de
`GET /api/public/{clientId}`), que entrega mensajes cortos editables por el
cliente (por ejemplo, lemas de la emisora). Hoy la PWA no muestra esos
mensajes, por lo que el contenido configurado en el panel queda invisible para
los visitantes.

## What Changes

- Leer los mensajes de `gcBar` desde la respuesta agregada del cliente (campo
  ya presente en `FullClientData`) y exponerlos tipados.
- Agregar una barra de mensajes con texto en movimiento (marquee de scroll
  continuo e infinito) compartida por todos los templates.
- Renderizar la barra **debajo del header** en todos los templates
  (`minimalista`, `moderna`, `blue`, `moderno`, `tradicional`, `app`,
  `petroleo`, `petroleoblue`, `playlist`, `covered`), en todas las rutas.
- Ordenar los mensajes por el campo `order` de la API.
- No renderizar nada si el cliente no tiene mensajes (`gcBar` vacío, `null` o
  ausente), preservando el comportamiento actual.
- Respetar `prefers-reduced-motion`: detener la animación y mostrar el texto
  de forma legible.

No es un cambio breaking.

## Capabilities

### New Capabilities

- `gc-bar`: obtener los mensajes de la barra de mensajes del cliente y
  mostrarlos en una barra con texto en movimiento, ordenados, en todos los
  templates.

### Modified Capabilities

- `api-client`: la respuesta agregada tipada del cliente incluye el arreglo de
  mensajes `gcBar` con `id`, `text`, `order`, `createdAt` y `updatedAt`.
- `templates`: todos los templates muestran la barra GC debajo del header, en
  todas las rutas, solo si hay mensajes.

## Impact

- `src/core/types/index.ts`: nuevo tipo `GcBarMessage` y campo `gcBar` en
  `FullClientData`.
- `src/modules/content/GcBar.tsx` y `GcBar.module.css`: componente compartido
  y estilos de la barra animada.
- Los 10 componentes de template en `src/templates/*` (incluido el inserción
  en `PetroleoTemplate`, que también sirve a `petroleoblue`).
- `src/templates/templates.render.test.tsx` y un test unitario nuevo para
  `GcBar`.
- Depende del contrato documentado en `docs/instruccionesapi.md` y del campo
  `gcBar` de la respuesta agregada del panel.
