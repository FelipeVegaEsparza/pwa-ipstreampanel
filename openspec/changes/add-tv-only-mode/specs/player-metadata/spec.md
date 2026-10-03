# Spec Delta

## ADDED Requirements

### Requirement: Sin polling de streaming en modo solo TV
Cuando el modo de servicio es `tv`, el sistema SHALL NO consultar el estado de
streaming (`/streaming` y `/streaming/status`) ni exponer Media Session, porque
no hay radio. En los modos `radio` y `both` SHALL mantener el polling y la Media
Session como hasta ahora.

#### Scenario: Cliente solo TV
- **WHEN** el modo es `tv`
- **THEN** no se hacen consultas al estado de streaming ni se expone Media Session

#### Scenario: Cliente con radio
- **WHEN** el modo es `radio` o `both`
- **THEN** el polling de streaming y la Media Session funcionan igual que antes
