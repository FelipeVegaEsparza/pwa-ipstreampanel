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

### D2. Imagen del splash: asset local

El splash usa `/icon-512.png`, un asset local que siempre existe (icono propio del cliente o el compartido de `public/`, gracias al merge del build). Carga al instante, a diferencia de la portada del API (URL remota) que no alcanzaba a aparecer. El helper `renderSplash` acepta una imagen y por defecto usa `/icon-512.png`; un cliente podría reemplazar ese icono con su logo. Alternativa descartada: la portada remota (`coverUrl`) como fondo - lenta y con flash de fondo neutro.

### D3. Gate del template en `TenantApp`

`TenantApp` muestra `<LoadingScreen/>` cuando `isLoading && !data`, antes de montar `<Routes>`/`TemplateSlot`. Así el template se monta solo con `selectedTemplate` conocido. Los hooks (`usePwaRegistration`, `useDocumentTitle`) se mantienen antes de cualquier return condicional para no romper las reglas de hooks. El error (`isError && !data`) sigue priorizando `ErrorScreen`.

### D4. Helper `src/core/seo/splash.ts`

`renderSplash({image, name})` e `injectSplash(html, input)` (reemplaza `<!-- app-splash -->`), con escape HTML, testeables con Vitest. El plugin solo provee los datos.

### D5. Estilos

El splash estático define su CSS inline en `index.html` (no hay CSS module disponible antes de JS). `LoadingScreen.module.css` replica el mismo look para que la transición sea imperceptible. Ambos muestran el logo del cliente centrado sobre el fondo de marca, con el nombre y el spinner.

### D6. Tiempo mínimo visible

`TenantApp` mantiene el splash hasta que se cumplan **ambas** condiciones: datos disponibles y un tiempo mínimo desde el montaje (`SPLASH_MIN_MS`, 1200 ms). Alternativa descartada: retraso artificial fijo tras cargar - penaliza a quien ya esperó. El mínimo solo aplica a la primera carga del tenant, no a refetches (con datos ya presentes `isLoading` es false y el gate no vuelve a mostrar el splash).

## Risks / Trade-offs

- [La portada es una URL externa y puede tardar] → El splash se muestra con fondo neutro y aparece la imagen cuando carga; no bloquea.
- [React debe reemplazar el splash estático sin dejar residuos] → Se coloca dentro de `#root`, que `createRoot().render()` reemplaza al montar.
- [El gate podría retrasar la primera pintura útil] → Solo se muestra splash mientras no hay datos; con React Query la respuesta suele ser rápida y el splash es preferible al flash incorrecto.
- [En dev no hay portada] → `VITE_SPLASH_IMAGE` ausente ⇒ splash neutro; no rompe.
