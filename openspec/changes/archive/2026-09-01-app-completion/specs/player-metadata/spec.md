## Purpose

Mejora el reproductor con Media Session (metadata del tema y controles en pantalla de bloqueo/medios del sistema) y polling ligero del estado en vivo.

## ADDED Requirements

### Requirement: Media Session del reproductor
El sistema SHALL exponer la metadata del tema actual (título, artista, portada) a la Media Session API y SHALL exponer acciones de play/pause (y next/prev si están disponibles).

#### Scenario: Tema en reproducción
- **WHEN** el reproductor está reproduciendo un tema con metadata
- **THEN** la pantalla de bloqueo y los controles del sistema muestran título, artista y portada

#### Scenario: Control desde el sistema
- **WHEN** el usuario usa play/pause desde los controles del sistema
- **THEN** el reproductor de la app responde al control

### Requirement: Polling ligero del estado
El sistema SHALL mantener el estado del reproductor actualizado mediante `/streaming/status` (variante ligera) como complemento del estado rico, sin duplicar la caché.

#### Scenario: Actualización del estado
- **WHEN** el estado del streaming cambia
- **THEN** el reproductor lo refleja en un ciclo de polling ligero
