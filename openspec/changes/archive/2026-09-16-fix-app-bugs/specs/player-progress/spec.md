## MODIFIED Requirements

### Requirement: Pausa del avance
El sistema SHALL detener el avance de la barra cuando el reproductor está en pausa y reanudarlo al reproducir, sin sumar a la posición el tiempo transcurrido en pausa.

#### Scenario: Pausa
- **WHEN** el usuario pausa la reproducción
- **THEN** el avance se detiene

#### Scenario: Reanudación tras pausa
- **WHEN** el usuario reanuda la reproducción después de una pausa
- **THEN** el avance continúa desde la posición en que se pausó, sin incluir el tiempo que duró la pausa
