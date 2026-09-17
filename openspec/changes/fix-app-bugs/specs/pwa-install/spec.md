## MODIFIED Requirements

### Requirement: Título del documento por cliente
El sistema SHALL fijar `document.title` con el nombre del cliente. Usará `basicData.projectName` cuando esté disponible y, si no, el nombre configurado en el build del cliente. El título SHALL actualizarse cuando cambie el nombre resuelto.

#### Scenario: Nombre del cliente disponible
- **WHEN** el cliente tiene `projectName`
- **THEN** el título de la pestaña muestra ese nombre

#### Scenario: projectName ausente
- **WHEN** el cliente no tiene `projectName` (valor `null` o vacío)
- **THEN** el título de la pestaña muestra el nombre configurado en el build y no el valor genérico por defecto
