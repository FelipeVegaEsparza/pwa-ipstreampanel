## Why

Los sitios de las radios/TV hoy no ofrecen ninguna vía para que un visitante se comunique con el medio (auspiciar, enviar mensajes, pedir información). El equipo de IPStream Panel entregó una guía de integración oficial para un formulario de contacto público: las consultas se envían a `POST /api/public/{clientId}/contact-messages` y quedan visibles en el panel del cliente en `/dashboard/contact-messages`, con estado `new`. Se quiere exponer ese formulario en la home del sitio para que los mensajes lleguen al panel del medio.

## What Changes

- **Nuevo módulo de contacto** (`ContactSection`): formulario público sin autenticación con 4 campos obligatorios (`name`, `email`, `phone`, `message`) y sin `subject`, que valida en el cliente las mismas reglas del servidor (requerido + `maxLength`: 120 / 254 / 40 / 2000 y formato de email) y degrada con mensajes claros.
- **Envío al API público**: un helper nuevo en el cliente HTTP publica el mensaje a `https://panelipstream.cl/api/public/{clientId}/contact-messages` (misma base URL y `clientId` del tenant activo), una sola vez (sin reintentos que dupliquen envíos).
- **Manejo de estados**: botón deshabilitado mientras se envía, éxito en 201 con reinicio del formulario, mensaje de validación en 400 mostrando `error`, aviso anti-spam en 429 ("Demasiados intentos, espera unos minutos"), y mensaje genérico en 404/500/error de red.
- **Integración en la home**: la sección "Contáctanos" se renderiza al final del contenido de la home (tras las secciones data-driven) para todos los templates excepto `minimalista`, cuyo home es solo el reproductor now-playing. No se altera ningún footer ni plantilla individual.

## Capabilities

### New Capabilities

- `contact`: formulario de contacto público del sitio, con sus campos, validación cliente, envío al endpoint público de mensajes y manejo de respuestas/errores (201/400/404/429/500/red).

### Modified Capabilities

- `content-sections`: la pila de secciones de la home termina con la sección de contacto para todo template salvo `minimalista`.

## Impact

- **Nuevo código**: `src/modules/contact/` (`ContactSection.tsx`, CSS, tests) y helper de API para mensajes de contacto.
- **Modificado**: `src/modules/content/ContentSections.tsx` (append de la sección al final del stack) y cliente HTTP (`src/core/api`).
- **API**: nuevo uso del endpoint público `POST /api/public/{clientId}/contact-messages` (contrato provisto por la guía de integración de IPStream Panel; ajeno a `instruccionesapi.md`).
- **Multi-tenant**: cada build usa su propio `clientId` (nunca se hardcodea el de otra radio).
- **No afecta**: el backend del panel, los templates como componentes, ni el reproductor.
