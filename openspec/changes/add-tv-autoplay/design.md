# Design: add-tv-autoplay

## Context

Ver `proposal.md - Why`. Hoy `useHlsVideo` (`src/modules/tv/useHlsVideo.ts`)
adjunta la fuente y expone `status`/`reload`, pero **no llama a `play()`**:
depende del atributo `autoPlay` del `<video>`. Además marca `playing` en
`MANIFEST_PARSED` (HLS), que no significa que el video esté reproduciendo. En
Safari la ruta es nativa (`video.src` + `load()`). `TvPlayer` es el componente
compartido por modo `tv` inline, la sección de TV y el modal de `both`.

## Goals / Non-Goals

**Goals:**

- Arrancar el video automáticamente al abrir el sitio.
- Degradar a silenciado cuando el navegador bloquea el autoplay con sonido.
- Ofrecer un control claro para activar el sonido.
- Reflejar el estado real de reproducción.

**Non-Goals:**

- No saltar la política de autoplay (no se puede con audio).
- No persistir preferencia de mute (se puede evaluar después).
- No cambia el reproductor de radio ni el modal por gesto.

## Decisions

### 1. El intento de autoplay vive en `useHlsVideo`

El hook expone `{ status, muted, needsInteraction, enableSound, reload }`:

```
al haber imagen (MANIFEST_PARSED en HLS / loadedmetadata en nativo):
  video.play()
    ok           -> reproduce con sonido
    rechazado    -> video.muted = true; video.play()
                       ok          -> reproduce silenciado (muted=true)
                       rechazado   -> needsInteraction=true (mostrar play)
```

Mantenerlo en el hook (y no en `TvPlayer`) centraliza la lógica y la hace
testeable, y sirve tanto al video inline como al modal.

### 2. Estado basado en el evento `playing`

Un único listener de `playing` en el `<video>` marca `status='playing'` en ambas
rutas (HLS y nativa), en lugar de hacerlo en `MANIFEST_PARSED`. Así el estado
indicado corresponde a la reproducción real.

### 3. `TvPlayer` muestra el control de sonido

Cuando `muted` es true, `TvPlayer` muestra un botón flotante **"Activar sonido"**
que llama a `enableSound()` (dentro de un gesto del usuario → permitido).
Cuando `needsInteraction` es true (el navegador bloqueó incluso el autoplay
silenciado, p. ej. ahorro de energía), muestra un botón/overlay "Reproducir".
El botón es accesible por teclado y con `aria-pressed`.

### 4. Modal y sección comparten el comportamiento

El modal de `both` ya se abre por gesto, así que el autoplay con sonido suele
funcionar; igual usa el mismo hook, por lo que si el navegador lo bloquea
degrada a silenciado con el botón.

## Risks / Trade-offs

- [Política de autoplay] → Con audio es imposible sin gesto; por eso el fallback
  silenciado + botón. Se documenta la limitación.
- [Datos/energía] → El autoplay consume datos al abrir; es esperable en un sitio
  de TV. No se agrega prefetch extra.
- [iOS/Safari] → Requiere `playsInline` (ya está) para el autoplay silenciado.
- [Muted también bloqueado] → `needsInteraction` cubre ese caso con un control
  de reproducción explícito.
- [El estado `playing` en HLS] → Cambiar de `MANIFEST_PARSED` a `playing` puede
  afectar tests existentes de `useHlsVideo`; se ajustan.

## Migration Plan

- Cambio aditivo: sin API ni datos. Si el autoplay falla, el usuario ve el botón.
- Rollback: dejar de intentar `play()` y volver al atributo `autoPlay`.

## Open Questions

- ¿Persistir la preferencia de sonido (una vez activado, recordar)? (Deferible;
  no cambia specs ni tareas.)
