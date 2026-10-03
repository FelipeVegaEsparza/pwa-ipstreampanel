# Spec Delta

## ADDED Requirements

### Requirement: Sin duplicar la TV en modo solo TV
Cuando el modo de servicio es `tv`, el stack de secciones SHALL NO renderizar la
sección de TV, porque el video ya se muestra como contenido principal en el
template. En los modos `radio` y `both` la sección de TV SHALL comportarse como
hasta ahora (visible solo si hay `videoStreamingUrl`).

#### Scenario: Modo solo TV
- **WHEN** el modo es `tv`
- **THEN** el stack de secciones no muestra una segunda instancia del video

#### Scenario: Modo both
- **WHEN** el modo es `both` y hay `videoStreamingUrl`
- **THEN** la sección de TV se muestra como hasta ahora
