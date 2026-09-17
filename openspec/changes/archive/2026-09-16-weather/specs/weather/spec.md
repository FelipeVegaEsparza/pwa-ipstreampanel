## Purpose

Muestra el clima de la ciudad de la radio en los templates, usando la `location` expuesta por la API del panel y un proveedor meteorológico público sin clave (Open-Meteo), con degradación elegante si no hay ubicación o falla la red.

## ADDED Requirements

### Requirement: Mostrar el clima cuando existe ubicación
El sistema SHALL mostrar temperatura, condición y ciudad cuando `basicData.location` tenga `latitude` y `longitude`, consultando el proveedor público con esas coordenadas.

#### Scenario: Ubicación configurada
- **WHEN** el cliente tiene `location` con latitud/longitud y el proveedor responde
- **THEN** se muestra el clima (temperatura, condición y ciudad)

#### Scenario: Sin ubicación
- **WHEN** `basicData.location` es `null` o no tiene coordenadas
- **THEN** el bloque de clima no se muestra y no interfiere con la página

#### Scenario: Error de red o del proveedor
- **WHEN** la consulta al proveedor falla
- **THEN** el bloque de clima no se muestra (degradación elegante sin romper la app)

### Requirement: Unidades según país
El sistema SHALL mostrar la temperatura en °C por defecto y en °F cuando `country` sea `US`.

#### Scenario: Radio fuera de EE. UU.
- **WHEN** `location.country` no es `US`
- **THEN** la temperatura se muestra en °C

#### Scenario: Radio en EE. UU.
- **WHEN** `location.country` es `US`
- **THEN** la temperatura se muestra en °F

### Requirement: Condición en texto
El sistema SHALL traducir el código de condición meteorológica (WMO) del proveedor a un texto legible en español.

#### Scenario: Condición clara
- **WHEN** el proveedor devuelve un código de cielo despejado
- **THEN** se muestra el texto correspondiente (p. ej. "Despejado")

#### Scenario: Código desconocido
- **WHEN** el proveedor devuelve un código no mapeado
- **THEN** se muestra la temperatura y la ciudad sin el texto de condición
