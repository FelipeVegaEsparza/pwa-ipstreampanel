## Context

Todos los títulos de sección los renderiza el componente compartido `Section` (`src/ui/Section.tsx` + `Section.module.css`), parametrizado por variables CSS (`--section-title-*`, `--section-rule-*`). Cada template las ajusta en su propio scope. `covered` no define ninguna, así que hereda el default (1.1rem, peso 700, color `--content-muted` #5f6672, sin regla), mientras que los templates con carácter sí usan acento. Ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Títulos de sección de `covered` con acento de marca llamativo pero equilibrado: barra lateral + regla.
- Resolverlo con el sistema de variables existente, sin duplicar lógica ni condicionales por template en `Section`.

**Non-Goals:**
- No cambiar los títulos de otros templates.
- No cambiar el tamaño del bloque de sección, la estructura del DOM ni el comportamiento funcional.

## Decisions

### D1. Barra lateral como pseudo-elemento configurable en `Section`
Se agrega `.title::before` con `content: ''`, `display: inline-block` y variables `--section-bar-w` (default `0`), `--section-bar-h` (default `1.05em`), `--section-bar-gap` (default `0`), `--section-bar-c` (default `transparent`) y `--section-bar-radius` (default `2px`). Con `width: 0` y sin margen, los templates que no lo configuran no ven cambios.

Alternativas descartadas:
- `border-left` sobre `.title`: desplaza la caja y arrastra la indentación de la regla `::after`.
- Selector descendiente desde `CoveredTemplate.module.css` (`main h2`): acopla el estilo a la estructura del DOM y es frágil ante refactors.

### D2. Acento de marca en `covered` vía variables
En `.page` de `CoveredTemplate.module.css` se definen:
- Texto: `--section-title-color: #17171c`, `--section-title-size: 0.85rem`, `--section-title-weight: 800`, `--section-title-spacing: 0.16em`.
- Barra: `--section-bar-w: 4px`, `--section-bar-gap: 10px`, `--section-bar-c: linear-gradient(180deg, #7c3aed, #a855f7)`.
- Regla: `--section-rule-w: 48px`, `--section-rule-h: 3px`, `--section-rule-c: linear-gradient(90deg, #7c3aed, #a855f7)`.

El texto en tinta oscura y el acento morado solo en barra/regla mantiene el equilibrio (se evita saturar de morado). `#7c3aed` sobre `#f4f5f7` supera el contraste AA para texto normal.

### D3. Alineación de la barra
`vertical-align: -0.12em` para centrar la barra respecto de la línea de texto sin alterar la altura de línea del título.

## Risks / Trade-offs

- [El `::before` inline-block desalinea la línea base] → `vertical-align` fijado y revisión visual en `covered`.
- [Efectos colaterales en otros templates al tocar `Section`] → default `--section-bar-w: 0` y `--section-bar-gap: 0`; los tests de templates existentes deben seguir pasando.
- [jsdom no evalúa bien CSS custom properties] → la verificación fina del acento es visual; se automatiza solo que los tests existentes no se rompan.
