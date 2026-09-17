## 1. Helper de metadatos

- [x] 1.1 Crear `src/core/seo/ogMeta.ts` con `escapeHtml`, `renderOgMeta(input)` e `injectOgMeta(html, input)` (reemplaza `<!-- og-meta -->` o inserta antes de `</head>`, y fija `<title>`). Verificar con `npm run typecheck`.
- [x] 1.2 Escribir `src/core/seo/ogMeta.test.ts`: escapado de comillas/`&`/`<`, omisión de tags sin valor, `og:url` solo si hay URL, e inyección con y sin marcador. Verificar con `npm run test`.

## 2. HTML y plugin de Vite

- [x] 2.1 Agregar `<!-- og-meta -->` en `<head>` de `index.html` y un `<title>` por defecto. Verificar por inspección.
- [x] 2.2 En `vite.config.ts`, agregar un plugin con `transformIndexHtml` que lea `process.env.VITE_OG_JSON`, lo parsee y llame a `injectOgMeta`; sin env (dev) inyecta un mínimo con `VITE_CLIENT_NAME`. Verificar con `npm run build`.

## 3. Datos de cliente en el build

- [x] 3.1 En `scripts/build-client.mjs`, consultar `GET {API}/api/public/{clientId}/basic-data` con timeout y `try/catch`, resolver imagen absoluta (cover→logo→siteUrl/icon-512) y armar `VITE_OG_JSON`. Verificar con `npm run build:client -- radio-prueba`.
- [x] 3.2 Soportar `siteUrl` opcional en `client.json` para `og:url` y fallback de imagen. Verificar con el ejemplo de `radio-prueba`.

## 4. Documentación y ejemplo

- [x] 4.1 Agregar `siteUrl` a `clients/radio-prueba/client.json` como ejemplo y documentar en `docs/deploy.md` los metadatos, `siteUrl` y la limitación por noticia.
- [x] 4.2 Confirmar por inspección que `dist/radio-prueba/index.html` contiene `og:title`, `og:description`, `og:image` y `<title>` con el nombre, y que un cliente cuya API falle igual compila.

## 5. Verificación final

- [x] 5.1 Ejecutar `npm run typecheck && npm run lint && npm run test && npm run build` y confirmar que todo pasa.
