## Context

La base ya tiene `core/api` con los GET de `polls`, `chat/messages` y `chat/online` (sin caché para chat), `core/types` (Poll, PollOption, ChatMessage, ChatMessagesResponse, ChatOnlineResponse), adaptadores y la UI compartida (`Section`, `Card`, `Grid`, `Skeleton`). Este cambio agrega los POST tipados y los módulos interactivos: ver proposal.md - Why.

Contrato relevante: el endpoint de voto NO protege contra votos duplicados server-side (el frontend usa `localStorage['poll_{id}']`); el chat es polling con `since` = `serverTime` y `retentionHours` (~24h); hay rate limit (5 msg/min/IP) y bans server-side.

## Goals / Non-Goals

**Goals:**
- Sección de encuestas data-driven (visible solo con encuestas activas), voto con anti-duplicado `localStorage` y resultados con porcentajes.
- Sección de chat con lectura/envió por polling (`since`/`serverTime`), oyentes activos y resiliencia ante errores.
- Reutilizar `core/api`, tipos, adaptadores y UI compartida.

**Non-Goals:**
- Moderación/bans de chat (server-side), persistencia de historial, nombres de usuario persistidos (solo `localStorage` opcional).
- Notificaciones push de nuevos mensajes (fase posterior).
- Encuestas con múltiples votos (solo una opción por encuesta, según el contrato).

## Decisions

### D1. POST tipados en `core/api`
Se agregan `votePoll(clientId, pollId, optionId)` (`POST /polls/{pollId}/vote` con `{ optionId }`) y `sendChatMessage(clientId, { name, email, body })` (`POST /chat/messages`), usando el `request` existente con manejo de errores (no retry en 4xx). Se mantienen los GET ya existentes.

### D2. Encuestas: estado local de voto
`PollsSection` lee las encuestas de `useFullClientData` (campo `polls`). Por cada encuesta se consulta `localStorage['poll_{id}']`: si existe, se renderiza directo en modo resultados; si no, modo votación. Al votar: se llama a `votePoll`, en éxito se persiste la clave y se renderizan resultados (con `useState` local de la respuesta actualizada). En error se muestra mensaje y no se persiste.
*Alternativa*: invalidar y refetchear la query tras votar — innecesario; el POST devuelve la encuesta actualizada y se usa localmente.

### D3. Chat: polling con `serverTime`
`ChatSection` mantiene `serverTime` en un estado local (o ref) y usa `useQuery` con `refetchInterval` para `getChatMessages(clientId, serverTime)`; al recibir una respuesta, se reemplaza la lista de mensajes por los acumulados + nuevos, y se guarda `serverTime`. Se usa `refetchIntervalInBackground: false` y `refetchOnWindowFocus` para no consultar con la pestaña oculta. El envío usa `sendChatMessage` y luego fuerza un refetch para ver el mensaje del servidor (los `authorType: listener` son visibles).
*Alternativa*: acumular mensajes manualmente con `setInterval` + `fetch` — TanStack Query ya aporta el ciclo de vida y la resiliencia; se descarta duplicar.

### D4. Envío de chat: identidad del oyente
El formulario pide `name` (y `email` opcional); se conserva el nombre en `localStorage` para no pedirlo cada vez. `body` se envía tal cual. Validación: `name` y `body` no vacíos, con límite de longitud razonable (el servidor aplica su propio rate limit y bans).

### D5. Integración data-driven en templates
Ambas secciones se agregan a `ContentSections` (encuestas primero, chat al final): encuestas solo si `asArray(polls).length > 0`; chat siempre visible (es interactivo) o con un toggle mínimo. Reutilizan `Section`/`Card` y las variables CSS de los templates.

### D6. Oyentes activos
`getChatOnline` con `refetchInterval` más largo (p. ej. 30s) para mostrar el contador; degrada silencioso si falla.

## Risks / Trade-offs

- [Votos duplicados] → Solo `localStorage`; si el usuario limpia datos, puede votar de nuevo (limitación del contrato).
- [Rate limit del chat (5 msg/min)] → Mensajes de error claros al fallar; el servidor ya lo aplica.
- [Chat con retención corta] → La lista refleja solo lo que el servidor retiene; sin historial eterno.
- [Polling innecesario con pestaña oculta] → `refetchIntervalInBackground: false` y pausa en `document.hidden`.
- [`serverTime` no disponible] → Si falta, se usa la hora local como fallback de `since` y se continúa el polling.
