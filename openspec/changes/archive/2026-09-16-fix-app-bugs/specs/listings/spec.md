## ADDED Requirements

### Requirement: Error de página en listados paginados
Al cambiar de página en un listado paginado, el sistema SHALL mostrar un estado de error con acción de reintento cuando la consulta de la nueva página falla, en lugar de mantener los datos de la página anterior como si fueran los de la página solicitada. Mientras la nueva página carga, el sistema SHALL indicar el estado de carga.

#### Scenario: Falla la carga de una página
- **WHEN** el usuario navega a la página 2 de un listado y la solicitud falla
- **THEN** se muestra un error con opción de reintentar y no los elementos de la página 1

#### Scenario: Reintento exitoso
- **WHEN** el usuario reintenta tras un error de página y la solicitud responde correctamente
- **THEN** el listado muestra los elementos de la página solicitada
