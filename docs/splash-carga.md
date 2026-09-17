# Splash de carga con la portada del cliente

Cómo se evita el flash al abrir la URL de una radio y qué muestra el splash.

## Qué problema resuelve

Sin esto, al abrir la app se veía:

1. Un instante en blanco antes de que cargara JavaScript.
2. El template por defecto (`minimalista`) y luego el template seleccionado en
   el panel, porque `selectedTemplate` todavía no había llegado.

El splash usa la portada del cliente y retiene el render del template hasta
conocer cuál es.

## Cómo opera (dos capas)

```
1) Splash estático (index.html, antes de JS)
   - plugin ipstream-splash inyecta `<!-- app-splash -->`
   - fondo = portada del cliente, overlay con nombre + spinner
   - React lo reemplaza al montar

2) Loader en React (mientras carga la API)
   - App muestra LoadingScreen mientras `isLoading && !data`
   - recién con datos se monta el template seleccionado
```

Ambas capas comparten el mismo look, así que la transición es imperceptible.

## Imagen usada

- Portada: `basicData.coverUrl`.
- Si no hay portada: logo (`basicData.logoUrl`).
- Si no hay ninguna: fondo neutro (`#1a1a2e`) con spinner.

La resolución la hace `build-client.mjs` (la misma que Open Graph) y la expone
como `VITE_SPLASH_IMAGE`. El splash estático la recibe por el plugin de Vite.

## Qué se muestra

- Nombre del cliente (`VITE_CLIENT_NAME`, del `client.json`).
- Spinner animado.
- La portada de fondo, con un overlay oscuro para legibilidad.

## Comportamiento del template

`TenantApp` no monta `<TemplateSlot>` hasta que hay datos; por eso no aparece el
template por defecto antes del seleccionado. Si la carga falla, se muestra la
pantalla de error (`ErrorScreen`), no el splash.

## Límites

- El splash del **sistema operativo** al abrir la PWA instalada (Android/iOS) es
  aparte: no lo controla el HTML. Android usa el manifest (íconos/colores) e iOS
  el `apple-touch-icon`.
- La portada es una URL externa: si tarda, el splash aparece igual con fondo
  neutro y la imagen se pinta cuando carga.

## Archivos involucrados

- `src/core/seo/splash.ts` — `renderSplash`/`injectSplash` (+ tests `splash.test.ts`).
- `vite.config.ts` — plugin `ipstream-splash`.
- `index.html` — marcador `<!-- app-splash -->` y CSS inline.
- `scripts/build-client.mjs` — expone `VITE_SPLASH_IMAGE`.
- `src/app/LoadingScreen.tsx` — loader en React.
- `src/app/App.tsx` — gate del template mientras no hay datos.
