## 1. Build con publicDir fusionado

- [x] 1.1 En `scripts/build-client.mjs`, copiar `public/` a `node_modules/.tmp/public-<cliente>/` y sobrescribir con `clients/<cliente>/icons/` si existe, pasando `VITE_PUBLIC_DIR` al build y limpiando el temporal con `try/finally`. Verificar con `npm run build:client -- radio-prueba`.
- [x] 1.2 En `vite.config.ts`, usar `publicDir: process.env.VITE_PUBLIC_DIR || 'public'`. Verificar con `npm run build` (usa `public/` por defecto) y con `npm run typecheck`.

## 2. Scaffold de clientes nuevos

- [x] 2.1 En `scripts/new-client.mjs`, crear `clients/<nombre>/icons/` copiando los 5 iconos compartidos como default. Verificar ejecutando `npm run new-client -- cliente-icon-test cmTESTICON0000000000001 "Cliente Icon Test"` en un clon temporal o revisando que el flujo crea la carpeta y el build pasa.

## 3. Ejemplo y documentación

- [x] 3.1 Agregar `clients/radio-prueba/icons/favicon.svg` con un SVG propio para demostrar el override parcial y verificar que `dist/radio-prueba/favicon.svg` es el del cliente mientras `offline.html` y los PNG heredan de `public/`.
- [x] 3.2 Documentar en `docs/deploy.md` la convención `clients/<nombre>/icons/`, los nombres obligatorios y la herencia parcial.

## 4. Verificación final

- [x] 4.1 Ejecutar `npm run typecheck && npm run lint && npm run test && npm run build` y confirmar que todo pasa.
- [x] 4.2 Confirmar que un cliente sin carpeta `icons/` compila con los iconos compartidos (fallback) y que el manifest generado referencia los mismos nombres.
