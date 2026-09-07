## ADDED Requirements

### Requirement: Sección de contacto al final de la home
La pila de secciones del contenido de la home SHALL terminar con una sección de contacto que permita enviar un mensaje al medio, renderizada después de las demás secciones de contenido. El template `minimalista`, cuyo home es el reproductor now-playing, SHALL NO mostrar dicha sección.

#### Scenario: Home con secciones de contenido
- **WHEN** un cliente cuyo template no es `minimalista` abre la home
- **THEN** tras las secciones de contenido se muestra la sección de contacto con el formulario

#### Scenario: Home del template minimalista
- **WHEN** un cliente con template `minimalista` abre la home
- **THEN** la home muestra el reproductor now-playing y no se renderiza la sección de contacto
