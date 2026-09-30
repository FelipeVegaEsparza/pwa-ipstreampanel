# Spec Delta

## ADDED Requirements

### Requirement: Acento canónico consumido por los templates
Cada template SHALL consumir el acento desde un token canónico compartido
(`--brand-accent` y sus variantes derivadas), usando su color actual como
fallback, de modo que un acento definido por el cliente se aplique dentro del
template sin alterar el resto de su diseño.

#### Scenario: Cliente con acento definido
- **WHEN** el cliente tiene un acento configurado y usa cualquier template
- **THEN** el template muestra su acento reemplazado por el del cliente, conservando tipografías, fondos y disposición

#### Scenario: Cliente sin acento
- **WHEN** el cliente no tiene acento configurado
- **THEN** cada template conserva su color de acento propio

#### Scenario: Variantes derivadas
- **WHEN** un template usa estados hover, versiones tenues o texto sobre el acento
- **THEN** esos valores se derivan del acento canónico en lugar de estar hardcodeados
