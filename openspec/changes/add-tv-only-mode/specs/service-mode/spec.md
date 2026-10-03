# Spec Delta

## Purpose

Determina el modo de servicio de cada cliente (`radio`, `tv` o `both`) y define
cómo se presenta el sitio cuando el cliente solo ofrece TV.

## ADDED Requirements

### Requirement: Detección del modo de servicio
El sistema SHALL derivar el modo de servicio del cliente a partir de los datos
públicos: `radio` cuando exista `radioStreamingUrl`, `tv` cuando exista
`videoStreamingUrl` y no radio, y `both` cuando existan ambos. Si no se puede
determinar (sin URLs), SHALL asumir `radio` (comportamiento actual). El campo
`services`, si viene y es reconocible, SHALL usarse solo como refuerzo de la
inferencia.

#### Scenario: Cliente solo radio
- **WHEN** el cliente tiene `radioStreamingUrl` y no `videoStreamingUrl`
- **THEN** el modo es `radio`

#### Scenario: Cliente solo TV
- **WHEN** el cliente tiene `videoStreamingUrl` y no `radioStreamingUrl`
- **THEN** el modo es `tv`

#### Scenario: Cliente con radio y TV
- **WHEN** el cliente tiene `radioStreamingUrl` y `videoStreamingUrl`
- **THEN** el modo es `both`

#### Scenario: Datos incompletos
- **WHEN** el cliente no tiene ninguna de las dos URLs
- **THEN** el modo es `radio` y el sitio conserva el comportamiento actual

### Requirement: Presentación en modo solo TV
Cuando el modo es `tv`, el sistema SHALL mostrar el reproductor de video inline
como contenido principal y SHALL ocultar toda la interfaz relacionada con
radio: hero now-playing, reproductor inferior, VU meter, siguiente tema, barra
de progreso, estado/oyentes y Media Session. En los modos `radio` y `both` el
sistema SHALL mantener el comportamiento actual.

#### Scenario: Video inline
- **WHEN** el modo es `tv`
- **THEN** el video se reproduce inline en el área principal del template

#### Scenario: Sin UI de radio
- **WHEN** el modo es `tv`
- **THEN** no se muestra el hero de radio, el reproductor inferior, el VU meter ni el progreso/estado de radio

#### Scenario: Modos radio y both sin cambios
- **WHEN** el modo es `radio` o `both`
- **THEN** la interfaz de radio se muestra igual que antes de este cambio
