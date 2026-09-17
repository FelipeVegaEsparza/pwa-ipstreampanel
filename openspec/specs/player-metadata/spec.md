# player-metadata Specification

## Purpose
Mejora el reproductor con Media Session (metadata del tema y controles en pantalla de bloqueo/medios del sistema) y polling ligero del estado en vivo.

## Requirements

### Requirement: Media Session del reproductor
El sistema SHALL exponer la metadata del tema actual (título, artista, portada) a la Media Session API y SHALL exponer acciones de play/pause (y next/prev si están disponibles).

#### Scenario: Tema en reproducción
- **WHEN** el reproductor está reproduciendo un tema con metadata
- **THEN** la pantalla de bloqueo y los controles del sistema muestran título, artista y portada

#### Scenario: Control desde el sistema
- **WHEN** el usuario usa play/pause desde los controles del sistema
- **THEN** el reproductor de la app responde al control

### Requirement: Polling ligero del estado
El sistema SHALL mantener el estado del reproductor actualizado mediante `/streaming/status` (variante ligera) como complemento del estado rico, sin duplicar la caché, en un ciclo de polling de entre 10 y 15 segundos.

#### Scenario: Actualización del estado
- **WHEN** el estado del streaming cambia
- **THEN** el reproductor lo refleja en un ciclo de polling ligero

#### Scenario: Estado en vivo sin obsolescencia
- **WHEN** transcurre el intervalo de polling
- **THEN** los oyentes, el indicador en vivo y el tema actual se actualizan con la variante ligera sin esperar al estado rico

### Requirement: Actualización de la fuente de streaming
El sistema SHALL cargar la nueva `streamUrl` cuando esta cambie y el reproductor esté en reproducción, sin exigir que el usuario pause y reactive manualmente. La verificación de compatibilidad CORS SHALL NO reiniciar una reproducción en curso cuando el modo aplicado no cambia.

#### Scenario: Cambio de streamUrl en caliente
- **WHEN** la `streamUrl` del tenant cambia mientras el audio se está reproduciendo
- **THEN** el reproductor carga la nueva fuente y continúa la reproducción

#### Scenario: Sondeo CORS que no cambia el modo
- **WHEN** el sondeo de compatibilidad CORS concluye con el mismo modo ya aplicado
- **THEN** el reproductor no reinicia la fuente ni produce un corte de audio
