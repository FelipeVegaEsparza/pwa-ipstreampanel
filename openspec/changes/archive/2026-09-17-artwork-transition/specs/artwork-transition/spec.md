## Purpose

Mejora la entrada al contenido del cliente: prepara el estado del reproductor antes de montar el template para que el artwork ya esté disponible, y suaviza los cambios de imagen con un fundido cruzado.

## ADDED Requirements

### Requirement: Estado del reproductor listo al montar el template
El sistema SHALL iniciar la consulta del estado de streaming del tenant durante el splash (antes de montar el template), de modo que al renderizar el reproductor la carátula del tema actual esté disponible y no haya un salto desde el logo o la portada de la radio.

#### Scenario: Streaming disponible al montar
- **WHEN** el splash termina y el estado de streaming ya respondió
- **THEN** el artwork del hero muestra la carátula del tema actual directamente, sin pasar por el logo de la radio

#### Scenario: Streaming lento
- **WHEN** el estado de streaming todavía no respondió al montar el template
- **THEN** el sistema usa los fallbacks y el artwork se actualiza con una transición suave cuando llega la carátula

### Requirement: Crossfade del artwork
El sistema SHALL hacer un fundido cruzado cuando cambia la imagen del artwork (por ejemplo, al pasar de los fallbacks a la carátula del tema o al cambiar de tema), en lugar de un salto inmediato. La imagen anterior SHALL permanecer visible hasta que la nueva termine de cargar, y la transición SHALL respetar la preferencia de movimiento reducido.

#### Scenario: Cambio de imagen
- **WHEN** la fuente de la imagen del artwork cambia
- **THEN** la nueva imagen aparece con un fundido sobre la anterior, sin un corte seco

#### Scenario: Imagen que falla
- **WHEN** la nueva imagen no carga
- **THEN** el sistema avanza al fallback correspondiente sin dejar un hueco

#### Scenario: Movimiento reducido
- **WHEN** el usuario tiene activado el modo de movimiento reducido
- **THEN** el cambio de imagen no usa animación
