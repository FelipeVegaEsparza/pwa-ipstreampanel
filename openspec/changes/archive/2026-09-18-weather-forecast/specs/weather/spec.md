## ADDED Requirements

### Requirement: Pronóstico diario del clima
El sistema SHALL mostrar un pronóstico de varios días para la ciudad configurada en `basicData.location`, consultando el proveedor meteorológico público con sus coordenadas. El pronóstico SHALL incluir, por día, el nombre del día, el icono de la condición, la temperatura máxima y la mínima, en la unidad correspondiente al país del cliente. Si no hay coordenadas o la consulta falla, el pronóstico SHALL omitirse sin romper la interfaz.

#### Scenario: Pronóstico disponible
- **WHEN** el cliente tiene `location` con latitud/longitud y el proveedor responde
- **THEN** se muestra el pronóstico de varios días con día, icono, máxima y mínima

#### Scenario: Sin ubicación
- **WHEN** `location` es `null` o no tiene coordenadas
- **THEN** el pronóstico no se muestra

#### Scenario: Error de red o del proveedor
- **WHEN** la consulta del pronóstico falla
- **THEN** el pronóstico no se muestra y el resto de la página sigue funcionando
