# Spec Delta

## ADDED Requirements

### Requirement: Clima multi-ciudad
El template `moderno2` SHALL mostrar una vista de clima con una tarjeta principal
para la ciudad configurada del cliente (`basicData.location`) y una grilla con
las nueve ciudades fijas de Chile (Valparaíso, Concepción, Antofagasta, La
Serena, Temuco, Puerto Montt, Punta Arenas, Iquique y Arica). Los datos SHALL
obtenerse del proveedor meteorológico público con las coordenadas
correspondientes, y cada tarjeta que falle SHALL mostrar un estado sin datos sin
romper la vista.

#### Scenario: Tarjeta principal
- **WHEN** un cliente tiene `basicData.location` con coordenadas
- **THEN** la tarjeta principal muestra el clima de esa ciudad

#### Scenario: Grilla de regiones
- **WHEN** se muestra la vista de clima del template `moderno2`
- **THEN** se listan las nueve ciudades fijas con su temperatura y condición

#### Scenario: Ciudad sin datos
- **WHEN** la consulta del clima de una ciudad falla
- **THEN** esa tarjeta muestra un estado sin datos y el resto de la vista sigue funcionando

#### Scenario: Sin ciudad configurada
- **WHEN** `basicData.location` no tiene ciudad o coordenadas
- **THEN** la tarjeta principal se omite y la grilla de ciudades fijas sigue mostrándose
