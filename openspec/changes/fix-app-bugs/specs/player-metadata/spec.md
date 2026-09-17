## MODIFIED Requirements

### Requirement: Polling ligero del estado
El sistema SHALL mantener el estado del reproductor actualizado mediante `/streaming/status` (variante ligera) como complemento del estado rico, sin duplicar la caché, en un ciclo de polling de entre 10 y 15 segundos.

#### Scenario: Actualización del estado
- **WHEN** el estado del streaming cambia
- **THEN** el reproductor lo refleja en un ciclo de polling ligero

#### Scenario: Estado en vivo sin obsolescencia
- **WHEN** transcurre el intervalo de polling
- **THEN** los oyentes, el indicador en vivo y el tema actual se actualizan con la variante ligera sin esperar al estado rico

## ADDED Requirements

### Requirement: Actualización de la fuente de streaming
El sistema SHALL cargar la nueva `streamUrl` cuando esta cambie y el reproductor esté en reproducción, sin exigir que el usuario pause y reactive manualmente. La verificación de compatibilidad CORS SHALL NO reiniciar una reproducción en curso cuando el modo aplicado no cambia.

#### Scenario: Cambio de streamUrl en caliente
- **WHEN** la `streamUrl` del tenant cambia mientras el audio se está reproduciendo
- **THEN** el reproductor carga la nueva fuente y continúa la reproducción

#### Scenario: Sondeo CORS que no cambia el modo
- **WHEN** el sondeo de compatibilidad CORS concluye con el mismo modo ya aplicado
- **THEN** el reproductor no reinicia la fuente ni produce un corte de audio
