# Spec Delta

## Purpose

Mantiene un historial de las canciones reproducidas por la radio visible para el
usuario, construido en el cliente a partir del estado de streaming porque la API
pública no expone un endpoint de historial.

## ADDED Requirements

### Requirement: Historial acumulado desde el estado de streaming
El sistema SHALL construir el historial de canciones observando los cambios de
`currentTrack` en el polling de `/streaming`, registrando título, artista y
portada cuando estén disponibles. El sistema SHALL degradar sin romper la
interfaz si el estado de streaming no está disponible.

#### Scenario: Cambio de tema
- **WHEN** el polling de `/streaming` reporta un `currentTrack` distinto al último registrado
- **THEN** el sistema agrega el nuevo tema al historial

#### Scenario: Mismo tema
- **WHEN** el polling reporta el mismo `currentTrack` ya registrado
- **THEN** el sistema no duplica la entrada

#### Scenario: Streaming sin datos
- **WHEN** `/streaming` no responde o no trae `currentTrack`
- **THEN** el historial conserva lo acumulado y la interfaz no se rompe

### Requirement: Persistencia local del historial
El historial SHALL persistir en el almacenamiento local del navegador y SHALL
recuperarse al volver a abrir la aplicación, acotado a un máximo de entradas
para no crecer indefinidamente.

#### Scenario: Reapertura de la aplicación
- **WHEN** el usuario vuelve a abrir la aplicación en el mismo navegador
- **THEN** el historial previamente acumulado se muestra

#### Scenario: Límite de entradas
- **WHEN** el historial supera el máximo de entradas definido
- **THEN** se conservan solo las más recientes

### Requirement: Historial visible en el template moderno2
El template `moderno2` SHALL mostrar el historial de canciones reproducidas como
una sección, y SHALL NO mostrarla cuando el historial esté vacío.

#### Scenario: Historial con entradas
- **WHEN** el historial tiene al menos una canción y el template es `moderno2`
- **THEN** la sección de historial se muestra con las canciones acumuladas

#### Scenario: Historial vacío
- **WHEN** no hay canciones acumuladas
- **THEN** la sección de historial no se renderiza
