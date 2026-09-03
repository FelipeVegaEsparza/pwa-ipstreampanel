## Context

Los templates `minimalista` y `moderna` ya existen y funcionan. Los 7 nuevos comparten la misma estructura (header + hero del reproductor + contenido + footer + PlayerBar) y la misma data (clientData, useStreaming, usePlayer). Se centraliza esa estructura en un `TemplateShell` y un `RadioPlayerHero` reutilizables, y cada template aporta solo su CSS (variables) para un look distinto: ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Registrar `blue`, `moderno`, `tradicional`, `app`, `petroleo`, `playlist`, `covered` en `src/templates/`.
- Compartir lógica (shell + hero) entre los templates nuevos vía componentes reutilizables.
- Diferenciación visual por variables CSS por template.

**Non-Goals:**
- Re-escribir `minimalista`/`moderna` (se mantienen intactos).
- Nuevas secciones de contenido (ya cubiertas).
- Cambios en la API, PWA o deploy.

## Decisions

### D1. `RadioPlayerHero` compartido
Componente en `src/modules/player/` que encapsula: `setStreamUrl` desde `basicData.radioStreamingUrl`, tema actual vía `useStreaming`, play/pause, oyentes, estado (`off/autodj/live`) y `useMediaSession`. Estilizado con variables CSS (`--hero-*`, `--tpl-accent`) que cada template define.
*Alternativa*: duplicar el hero por template — se descarta por duplicación de lógica.

### D2. `TemplateShell` compartido
Componente en `src/templates/shared/` que renderiza: header (marca + `InstallPrompt` + badge), `<RadioPlayerHero>`, contenido (`<Outlet>`), footer y `PlayerBar`. Acepta `className` (root del template) y `templateLabel` (texto del badge). Las variables `--tpl-*` de cada template definen colores y disposición; el shell mapea las `--content-*` para las secciones.
*Alternativa*: cada template con su estructura propia — se descarta por mantenimiento; el shell permite looks distintos solo con CSS.

### D3. Registro ampliado
`src/templates/index.tsx` agrega las claves `blue`, `moderno`, `tradicional`, `app`, `petroleo`, `playlist`, `covered` al mapa, manteniendo el fallback a `minimalista`.

## Risks / Trade-offs

- [Paletas muy similares entre templates] → Se varían acentos y disposición (hero, layout) para que se diferencien.
- [CSS por template prolifera] → Mitigado por el shell compartido: cada template solo define variables y ajustes menores.
- [Cambiar `selectedTemplate` a un id inexistente] → Fallback al default, sin romper.

## Migration Plan

1. Crear `RadioPlayerHero` y `TemplateShell`.
2. Crear los 7 templates (componente + CSS) y registrarlos en `index.tsx`.
3. Verificar: `npm run typecheck`, `npm run build:client -- fusionaustral`, y render de cada template con datos mockeados en tests.
