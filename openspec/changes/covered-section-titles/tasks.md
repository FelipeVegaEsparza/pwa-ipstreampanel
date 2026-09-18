## 1. Barra lateral configurable en `Section`

- [x] 1.1 Agregar `.title::before` (barra de acento) y las variables `--section-bar-w`, `--section-bar-h`, `--section-bar-gap`, `--section-bar-c`, `--section-bar-radius` con defaults apagados en `src/ui/Section.module.css`. Verificar con `npx vitest run src/ui/Section.test.tsx`.
- [x] 1.2 Confirmar que ningún template cambia su layout de títulos con el default apagado: verificar con `npm run test` (incluye `templates.render.test.tsx`).

## 2. Acento de marca en `covered`

- [x] 2.1 Definir en `.page` de `src/templates/covered/CoveredTemplate.module.css` las variables de título (`--section-title-color/size/weight/spacing`), barra (`--section-bar-*`) y regla (`--section-rule-*`) según design.md - D2. Verificar visualmente que el título muestra barra a la izquierda y regla bajo el texto.
- [x] 2.2 Revisar el resultado en viewport móvil y de escritorio (barra alineada con la línea de texto, regla sin indentación). Verificar visualmente.

## 3. Verificación final

- [x] 3.1 Ejecutar `npm run lint` y `npm run test` completos y `openspec validate covered-section-titles`; verificar que todo pase sin errores.
