## 1. Helper de API

- [x] 1.1 Agregar en `src/core/api/index.ts` los tipos `ContactMessageInput` (`name`, `email`, `phone`, `message`) y el resultado tipado `ContactSubmitResult`, y la función `sendContactMessage(clientId, input)` que hace `request(getPublicApiBase(clientId) + '/contact-messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input), retries: 0 })` y mapea la respuesta a `sent` (201), `validation-error` con `error` del body (400), `rate-limited` (429), `not-found` (404), `server-error` (500/otro) y `network-error` (cuando `request` lanza). Verificar con `npm run typecheck`.
- [x] 1.2 Escribir tests unitarios de `sendContactMessage` (mock global de `fetch`) que cubran: body con exactamente los 4 campos y URL correcta, un solo intento (sin reintento) ante 5xx/error de red, y el mapeo de cada status (201/400/429/404/500/red). Verificar con `npm run test` incluyendo el nuevo caso.

## 2. Módulo ContactSection

- [x] 2.1 Crear `src/modules/contact/ContactSection.tsx`: formulario con estado local, campos `name` (required, maxLength 120), `email` (type email, required, maxLength 254), `phone` (type tel, required, maxLength 40) y `message` (required, maxLength 2000), sin campo de asunto. El submit valida con las restricciones nativas, deshabilita el botón con "Enviando…" mientras la solicitud está en curso, llama una sola vez a `sendContactMessage(clientId, ...)` con `clientId` de `useTenant()`, hace `form.reset()` y muestra mensaje de éxito en `sent`, y mensajes diferenciados para `rate-limited` ("Demasiados intentos. Intenta de nuevo en unos minutos."), `validation-error` (texto del API) y los demás como error genérico. Verificar con `npm run typecheck`.
- [x] 2.2 Crear `src/modules/contact/ContactSection.module.css` con estilos basados en variables `var(--content-*)` (con fallback) y `tokens.css`, inputs/botón accesibles y layout responsive (una columna en móvil). Verificar visualmente en `npm run dev`.
- [x] 2.3 Escribir tests de `ContactSection` (testing-library): envío válido dispara un único POST con los 4 campos y muestra el mensaje de éxito y limpia el formulario; un `sendContactMessage` que devuelve `rate-limited` muestra el aviso anti-spam; botón deshabilitado mientras hay una solicitud en curso. Verificar con `npm run test`.

## 3. Integración en la home

- [x] 3.1 Renderizar `<ContactSection/>` al final de `ContentSectionStack` en `src/modules/content/ContentSections.tsx`, solo cuando `clientData?.selectedTemplate` no sea `minimalista`. Verificar que la sección queda tras las secciones ordenadas y no se agrega al orden/menú de `sections.ts`.
- [x] 3.2 Ajustar/agregar tests en `src/modules/content/ContentSections.test.tsx`: con un template distinto de `minimalista` la sección de contacto aparece después de las secciones; con `selectedTemplate: 'minimalista'` no se renderiza. Verificar con `npm run test`.

## 4. Verificación final

- [x] 4.1 Ejecutar `npm run typecheck`, `npm run lint`, `npm run test` y `npm run build` y verificar que todo pasa.
- [ ] 4.2 Smoke manual contra el API: enviar el formulario en un cliente real (p. ej. `clients/fusionaustral/client.json`) y comprobar `201` (o `429` por rate limit) y que el mensaje aparece en el panel en `/dashboard/contact-messages` con estado nuevo; en `minimalista` confirmar que la sección no aparece en la home.
