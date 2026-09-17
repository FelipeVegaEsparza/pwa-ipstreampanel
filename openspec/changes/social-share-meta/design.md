## Context

Ver `proposal.md` - Why. Estado actual relevante:

- `index.html` tiene metadatos genéricos (`<title>IPStream PWA</title>`) sin `og:*`.
- `scripts/build-client.mjs` ya conoce el `clientId`/`name` y ejecuta `vite build --mode <cliente>` con env `VITE_CLIENT_ID`/`NAME`.
- `vite.config.ts` no transforma el HTML.
- La API `basic-data` es pública, con CORS, y entrega `projectName`, `projectDescription`, `logoUrl`, `coverUrl`, `websiteUrl`.
- Los crawlers de WhatsApp/Facebook/X no ejecutan JavaScript: solo ven el HTML servido.

## Goals / Non-Goals

**Goals:**

- Que cada build tenga `og:title`, `og:description`, `og:image` y `twitter:*` con la identidad de la radio.
- No agregar infraestructura (nada de SSR ni servicios externos).
- Degradar sin romper el build si la API falla.
- Poder testear el escapado y la inyección.

**Non-Goals:**

- Preview por artículo (noticias): el mismo `index.html` sirve todas las rutas; requiere SSR/prerender.
- Cambiar el runtime de la app o los metadatos dinámicos de la pestaña (`useDocumentTitle`).
- Soportar crawlers que sí ejecutan JS.

## Decisions

### D1. Inyección en build time (no en runtime)

Los crawlers leen el HTML crudo, así que inyectar por `useEffect` no sirve. Se genera en el build. Alternativa considerada: SSR/prerender - inviable para una SPA estática servida por nginx sin agregar infraestructura.

### D2. Datos del API obtenidos por `build-client.mjs`

El script hace `fetch` a `basic-data` antes del build y pasa los datos al proceso de Vite como un único `VITE_OG_JSON` (JSON serializado). Alternativa: variables separadas (`VITE_OG_TITLE`, etc.) - más frágil por caracteres especiales/saltos de línea y más variables. El JSON se parsea en el plugin.

### D3. Helper compartido `src/core/seo/ogMeta.ts`

`escapeHtml`, `renderOgMeta` e `injectOgMeta` viven en un módulo TS que importa `vite.config.ts` y que se puede testear con Vitest. Alternativa: lógica inline en la config - no testeable. La lógica de red (fetch) queda solo en `build-client.mjs`.

### D4. Marcador `<!-- og-meta -->`

`index.html` incluye el marcador en `<head>`; `injectOgMeta` lo reemplaza por los tags. Si el marcador no existe, inserta antes de `</head>` como respaldo. El plugin además fija `<title>` con el nombre de la radio.

### D5. Preferencia de imagen y absolutos

Imagen = `coverUrl` → `logoUrl` → `{siteUrl}/icon-512.png` → omitir. Si la URL del API es relativa (`/api/uploads/...`) se prepone `https://panelipstream.cl`. Esto se calcula en `build-client.mjs` y se pasa ya resuelto en el JSON.

### D6. `siteUrl` opcional en `client.json`

`build-client.mjs` usa `clientConfig.siteUrl || basicData.websiteUrl` para `og:url` y para el fallback de imagen. Documentado en `docs/deploy.md`.

## Risks / Trade-offs

- [El build depende de la red para obtener los metadatos] → `fetch` con timeout y `try/catch`; ante fallo se usa `name` de `client.json` y se omiten campos.
- [Un valor con caracteres especiales podría romper el HTML] → `escapeHtml` en todos los atributos `content`.
- [El `og:image` podría no existir o no ser 1200x630] → Se prefiere la portada; si no hay imagen se omite el tag sin fallar.
- [Preview por noticia no soportado] → Documentado como no-objetivo; se abordaría con SSR/prerender en un cambio aparte.
