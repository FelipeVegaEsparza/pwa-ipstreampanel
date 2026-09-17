## ADDED Requirements

### Requirement: Sección de pronóstico del clima
El stack de contenido SHALL incluir una sección "Clima" con el pronóstico de la ciudad configurada, ubicada según el orden de secciones de cada template. La sección SHALL mostrarse solo cuando el cliente tenga coordenadas en `basicData.location` y SHALL no renderizarse en caso contrario.

#### Scenario: Cliente con ubicación
- **WHEN** el template renderiza sus secciones y `basicData.location` tiene coordenadas
- **THEN** la sección "Clima" aparece en el orden definido para ese template

#### Scenario: Cliente sin ubicación
- **WHEN** `basicData.location` no tiene coordenadas
- **THEN** la sección "Clima" no se renderiza ni ocupa espacio

#### Scenario: Orden por template
- **WHEN** un template define su propio orden de secciones
- **THEN** la sección "Clima" respeta la posición definida para ese template
