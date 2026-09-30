# Proposal: add-accent-color

## Why

Hoy cada template define su color de acento fijo en el CSS, así que un cliente no
puede personalizar el color destacado de su sitio: dos radios con la misma
plantilla se ven idénticas. Se quiere que el cliente elija, además del template,
un **color de acento libre** desde el panel, y que el sitio lo aplique en
runtime sin recompilar, manteniendo el color propio del template como fallback.

**Objetivos**

- Leer `accentColor` (hex `#RRGGBB`, nullable) de la API pública del panel.
- Aplicar ese color en runtime a **cualquier** template seleccionado.
- Derivar las variantes necesarias (hover, versión tenue y color de texto sobre
  el acento) a partir de un único hex.
- Degradar al color propio del template cuando `accentColor` sea `null`,
  inválido o ausente, sin romper el diseño.

**No objetivos**

- No se agrega el selector de color al panel: eso es responsabilidad del panel
  (dependencia externa; el contrato acordado es un campo `accentColor`).
- No se cambia la selección de template ni el flujo de `selectedTemplate`.
- No se introducen temas claro/oscuro nuevos ni un sistema de theming completo.
- No se inventan endpoints ni campos fuera del `accentColor` acordado.

## What Changes

- Se agrega la capacidad `theme-color`: lectura de `accentColor`, aplicación en
  runtime mediante tokens canónicos (`--brand-accent` y derivadas) y derivación
  de variantes y contraste.
- Los templates pasan a consumir el acento canónico con su color actual como
  fallback, de modo que el override aplique realmente dentro de `.page`.
- El shell aplica el `accentColor` del cliente (solo si está presente) por
  encima del template, sin afectar a los clientes sin color.
- Comportamiento por tipo de template: los de un solo acento se reemplazan
  completos; los bi-tono (`petroleo`, `blue`) reemplazan el primario y conservan
  el secundario; los de acento claro (`covered`, `minimalista`) reemplazan su
  acento claro por el elegido.
- Se documenta el contrato de API requerido al panel como dependencia externa.

## Capabilities

### New Capabilities

- `theme-color`: color de acento por cliente leído de la API, aplicado en
  runtime a cualquier template, con derivación de variantes y fallback al color
  propio de la plantilla.

### Modified Capabilities

- `templates`: los templates pasan a consumir el acento canónico
  (`--brand-accent` y derivadas) con su color actual como fallback, para que el
  acento por cliente se aplique en todos los diseños.

## Impact

- Código: shell de la app (`App`/`TemplateSlot`) para inyectar el acento, CSS de
  cada template (`src/templates/*/*.module.css`) para consumir los tokens
  canónicos, y utilidades de derivación de color.
- API: depende de que el panel exponga `accentColor: string | null` en
  `GET /api/public/{clientId}` (y recomendado en `/basic-data`). Mientras no
  esté, el sitio funciona igual usando el color por defecto de la plantilla.
- Specs: `theme-color` (nueva) y `templates` (modificada).
