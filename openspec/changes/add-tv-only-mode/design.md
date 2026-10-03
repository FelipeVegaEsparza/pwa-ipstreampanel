# Design: add-tv-only-mode

## Context

Ver `proposal.md - Why`. Hoy todos los templates asumen radio: montan
`useStreaming` / `useLiveRadio` y renderizan un hero now-playing y/o `PlayerBar`
aunque `radioStreamingUrl` sea `null`. La TV es aditiva: `TvSection` en el stack
de secciones o un botón→modal en `minimalista`. El cliente TV-only real
(`meptv`) tiene `services: "tv"`, `radioStreamingUrl: null` y
`videoStreamingUrl` presente, y `selectedTemplate: null` → cae al default
(`minimalista`). El componente de video ya existe (`useHlsVideo`, `TvSection`).

## Goals / Non-Goals

**Goals:**

- Detectar `radio` / `tv` / `both` sin cambiar la API.
- En `tv`: video inline como contenido principal, sin UI de radio.
- No tocar `radio` ni `both`.
- Reusar el video existente (`useHlsVideo`) y no duplicar consumo.

**Non-Goals:**

- No rediseñar los modos radio/both.
- No agregar templates nuevos.
- No depender de campos no documentados (se usan como pista opcional).

## Decisions

### 1. Detección pura + hook

`deriveServiceMode(basicData)` en `src/core` (función pura testeable) devuelve
`'radio' | 'tv' | 'both'`, y un hook `useServiceMode(clientData)` la expone.

Regla: `radioStreamingUrl` no vacío = radio; `videoStreamingUrl` no vacío = tv;
ambos = `both`; ninguno = `radio`. `services` se usa solo si es reconocible
(`'tv'` fuerza `tv` cuando no hay radio). Alternativa descartada: depender solo
de `services` (no está documentado y sus valores no están garantizados).

### 2. Gating de hooks sin condicionales

Los hooks no pueden ser condicionales, así que el gating va por opción:
`useStreaming(clientId, { enabled })` y `useLiveRadio(clientData, { enabled })`
no consultan `/streaming` en modo `tv`. El `PlayerBar` no se monta en `tv`, así
que su `useStreaming` interno tampoco corre.

### 3. Reproductor de TV inline reutilizable

Se extrae `TvPlayer` (video + `useHlsVideo` + estado de error con "Reintentar")
a partir de `TvSection` y del modal de `minimalista`. `TvSection` pasa a usarlo,
y los templates lo usan como contenido principal en modo `tv`. Un solo camino de
video evita duplicar lógica.

### 4. Adaptación por template

Cada template calcula `mode` una vez y, si es `tv`:

```
+------------------------------------------+
| header / gcBar / clima (se mantienen)    |
+------------------------------------------+
| [ TvPlayer inline ]  <- reemplaza el     |
|                        hero/deck de radio|
+------------------------------------------+
| secciones de contenido (sin TvSection)   |
+------------------------------------------+
| (sin PlayerBar / sin VU / sin next track)|
+------------------------------------------+
```

En `radio`/`both` no cambia nada. El `TvPlayer` va responsive (aspect ratio) y
en móvil ocupa el ancho.

### 5. Sin duplicar la TV en el stack

`ContentSectionStack` calcula el modo (ya tiene `clientData`) y omite la sección
`tv` cuando el modo es `tv` (el video ya es principal). En `both` se mantiene.

### 6. Separación de capas

Datos (`basicData`) → detección pura (`core`) → hooks con `enabled` → UI por
template. La UI no reimplementa la detección ni el consumo de streaming.

## Risks / Trade-offs

- [`services` no documentado] → Solo se usa como pista; la inferencia por URL es
  la fuente principal. Valores desconocidos se ignoran.
- [Duplicación de TV] → El stack debe omitir `tv` en modo `tv`; si no, el video
  aparece dos veces.
- [Fixtures de tests en modo tv por accidente] → Varios tests usan
  `videoStreamingUrl` con `radioStreamingUrl: null` (modo `tv`). Hay que
  ajustarlos para reflejar el modo buscado (agregar `radioStreamingUrl` donde se
  quiera `both`) y agregar casos explícitos de `tv`.
- [Hooks montados de más] → Si un template olvida gatear `useLiveRadio`, igual
  consulta `/streaming` en `tv`; se cubre con el `enabled`.
- [PWA/offline] → El video usa `hls.js` bajo demanda (ya existente); el modo no
  altera la estrategia de caché.
- [Estados nulos] → Sin URLs se cae a `radio` (comportamiento actual); el error
  de video reusa "Reintentar".

## Migration Plan

- Cambio aditivo: los clientes `radio` y `both` no cambian.
- Despliegue normal por cliente; no requiere cambios de API ni migración de
  datos.
- Rollback: volver a renderizar la UI de radio siempre (el modo se vuelve
  inerte).

## Open Questions

- ¿El bloque de video en `tv` lleva un encabezado ("TV en vivo") o es solo el
  reproductor? (Deferible; no cambia specs ni tareas.)
- ¿Hay más valores posibles de `services` además de `radio`/`tv`? (Se ignoran
  los desconocidos.)
