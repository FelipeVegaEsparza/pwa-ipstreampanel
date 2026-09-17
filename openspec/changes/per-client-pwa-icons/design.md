## Context

Ver `proposal.md` - Why. Estado actual relevante:

- `scripts/build-client.mjs` ejecuta `vite build --mode <clientName>` con `VITE_CLIENT_ID`/`VITE_CLIENT_NAME`; `vite.config.ts` no define `publicDir`, por lo que Vite usa `public/` para todos.
- Los iconos compartidos viven en `public/` (`favicon.svg`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`) junto a `offline.html`.
- VitePWA genera el manifest con esos nombres fijos (`manifest.icons`, `includeAssets`).
- `scripts/new-client.mjs` crea `clients/<nombre>/client.json` y dispara el build de validación.

## Goals / Non-Goals

**Goals:**

- Que cada build de cliente pueda servir favicon e iconos PWA propios sin tocar `vite.config.ts` por cliente.
- No duplicar assets compartidos (`offline.html`, etc.) ni romper builds de clientes sin iconos propios.
- Mantener los nombres de archivo del manifest para no reconfigurar VitePWA.

**Non-Goals:**

- No generar PNG desde un logo (se acepta que el cliente provea los archivos).
- No cambiar `theme_color` ni colores por cliente.
- No implementar favicon dinámico en runtime (el manifest es estático y se resuelve en build).

## Decisions

### D1. Overlay en un publicDir temporal (no un publicDir por cliente completo)

El build copia `public/` a `node_modules/.tmp/public-<client>/` y encima copia `clients/<client>/icons/` si existe; luego usa ese directorio como `publicDir`. Alternativas: (a) que cada cliente tenga un `public/` completo - obliga a duplicar `offline.html` y demás y a mantenerlo en cada cliente; (b) copiar iconos dentro de `public/` antes del build - ensucia el repo y no es reproducible. El overlay evita duplicación y mantiene la herencia parcial. Se ubica fuera de `dist/` para no provocar avisos de Vite por `publicDir` dentro del `outDir` ni artefactos en el build.

### D2. Comunicación por `VITE_PUBLIC_DIR`

`build-client.mjs` pasa la ruta del publicDir fusionado por variable de entorno y `vite.config.ts` hace `publicDir: process.env.VITE_PUBLIC_DIR || 'public'`. Alternativa: que `vite.config.ts` derive la carpeta del cliente desde `mode` y `existsSync` - funciona, pero duplica en dos lugares la lógica de "dónde están los assets" y complica el fallback. La env mantiene una sola fuente de verdad en el script de build.

### D3. Nombres de archivo estables

El cliente debe usar los mismos nombres (`icon-192.png`, etc.) porque `manifest.icons` e `includeAssets` son estáticos. Así no hay que tocar la config de la PWA para personalizar.

### D4. Scaffold en `new-client.mjs`

Al crear un cliente, se copian los iconos compartidos a `clients/<nombre>/icons/` como punto de partida editable. Si el usuario no los toca, el resultado es idéntico al comportamiento actual.

### D5. Verificación por build

La personalización se verifica construyendo un cliente con un `favicon.svg` propio y comprobando que el archivo presente en `dist/<cliente>/` es el del cliente, y que un asset compartido (`offline.html`) sigue copiándose.

## Risks / Trade-offs

- [El `publicDir` temporal debe limpiarse incluso si el build falla] → Se gestiona con `try/finally` en `build-client.mjs`.
- [Un cliente puede olvidar todos los PNG y solo cambiar el SVG] → Es válido (herencia parcial); `includeAssets` sigue encontrando los PNG heredados.
- [En Docker el temporal se crea bajo `node_modules/.tmp`] → `node_modules` existe tras `npm ci`; el directorio se limpia al final.
- [Nombres de icono distintos romperían el manifest] → Documentado en `docs/deploy.md` y en la spec.
