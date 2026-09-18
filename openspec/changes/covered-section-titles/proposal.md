## Why

En el template `covered`, los títulos de las secciones de contenido heredan los valores por defecto del componente `Section` (tamaño 1.1rem, color `--content-muted` #5f6672 y sin acento), por lo que se ven apagados y no comunican la identidad de la marca. El resto de templates con carácter (`app`, `blue`, `moderno`, `petroleo`) sí usan un acento de color en sus títulos. Se quiere que `covered` tenga títulos con acento de marca, llamativos pero equilibrados, sin afectar a los demás templates.

## What Changes

- Se agrega al componente compartido `Section` un acento de **barra lateral** configurable por variables CSS, con valor por defecto apagado (ancho `0`) para no alterar el layout de los templates que no lo usan.
- En el template `covered` se configuran las variables de título para: color de tinta oscura, tamaño/peso/tracking más definidos, una barra morada con gradiente a la izquierda del título y una regla de acento bajo el texto.
- El cambio aplica **solo a `covered`**; los demás templates conservan sus títulos actuales.
- No cambia la estructura del DOM ni el comportamiento funcional de las secciones.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `templates`: se agrega un requisito de presentación de los títulos de sección de `covered` con acento de marca (barra lateral + regla) usando las variables del componente `Section`.

## Impact

- Código: `src/ui/Section.module.css` (nuevo pseudo-elemento de barra con default apagado), `src/templates/covered/CoveredTemplate.module.css` (variables de título/acento).
- Tests: verificación de que los templates no afectados mantienen su layout y que los tests existentes de `covered`/`Section` siguen pasando; la verificación fina del acento es visual.
- Docs/specs: nuevo requisito en `openspec/specs/templates/spec.md`.
- Sin cambios de API, datos, dependencias ni endpoints.
