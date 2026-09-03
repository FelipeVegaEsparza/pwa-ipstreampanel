## Why

La app ya muestra todo el contenido de lectura de cada radio (data-driven). Falta la parte interactiva que el contrato de `instruccionesapi.md` define: **encuestas** (votar con anti-duplicado vía `localStorage`) y **chat en vivo** (leer/enviar mensajes por polling con `serverTime` y mostrar oyentes activos). Ambas solo aparecen si el backend entrega datos (encuestas activas) o si la sección está habilitada.

## What Changes

- **Módulo de Encuestas**: lista las encuestas activas (`GET /polls`), permite votar (`POST /polls/{pollId}/vote` con `optionId`) y muestra resultados con porcentajes. Anti-duplicado con `localStorage` (clave `poll_{pollId}`), como exige el contrato.
- **Módulo de Chat**: muestra los mensajes del cliente (`GET /chat/messages`), envía mensajes del oyente (`POST /chat/messages` con `name`, `email`, `body`), hace polling incremental usando `serverTime` de la respuesta anterior como `since`, y muestra los oyentes activos (`GET /chat/online`).
- **Integración en templates**: ambas secciones se integran data-driven en los templates (encuestas solo si hay encuestas activas; chat como sección siempre disponible o condicional).
- **Delegados POST tipados**: `votePoll` y `sendChatMessage` en `core/api` (ya existen los GET; se agregan los POST).

## Capabilities

### New Capabilities

- `polls`: Muestra las encuestas activas del cliente, permite votar una vez por dispositivo (anti-duplicado con `localStorage`) y renderiza los resultados con porcentajes.
- `chat`: Muestra y envía mensajes del chat del cliente mediante polling incremental (`since` = `serverTime`), con indicador de oyentes activos y manejo de errores de red sin romper la interfaz.

### Modified Capabilities

- Ninguna. `api-client` ya expone los endpoints GET; este cambio agrega las funciones POST y consume lo existente.

## Impact

- **Nuevo código**: `src/modules/polls/` (`PollsSection`, `PollCard`, lógica de voto + `localStorage`) y `src/modules/chat/` (`ChatSection`, input de envío, lista de mensajes, polling con `serverTime`, contador de oyentes).
- **API consumida**: `GET /polls`, `POST /polls/{pollId}/vote`; `GET /chat/messages?since=`, `POST /chat/messages`, `GET /chat/online`. Sin caché persistente para chat (network-only).
- **Dependencias**: ninguna nueva (se reutilizan `core/api`, `core/types`, `core/adapters`, UI compartida).
- **No afecta**: lectura de contenido, templates, PWA ni el modelo de despliegue.
