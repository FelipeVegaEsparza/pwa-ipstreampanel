## Context

Ver proposal.md - Why. El sitio es una PWA multi-tenant: la home de cada template renderiza `ContentSections` (pila data-driven) dentro del `Outlet` del template, y cada template provee variables `--content-*` para su contenido (ver `ContentSections.tsx`, `sections.ts`, módulos en `src/modules/*`). `minimalista` no monta esa pila en la home (home = reproductor now-playing). El tenant activo (`clientId`, base URL) se expone con `useTenant()`/`getPublicApiBase`; los POST públicos actuales (`votePoll`, `sendChatMessage`, `registerPwaInstall`) viven en `src/core/api/index.ts` y usan `request()` de `src/core/api/client.ts` (reintentos configurables, sin caché para POST). El contrato del endpoint `POST /api/public/{clientId}/contact-messages` viene en la guía de integración de IPStream Panel (201/400/404/429/500; body `{name,email,phone,message}`).

## Goals / Non-Goals

**Goals:**
- Un módulo de contacto reutilizable y autocontenido que publique el mensaje una sola vez contra el endpoint público del tenant activo, con validación previa y mensajes diferenciados por respuesta.
- Aparecer al final de la home para todos los templates que muestran contenido, salvo `minimalista`, sin tocar los componentes de cada template.
- Look consistente con las secciones de contenido del template activo (vía variables `--content-*`).

**Non-Goals:**
- Cambios en el backend del panel ni en `instruccionesapi.md`.
- Autenticación, campo `subject`, ni campos extra al contrato (se ignoran en el servidor).
- Encolado/offline de mensajes.
- Mapeo de errores 400 a un campo específico (el contrato no expone un shape por campo).

## Decisions

### D1. Módulo autocontenido `src/modules/contact`
Se crea `ContactSection.tsx` (+ CSS module + tests) con estado local del formulario y `clientId` desde `useTenant()`, siguiendo el patrón de `polls`/`social`. El envío no depende de datos del cliente (`basicData`, etc.), por lo que la sección no participa del orden data-driven ni de `sectionHasContent`.
*Alternativa*: agregar lógica al shell de cada template — duplica integración y desvía la lógica fuera de un módulo testeable.

### D2. Integración al final del stack de la home
`ContentSectionStack` (en `ContentSections.tsx`) renderiza la `<ContactSection/>` después de las secciones ordenadas, solo cuando `selectedTemplate !== 'minimalista'`. Como la pila se monta únicamente en la home (ruta índice), la sección aparece al final de la home en los 8 templates de contenido. El guard explícito hace el comportamiento visible y testeable, aunque `minimalista` ya no monta la pila.
*Alternativa*: incluir `contact` en el orden de `sections.ts` — no aplica: la sección no es data-driven y no debe listarse en menús/anclas de navegación.

### D3. Envío único vía helper del API
Se agrega `sendContactMessage(clientId, input)` en `src/core/api/index.ts` junto a los otros POST, usando `request(..., { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(...), retries: 0 })`. `retries: 0` evita duplicar una consulta en el panel si un 5xx/timeout transitorio ocurre tras procesarse el envío (la guía no define idempotencia). El helper devuelve un resultado tipado (no lanza para 4xx/5xx) para que la UI distinga 400/429/404/500/red:
`{status:'sent'} | {status:'validation-error', error} | {status:'rate-limited'} | {status:'not-found'} | {status:'server-error'} | {status:'network-error'}`.
El URL se arma con `getPublicApiBase(clientId) + '/contact-messages'`, reutilizando la base/tenant existentes (sin hardcodear clientId).

### D4. Validación nativa del navegador como validación de cliente
Los campos usan `required`, `maxLength` (120/254/40/2000) y `type="email"`/`type="tel"`: el navegador bloquea el submit inválido con feedback inmediato, espejando las reglas del servidor sin duplicar lógica de mensajes. Se hace `form.reset()` tras `201`. Ante `400`, se muestra el texto `error` devuelto por el API como mensaje a nivel de formulario (supuesto: el contrato no individualiza el campo en `error`).
*Alternativa*: validación manual por campo con `noValidate` — más código y mensajes que la validación nativa ya provee; se evita.

### D5. Estados, anti-spam y accesibilidad
Mientras se envía el botón queda `disabled` con texto "Enviando…" (evita dobles envíos). Los mensajes de éxito/error se muestran con `role="status"`/`aria-live="polite"`. Tras `429` se muestra el aviso de la guía y el botón vuelve a habilitarse (el servidor cuenta los intentos por IP en 10 min; no se impone un temporizador cliente). Tras éxito o error, el botón se rehabilita para reintentar.

### D6. Estilos por variables de contenido
El CSS module usa `var(--content-*)` (tarjeta, texto, borde, acento) con fallbacks, de modo que la sección hereda automáticamente la paleta que cada template define para su contenido; `tokens.css` ya centraliza radios/espaciado. No se requieren estilos por template.

## Risks / Trade-offs

- [Duplicado si el servidor procesa pero la respuesta se pierde] → envío de un solo intento (`retries:0`) + botón deshabilitado durante el envío; riesgo residual bajo y asumido.
- [Rate limit cuenta intentos inválidos] → la validación nativa evita 400/429 innecesarios; ante `429` se muestra mensaje claro y se habilita el reintento (el servidor rechazará hasta que pasen los 10 min).
- [Shape del error 400 sin campo] → se muestra el texto `error` del API a nivel formulario; no se inventa un mapeo campo-mensaje.
- [Sección siempre visible en templates de contenido] → es el comportamiento pedido; no depende de que el panel publique datos.

## Migration Plan

1. Agregar `sendContactMessage` + tests en `src/core/api`.
2. Crear `src/modules/contact/ContactSection.tsx`, CSS y tests.
3. Append en `ContentSectionStack` con guard de `minimalista` y ajustar/crear tests de `ContentSections`.
4. Verificar `npm run typecheck`, `npm run lint`, `npm run test`, `npm run build`; smoke manual: enviar con un clientId real y confirmar `201` (o `429`) y que la consulta aparece en `/dashboard/contact-messages`.
