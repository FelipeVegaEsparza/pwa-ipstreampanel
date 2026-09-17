## Context

`covered` usa hoy `TemplateShell` (genérico). Se reemplaza por un componente propio con hero destacado (estilo magicafm) que renderiza el `Outlet` (home = `ContentSections`, ya con todas las secciones data-driven y rutas de detalle). Reutiliza la lógica de player existente: ver proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Hero de reproductor propio (portada, tema actual + álbum, play, compartir, oyentes/bitrate, barra y siguiente tema).
- Bajo el hero, todo el contenido de los endpoints (vía `Outlet` → `ContentSections`).
- Adaptable (2 columnas desktop, apilado móvil).

**Non-Goals:**
- Formulario de contacto (requiere backend; no es un endpoint público).
- OneSignal/push.
- Re-escribir las secciones de contenido (se reutilizan).

## Decisions

### D1. Componente propio en `covered`
Se reemplaza `TemplateShell` por un `CoveredTemplate` dedicado con hero propio. Mantiene `Outlet` para soportar el home (`ContentSections`) y las rutas de detalle.
*Alternativa*: seguir usando `TemplateShell` — no permite el look hero/acento diferenciado.

### D2. Hero reutilizando lógica de player
El hero usa `useStreaming`, `usePlayer`, `useTrackProgress` (barra fina sin números, bajo el hero), `NextTrack`, `useMediaSession` y fondo con crossfade de la portada (patrón de `minimalista`).

### D3. Tema claro + acento
El contenido usa un tema claro (fondo gris claro, tarjetas blancas) con acento de marca, vía variables `--content-*` y `--tpl-*` definidas en `.page`.

## Risks / Trade-offs

- [Hero alto en pantallas pequeñas] → En móvil el hero se apila y reduce la portada; se permite scroll.
- [Portada ausente] → Fondo degradado del hero + portada/logo de la radio como fallback.

## Migration Plan

1. Reescribir `CoveredTemplate.tsx` y su CSS.
2. Verificar `npm run typecheck`, `npm run test`, `npm run build:client`, smoke en navegador (hero + secciones completas).
