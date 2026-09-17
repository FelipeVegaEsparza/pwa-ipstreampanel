## MODIFIED Requirements

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
