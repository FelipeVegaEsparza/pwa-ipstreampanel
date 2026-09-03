## Purpose

Determina qué radio o canal de TV se está mostrando a partir del `clientId` inyectado en el build de cada cliente (`clients/<nombre>/client.json`), y expone esa identidad de tenant (clientId, nombre y base URL de la API) a toda la aplicación.

## ADDED Requirements

### Requirement: Resolver clientId desde la configuración del build
El sistema SHALL resolver el `clientId` del tenant activo desde la variable inyectada en el build (`VITE_CLIENT_ID`, proveniente de `clients/<nombre>/client.json`). Sin subdominios ni rutas especiales: cada build de cliente ES un cliente.

#### Scenario: Build de cliente en la raíz
- **WHEN** el build de un cliente se abre en la raíz `/`
- **THEN** el sistema usa el `clientId` inyectado en el build como tenant activo

#### Scenario: Sin clientId configurado
- **WHEN** el build no trae `clientId` inyectado
- **THEN** el sistema activa el manejo de clientes desconocidos

### Requirement: Exponer identidad del tenant
El sistema SHALL exponer a la aplicación la identidad del tenant activo: `clientId`, nombre (si se conoce) y la URL base de la API pública derivada (`https://panelipstream.cl/api/public/{clientId}`).

#### Scenario: Aplicación consulta el tenant activo
- **WHEN** cualquier módulo de la aplicación solicita el tenant activo
- **THEN** recibe el `clientId`, nombre y base URL de la API sin duplicar la lógica de resolución

### Requirement: Manejar clientes desconocidos
El sistema SHALL mostrar una pantalla de error dedicada cuando no haya `clientId` configurado. La pantalla SHALL ser informativa y no debe romper el resto de la aplicación.

#### Scenario: Sin clientId
- **WHEN** no hay `clientId` inyectado en el build
- **THEN** se muestra una pantalla de error con indicación de que el cliente no fue configurado
