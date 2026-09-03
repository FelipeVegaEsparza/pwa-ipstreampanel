# api-client Specification

## Purpose
Provee el cliente HTTP tipado de la API pública de IPStream Panel para el tenant activo: construcción de la base URL, fetch resiliente con reintentos, caché en memoria con TTL por recurso, aislamiento entre tenants, resolución de URLs de imágenes y degradación silenciosa ante datos vacíos o nulos.

## Requirements

### Requirement: Construir base URL de la API
El sistema SHALL construir la URL base de la API pública del tenant activo en el formato `https://panelipstream.cl/api/public/{clientId}`, usando exclusivamente el `clientId` resuelto por la capacidad de multi-tenant.

#### Scenario: Consumo de un endpoint
- **WHEN** un módulo solicita un recurso del tenant activo
- **THEN** la solicitud se realiza contra `https://panelipstream.cl/api/public/{clientId}/<recurso>` con el `clientId` del tenant

### Requirement: Fetch resiliente con reintentos
El sistema SHALL reintentar las solicitudes que fallen por error de servidor (HTTP 5xx) o de red con backoff exponencial y jitter, y SHALL NO reintentar errores de cliente (HTTP 4xx). Las solicitudes SHALL tener un límite de reintentos y un tiempo máximo de espera.

#### Scenario: Error 5xx transitorio
- **WHEN** la API responde con HTTP 500 en el primer intento y responde correctamente en un reintento
- **THEN** el sistema devuelve la respuesta exitosa sin propagar el error intermedio

#### Scenario: Error 4xx de cliente
- **WHEN** la API responde con HTTP 404 o 400
- **THEN** el sistema NO reintenta y propaga el error de forma controlada

### Requirement: Caché en memoria con TTL por recurso
El sistema SHALL cachear las respuestas GET en memoria con una duración (TTL) por tipo de recurso. Los recursos dinámicos de streaming y chat SHALL usar un TTL muy corto o ninguno, de modo que el estado en vivo nunca quede obsoleto.

#### Scenario: Reutilización dentro del TTL
- **WHEN** un recurso fue obtenido hace menos de su TTL
- **THEN** la solicitud se responde desde la caché sin llamar a la red

#### Scenario: Streaming nunca obsoleto
- **WHEN** se consulta el estado de streaming
- **THEN** la respuesta no se sirve desde una caché persistente que pueda mostrar datos desactualizados

### Requirement: Aislamiento de caché entre tenants
El sistema SHALL particionar las claves de caché por `clientId`, de modo que los datos de un tenant nunca se sirvan a otro.

#### Scenario: Cambio de tenant en la misma sesión
- **WHEN** la aplicación cambia de tenant activo
- **THEN** las solicitudes del nuevo tenant no reutilizan datos cacheados del tenant anterior

### Requirement: Degradación ante datos vacíos o nulos
El sistema SHALL devolver valores por defecto vacíos (arrays o estructuras vacías) sin lanzar excepciones cuando la API responda con datos nulos, vacíos o incompletos.

#### Scenario: Recurso sin contenido
- **WHEN** la API responde con `null`, un objeto vacío o una lista vacía
- **THEN** el consumidor recibe una estructura vacía válida sin error

#### Scenario: Error de red
- **WHEN** la API no es alcanzable
- **THEN** el consumidor recibe un resultado de degradación (estructura vacía o error controlado) sin romper la interfaz

### Requirement: Resolver URLs de imágenes
El sistema SHALL resolver las rutas relativas de imágenes (`/api/uploads/{clientId}/...`) a URLs absolutas completas, y SHALL devolver las URLs ya absolutas sin modificar.

#### Scenario: Ruta relativa de imagen
- **WHEN** un recurso entrega `imageUrl` en formato relativo
- **THEN** el sistema devuelve la URL absoluta correspondiente bajo el dominio del panel

#### Scenario: URL absoluta
- **WHEN** un recurso entrega `imageUrl` ya absoluta
- **THEN** el sistema la devuelve sin cambios

### Requirement: Endpoints GET del contrato
El sistema SHALL exponer funciones tipadas para todos los endpoints GET documentados en `instruccionesapi.md`: datos básicos, redes sociales, streaming, estado de streaming, programas, noticias (con paginación y por slug), videos, auspiciadores, galerías, locutores, eventos, promociones, podcasts (paginado y por id), videocasts (paginado y por id) y encuestas.

#### Scenario: Noticias paginadas
- **WHEN** un módulo solicita noticias con `page` y `limit`
- **THEN** la solicitud incluye los parámetros de paginación y el resultado tipado contiene `data`, `pagination` y `source`
