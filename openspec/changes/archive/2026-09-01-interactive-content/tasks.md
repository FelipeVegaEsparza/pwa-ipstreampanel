## 1. API (POST tipados)

- [x] 1.1 Agregar `votePoll(clientId, pollId, optionId)` en `core/api` (POST `/polls/{pollId}/vote` con `{ optionId }`, sin retry en 4xx) y verificar con `npm run typecheck` y un test con fetch mockeado (200 devuelve la encuesta actualizada)
- [x] 1.2 Agregar `sendChatMessage(clientId, { name, email, body })` en `core/api` (POST `/chat/messages`) y verificar con `npm run typecheck` y un test con fetch mockeado

## 2. Encuestas (spec `polls`)

- [x] 2.1 Implementar `PollsSection` (lee `polls` de `useFullClientData`, visible solo si hay encuestas activas) y `PollCard` con modo votación/respuesta según `localStorage['poll_{id}']`, y verificar con tests de vitest (sección oculta sin encuestas; si ya votó muestra resultados)
- [x] 2.2 Implementar el flujo de voto: llamar `votePoll`, persistir `localStorage['poll_{pollId}']` solo en éxito, mostrar resultados con porcentajes y mensaje de error sin persistir en fallo; verificar con tests de vitest (éxito persiste y muestra %, fallo no persiste)

## 3. Chat (spec `chat`)

- [x] 3.1 Implementar `ChatSection` con lista de mensajes vía polling (`getChatMessages` con `since` = `serverTime` guardado) y `refetchIntervalInBackground: false`; verificar con tests de vitest (carga inicial guarda serverTime; mensajes nuevos se agregan)
- [x] 3.2 Implementar el formulario de envío (`name`, `email` opcional, `body`) con `sendChatMessage`, validación de campos vacíos y refetch tras enviar; verificar con tests de vitest (envío inválido no dispara POST)
- [x] 3.3 Implementar el contador de oyentes activos (`getChatOnline` con refetch 30s) y degradación silenciosa; verificar con `npm run typecheck`

## 4. Integración en templates

- [x] 4.1 Agregar `PollsSection` y `ChatSection` a `ContentSections` (encuestas al inicio si hay activas; chat al final) y verificar con `npm run build:client -- fusionaustral` que compila
- [x] 4.2 Verificar en navegador que las secciones respetan las variables CSS de ambos templates

## 5. Verificación de integración

- [x] 5.1 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build:client -- fusionaustral` y confirmar que pasan
- [x] 5.2 Smoke en navegador: verificar que la sección de encuestas aparece solo con encuestas activas (y voto anti-duplicado funciona), el chat muestra mensajes y permite enviar, y el contador de oyentes aparece; verificar resiliencia al desconectar la red
