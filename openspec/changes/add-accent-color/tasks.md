# Tasks

## 1. Datos y derivación de color

- [x] 1.1 Agregar `accentColor?: string | null` al tipo `FullClientData` (`src/core/types/index.ts`); verificar con `npm run typecheck`.
- [x] 1.2 Implementar `normalizeAccentColor(value)` (valida `#RRGGBB` y devuelve `null` si es inválido) y `deriveAccent(hex)` (hover, soft, contraste) en `src/core/color/`; verificar con tests unitarios de claro/oscuro/ inválido y con `npm run test`.

## 2. Tokens canónicos en los templates

- [x] 2.1 Definir los tokens canónicos y hacer que los templates de un solo acento (`app`, `moderno`, `moderna`, `tradicional`, `playlist`, `moderno2`) consuman `var(--brand-accent, <default>)` y derivadas; verificar con `npm run build`.
- [x] 2.2 Ajustar los templates bi-tono (`petroleo`, `blue`) para consumir el canónico solo en el rol primario, conservando el secundario; verificar con `npm run build`.
- [x] 2.3 Ajustar los templates de acento claro (`covered`, `minimalista`) para consumir el canónico en `--tpl-accent` y `--tpl-accent-text`; verificar con `npm run build`.
- [x] 2.4 Auditar `src/templates/*/*.module.css` y reemplazar los colores derivados del acento hardcodeados (rgba en gradientes/sombras) por `--brand-accent-soft`; verificar con `npm run build`.

## 3. Inyección en el shell

- [x] 3.1 Envolver el template en un contenedor que aplique los tokens derivados desde `clientData.accentColor` (solo si es válido); verificar con test (con color setea los tokens; sin color no los setea).
- [x] 3.2 Verificar que un `accentColor` inválido o `null` no aplique tokens y conserve los defaults del template; verificar con test.

## 4. Integración y verificación

- [x] 4.1 Test de integración: con `accentColor` válido, un componente compartido (p. ej. el resaltado de titulares) usa el acento; sin color mantiene el default; verificar con `npm run test`.
- [x] 4.2 Documentar el contrato `accentColor`, la derivación y el fallback en `docs/`; verificar por revisión del archivo.
- [x] 4.3 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test` y `npm run build`; verificar que pasan sin errores.
- [x] 4.4 Validar el cambio con `openspec validate add-accent-color` sin issues.

## 5. Protagonismo del acento

- [x] 5.1 Agregar un flag de acento en `useAccentTheme` y una marca de acento en los títulos de sección (visible solo con acento); verificar con `npm run build`.
- [x] 5.2 Aplicar el acento al borde superior del reproductor solo cuando hay acento; verificar con `npm run build`.
- [x] 5.3 Ejecutar `npm run lint`, `npm run typecheck`, `npm run test`, `npm run build` y `openspec validate add-accent-color`.
