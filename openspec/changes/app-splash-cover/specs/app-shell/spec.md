## ADDED Requirements

### Requirement: Splash de carga con la portada del cliente
El sistema SHALL mostrar una pantalla de carga (splash) con la portada del cliente como imagen de fondo, usando `coverUrl` y, si no existe, `logoUrl`. El splash SHALL mostrarse tanto en el HTML inicial (antes de ejecutar JavaScript) como mientras se obtienen los datos del cliente. Si el cliente no tiene portada ni logo, el splash SHALL mostrarse con un fondo neutro sin romperse.

#### Scenario: Splash en el HTML inicial
- **WHEN** un navegador solicita la URL de un cliente y el HTML se sirve antes de ejecutar JavaScript
- **THEN** el HTML contiene el splash con la portada del cliente como fondo

#### Scenario: Splash mientras cargan los datos
- **WHEN** la aplicación está montada y todavía no llegaron los datos del cliente
- **THEN** se muestra el splash en lugar del contenido

#### Scenario: Cliente sin imagen
- **WHEN** el cliente no tiene `coverUrl` ni `logoUrl`
- **THEN** el splash se muestra con un fondo neutro y no lanza errores

### Requirement: Montar el template solo cuando se conoce
El sistema SHALL NOT renderizar un template antes de conocer el `selectedTemplate` del cliente; mientras no haya datos SHALL mostrar el splash, y al llegar los datos SHALL montar directamente el template seleccionado sin pasar por el template por defecto.

#### Scenario: Sin flash del template por defecto
- **WHEN** el cliente tiene seleccionado un template distinto del por defecto y sus datos aún no llegaron
- **THEN** no se renderiza el template por defecto y al llegar los datos se muestra el template seleccionado

#### Scenario: Error de carga
- **WHEN** la carga de datos falla y no hay datos previos
- **THEN** se muestra la pantalla de error correspondiente en lugar del splash
