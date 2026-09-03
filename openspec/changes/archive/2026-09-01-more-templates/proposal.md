## Why

El panel de IPStream expone nombres de plantilla del proyecto base (`blue`, `moderno`, `tradicional`, `app`, `petroleo`, `playlist`, `covered`), pero la app solo registra `minimalista` y `moderna`. Cualquier cliente con otro `selectedTemplate` cae al default. Se agregan los templates restantes para que cada radio pueda elegir su diseño desde el panel sin redesplegar.

## What Changes

- **7 templates nuevos** registrados en `src/templates/`: `blue`, `moderno`, `tradicional`, `app`, `petroleo`, `playlist`, `covered`.
- **Shell compartido**: un `TemplateShell` (header + hero del reproductor + contenido + footer + PlayerBar) reutilizado por los templates nuevos, estilizado por variables CSS por template.
- **Hero de reproductor compartido** (`RadioPlayerHero`): centraliza la lógica de streaming/player (tema actual, play/pause, oyentes, Media Session) para los templates nuevos.

## Capabilities

### New Capabilities

- Ninguna nueva.

### Modified Capabilities

- `templates`: se amplía el registro con 7 templates adicionales seleccionables desde el panel (`selectedTemplate`), con fallback al default cuando el id no existe.

## Impact

- **Nuevo código**: `src/templates/shared/TemplateShell.tsx` (+css), `src/modules/player/RadioPlayerHero.tsx` (+css), y las carpetas `src/templates/{blue,moderno,tradicional,app,petroleo,playlist,covered}/`.
- **Modificado**: `src/templates/index.tsx` (registro `getTemplate`).
- **API**: sin cambios (todos usan `useFullClientData` + `useStreaming`).
- **Dependencias**: ninguna.
- **No afecta**: los templates `minimalista` y `moderna` existentes, el resto de la app ni el modelo de despliegue.
