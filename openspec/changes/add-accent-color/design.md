# Design: add-accent-color

## Context

Ver `proposal.md - Why`. Hoy cada template define su acento en su propio
`.page { --content-accent: ...; --color-primary: ...; --card-accent: ... }`
(`src/templates/*/*.module.css`), con nombres de variable inconsistentes y
algunos valores derivados hardcodeados (p. ej. gradientes `rgba(...)` en
`playlist`). Los componentes compartidos (`PlayerBar`, `TrackProgress`,
`Section`, `GcBar`) leen `--color-primary` / `--section-highlight-color` /
`--content-accent`. Los datos del cliente llegan por `useFullClientData` y hoy
no incluyen ningún color.

## Goals / Non-Goals

**Goals:**

- Aplicar un `accentColor` nullable, en runtime, sobre cualquier template.
- Resolver con un solo hex, derivando variantes y contraste en el frontend.
- Mantener el color propio del template como fallback cuando no hay acento.
- Separar datos de API, lógica de derivación y UI.

**Non-Goals:**

- No construir un sistema de theming completo (fondos, tipografías, modo claro).
- No agregar UI de selección de color (es del panel).
- No cambiar la selección de template ni la resolución de `clientId`.

## Decisions

### 1. Origen del color: `accentColor` de la API, aplicado en runtime

Se agrega `accentColor?: string | null` a los datos del cliente y se aplica en
el shell, sin recompilar. Alternativas descartadas: bakear el color en el build
por cliente (`client.json`) exige redesplegar por cada cambio, contra el
precedente de `selectedTemplate`; `localStorage` es un ajuste por dispositivo,
no por radio.

### 2. Tokens canónicos con fallback (por qué no alcanza con inyectar arriba)

Los templates definen las variables en `.page` (descendiente), así que un
override en un ancestro sería pisado:

```
WRAPPER  style="--content-accent: X"     (ancestro)
   v
 .page { --content-accent: #ff9500 }     (GANA; override ignorado)
```

La solución es un token canónico que el template consume con fallback:

```
WRAPPER  style="--brand-accent: X"       (ancestro, solo si hay color)
   v
 .page { --content-accent: var(--brand-accent, <default del template>) }
```

Tokens canónicos: `--brand-accent`, `--brand-accent-hover`,
`--brand-accent-soft` (rgba tenue), `--brand-accent-contrast` (texto sobre el
acento). Cada template mapea sus roles actuales a estos con su valor como
fallback. Se derivan valores concretos en JS (hex/rgba), sin depender de
`color-mix()` en el punto de uso.

### 3. Derivación de variantes en una función pura

`deriveAccent(hex)` en `src/core` devuelve `{ accent, hover, soft, contrast }`:
- `hover`: acento oscurecido ~10% (espacio HSL).
- `soft`: `rgba(accent, 0.15)` para fondos tenues y gradientes.
- `contrast`: `#ffffff` o `#000000` según luminancia relativa (WCAG).

Es lógica pura y testeable; la UI solo consume los valores.

### 4. Inyección en el shell, sin duplicar consumo de API

El acento se calcula una vez a partir de `clientData.accentColor` y se aplica
como `style` en un contenedor que envuelve al template (`TemplateSlot` o el
contenedor del template). Si el color es `null`/inválido, no se setean tokens y
todo cae a los defaults del template. No se agrega lógica de API nueva: se reusa
el `clientData` ya presente en el árbol.

### 5. Mapeo por tipo de template (confirmado #4a)

- Un solo acento (`app`, `moderno`, `moderna`, `tradicional`, `playlist`,
  `moderno2`): sus roles de acento pasan a `var(--brand-accent, ...)`.
- Bi-tono (`petroleo`, `blue`): solo el rol primario consume el token canónico;
  el secundario se mantiene propio del template.
- Acento claro (`covered`, `minimalista`): `--tpl-accent` y `--tpl-accent-text`
  consumen el token y su contraste.
- Valores hardcodeados derivados del acento (gradientes/sombras) se reemplazan
  por `--brand-accent-soft` para que sigan el color.

## Risks / Trade-offs

- [El panel aún no expone `accentColor`] → El frontend queda inerte (usa los
  defaults) hasta que el panel lo entregue; no rompe nada.
- [Color libre y accesibilidad] → El contraste texto-sobre-acento se deriva por
  luminancia; si un color es muy oscuro y se usa como **texto sobre fondo
  oscuro**, puede perder legibilidad. Se mitiga recomendando colores con
  contraste en el panel; evaluar un `--brand-accent-readable` en el futuro.
- [Colores hardcodeados en gradientes/sombras] → Hay que auditar cada template
  para reemplazarlos por tokens; si alguno queda, ese detalle no seguirá al
  acento.
- [Estética en bi-tono/acento claro] → Un color arbitrario puede desentonar con
  esos diseños; es el costo aceptado de "color libre".
- [Rendimiento/PWA] → La derivación es trivial (una vez por render) y las
  custom properties son baratas; no hay recompilación. Offline: el color viene
  de los datos cacheados del cliente.

## Migration Plan

- Cambio aditivo: sin migración de datos. Los clientes sin `accentColor`
  conservan su aspecto actual.
- Despliegue: primero el frontend (inerte), luego el panel expone el campo.
- Rollback: quitar el contenedor que inyecta los tokens devuelve todo a los
  defaults de cada template.

## Open Questions

- ¿El panel expondrá el campo solo en la raíz de `GET /api/public/{clientId}` o
  también en `/basic-data`? (No cambia el enfoque del frontend.)
- ¿Conviene un `--brand-accent-readable` para acento usado como texto sobre
  fondos oscuros? (Deferible; no cambia specs ni tareas.)
