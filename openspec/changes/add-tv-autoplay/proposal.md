# Proposal: add-tv-autoplay

## Why

En modo solo TV el reproductor de video se muestra inline, pero **no arranca
solo**: los navegadores bloquean el autoplay con sonido en la carga inicial, y
hoy `useHlsVideo` solo depende del atributo `autoPlay` del `<video>`. El
visitante tiene que pulsar play manualmente. Queremos que el video empiece a
reproducir al abrir el sitio, dentro de lo que permiten los navegadores.

**Objetivos**

- Intentar reproducir el video automáticamente al montar el reproductor.
- Cuando el navegador bloquee el autoplay con sonido, caer a **autoplay
  silenciado** (permitido) y ofrecer un botón para **activar el sonido**.
- Reflejar el estado real de reproducción (evento `playing`), no solo el parseo
  del manifiesto.

**No objetivos**

- No se fuerza el audio: si el navegador lo bloquea, se respeta y se ofrece el
  control al usuario (no se puede, ni se intenta, saltar la política).
- No cambia el autoplay del modal de TV en modo `both` (ya es por gesto del
  usuario).
- No cambia el reproductor de radio.

## What Changes

- `useHlsVideo` intenta `video.play()` al haber imagen (evento de manifiesto en
  HLS o metadatos en reproducción nativa) y expone si el sonido quedó silenciado.
- `TvPlayer` arranca silenciado cuando el autoplay con sonido es rechazado y
  muestra un botón "Activar sonido" que, con el gesto del usuario, quita el mute.
- El estado del reproductor pasa a basarse en el evento `playing`.

## Capabilities

### New Capabilities

- `tv-autoplay`: autoplay del video con degradación a silenciado y control para
  activar el sonido, respetando la política de autoplay de los navegadores.

### Modified Capabilities

<!-- Ninguna: el comportamiento vive en el reproductor de TV. -->

## Impact

- Código: `src/modules/tv/useHlsVideo.ts` (intento de `play` + estado de mute) y
  `src/modules/tv/TvPlayer.tsx`/`.module.css` (botón "Activar sonido").
- Sin cambios de API ni de datos.
- Specs: `tv-autoplay` (nueva).
