# polls Specification

## Purpose
Permite que los oyentes respondan las encuestas activas del cliente, votando una sola vez por dispositivo (anti-duplicado con `localStorage`) y mostrando los resultados con porcentajes.

## Requirements

### Requirement: Mostrar encuestas activas
El sistema SHALL listar las encuestas activas del cliente (`GET /polls`) y SHALL renderizar la sección solo si hay al menos una encuesta activa.

#### Scenario: Sin encuestas activas
- **WHEN** el API devuelve una lista vacía de encuestas
- **THEN** la sección de encuestas no se renderiza

#### Scenario: Con encuestas activas
- **WHEN** el API devuelve encuestas activas
- **THEN** la sección se muestra con sus opciones

### Requirement: Votar una sola vez por dispositivo
El sistema SHALL permitir votar en una encuesta mediante `POST /polls/{pollId}/vote` con `optionId`, y SHALL impedir votos duplicados del mismo dispositivo usando `localStorage` con la clave `poll_{pollId}`.

#### Scenario: Votación exitosa
- **WHEN** el usuario selecciona una opción de una encuesta sin votos previos
- **THEN** se envía el voto, se guarda `poll_{pollId}` en `localStorage` y se muestran los resultados actualizados

#### Scenario: Voto duplicado
- **WHEN** el usuario intenta votar en una encuesta ya votada (clave `poll_{pollId}` presente)
- **THEN** el sistema no permite votar de nuevo y muestra los resultados

### Requirement: Mostrar resultados con porcentajes
Después de votar (o si ya votó), el sistema SHALL mostrar los resultados de la encuesta con el conteo y porcentaje de votos de cada opción.

#### Scenario: Resultados visibles
- **WHEN** una encuesta está votada
- **THEN** cada opción muestra su conteo de votos y su porcentaje calculado sobre el total

### Requirement: Manejar errores del voto
El sistema SHALL degradar sin romper la interfaz si el voto falla (red, opción inválida, encuesta inactiva), sin marcar la encuesta como votada. El sistema SHALL funcionar aunque el almacenamiento local (`localStorage`) no esté disponible: la detección de voto previo y su persistencia SHALL tolerar excepciones de acceso y, en su ausencia, la encuesta SHALL seguir siendo operable en la sesión.

#### Scenario: Error de red al votar
- **WHEN** el POST del voto falla
- **THEN** se muestra un mensaje de error y la encuesta sigue permitiendo reintentar, sin persistir `poll_{pollId}`

#### Scenario: Almacenamiento local no disponible
- **WHEN** el navegador bloquea `localStorage` (modo privado, storage deshabilitado)
- **THEN** la sección de encuestas se renderiza, permite votar y no lanza una excepción que rompa el resto de la página

#### Scenario: Voto duplicado por reintento del cliente
- **WHEN** el envío del voto falla por un error de servidor o de red
- **THEN** el sistema no reenvía el POST automáticamente, de modo que la API no registra el mismo voto más de una vez
