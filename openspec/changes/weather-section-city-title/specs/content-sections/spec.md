## MODIFIED Requirements

### Requirement: Sección de pronóstico del clima
El stack de contenido SHALL incluir una sección de pronóstico del clima titulada **"Proyección del clima en {ciudad}"**, usando el nombre de la ciudad configurada en `basicData.location`, ubicada según el orden de secciones de cada template. La sección SHALL mostrarse solo cuando el cliente tenga ciudad y coordenadas válidas en `basicData.location`, y SHALL no renderizarse en caso contrario.

#### Scenario: Cliente con ubicación
- **WHEN** el template renderiza sus secciones y `basicData.location` tiene ciudad y coordenadas
- **THEN** la sección se titula "Proyección del clima en {ciudad}" y aparece en el orden definido para ese template

#### Scenario: Cliente sin ciudad configurada
- **WHEN** `basicData.location` no tiene ciudad (aunque tenga coordenadas)
- **THEN** la sección de pronóstico no se renderiza ni ocupa espacio

#### Scenario: Cliente sin ubicación
- **WHEN** `basicData.location` no tiene coordenadas
- **THEN** la sección de pronóstico no se renderiza ni ocupa espacio

#### Scenario: Orden por template
- **WHEN** un template define su propio orden de secciones
- **THEN** la sección de pronóstico respeta la posición definida para ese template
