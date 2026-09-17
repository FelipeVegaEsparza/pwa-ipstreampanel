## Context

Ver `proposal.md` - Why. Estado actual relevante:

- `index.html` deja `<div id="root"></div>` vacío: antes de ejecutar JS no hay nada.
- `App` resuelve el tenant de forma síncrona (build) y monta `TemplateSlot` con `templateId={data?.selectedTemplate}`. Mientras no hay `data`, `getTemplate(undefined)` cae al default `minimalista` y ese template se renderiza; al llegar datos cambia al real.
- El build ya obtiene `basic-data` y calcula una imagen absoluta (cover→logo) para Open Graph en `build-client.mjs` / el plugin `ipstream-og-meta`.

## Goals / Non-Goals

**Goals:**

- Eliminar el flash blanco previo al JS y el flash del template por defecto.
- Usar la portada del cliente como imagen del splash en ambos momentos.
- No modificar los templates individuales.

**Non-Goals:**

- Splash del sistema operativo al abrir la PWA instalada (Android/iOS): no es controlable por HTML.
- Precargar/bloquear hasta que la portada descargue (el splash se muestra aunque la imagen tarde; si falla, queda el fondo neutro).
- Cambiar el contrato del API.

## Decisions

### D1. Dos capas de splash

(a) **Estático en `index.html`**: un bloque dentro de `#root` que React reemplaza al montar; cubre el hueco antes de que corra JS. (b) **Loader en React**: `LoadingScreen` con la misma imagen, mientras se cargan los datos. Alternativa: solo el loader React - deja el flash blanco inicial.

### D2. Imagen del splash reutilizando la lógica existente

`build-client.mjs` ya resuelve la imagen (cover→logo) para Open Graph; se expone además como `VITE_SPLASH_IMAGE` (env `VITE_*`, disponible en el cliente). El splash estático lo inyecta un plugin de Vite (`ipstream-splash`) con el mismo valor, vía `injectSplash`. Alternativa: exponer todo `VITE_OG_JSON` al cliente - filtra descripción y datos innecesarios.

### D3. Gate del template en `TenantApp`

`TenantApp` muestra `<LoadingScreen/>` cuando `isLoading && !data`, antes de montar `<Routes>`/`TemplateSlot`. Así el template se monta solo con `selectedTemplate` conocido. Los hooks (`usePwaRegistration`, `useDocumentTitle`) se mantienen antes de cualquier return condicional para no romper las reglas de hooks. El error (`isError && !data`) sigue priorizando `ErrorScreen`.

### D4. Helper `src/core/seo/splash.ts`

`renderSplash({image, name})` e `injectSplash(html, input)` (reemplaza `<!-- app-splash -->`), con escape HTML, testeables con Vitest. El plugin solo provee los datos.

### D5. Estilos

El splash estático define su CSS inline en `index.html` (no hay CSS module disponible antes de JS). `LoadingScreen.module.css` replica el mismo look para que la transición sea imperceptible. Ambos usan un overlay oscuro sobre la portada para legibilidad del nombre y el spinner.

## Risks / Trade-offs

- [La portada es una URL externa y puede tardar] → El splash se muestra con fondo neutro y aparece la imagen cuando carga; no bloquea.
- [React debe reemplazar el splash estático sin dejar residuos] → Se coloca dentro de `#root`, que `createRoot().render()` reemplaza al montar.
- [El gate podría retrasar la primera pintura útil] → Solo se muestra splash mientras no hay datos; con React Query la respuesta suele ser rápida y el splash es preferible al flash incorrecto.
- [En dev no hay portada] → `VITE_SPLASH_IMAGE` ausente ⇒ splash neutro; no rompe.
