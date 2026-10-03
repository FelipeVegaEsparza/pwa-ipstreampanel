# Spec Delta

## ADDED Requirements

### Requirement: Adaptación del template al modo de servicio
Cada template SHALL adaptar su layout según el modo de servicio: en `tv` SHALL
reemplazar su hero/deck de radio por un reproductor de video inline y SHALL NO
montar los componentes de radio; en `radio` y `both` SHALL conservar su layout
actual.

#### Scenario: Template en modo solo TV
- **WHEN** un cliente con cualquier template tiene modo `tv`
- **THEN** el template muestra el video inline en el lugar de su reproductor de radio y no renderiza la UI de radio

#### Scenario: Template en modo both
- **WHEN** el cliente tiene modo `both`
- **THEN** el template muestra su reproductor de radio y la TV como hasta ahora

#### Scenario: Template en modo radio
- **WHEN** el cliente tiene modo `radio`
- **THEN** el template se ve igual que antes de este cambio
