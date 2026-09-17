## MODIFIED Requirements

### Requirement: Fetch resiliente con reintentos
El sistema SHALL reintentar las solicitudes GET que fallen por error de servidor (HTTP 5xx) o de red con backoff exponencial y jitter, y SHALL NO reintentar errores de cliente (HTTP 4xx). Las solicitudes de escritura (POST y otros métodos no idempotentes) SHALL NO reintentarse automáticamente, para no duplicar efectos en un servidor que ya procesó la operación pero no pudo confirmarla. Las solicitudes SHALL tener un límite de reintentos y un tiempo máximo de espera.

#### Scenario: Error 5xx transitorio
- **WHEN** la API responde con HTTP 500 en el primer intento y responde correctamente en un reintento
- **THEN** el sistema devuelve la respuesta exitosa sin propagar el error intermedio

#### Scenario: Error 4xx de cliente
- **WHEN** la API responde con HTTP 404 o 400
- **THEN** el sistema NO reintenta y propaga el error de forma controlada

#### Scenario: Error 5xx en una escritura
- **WHEN** una solicitud POST responde con HTTP 5xx o falla por red
- **THEN** el sistema NO la reintenta y propaga el error al consumidor una sola vez
