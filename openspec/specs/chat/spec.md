# chat Specification

## Purpose
Provee el chat en vivo del cliente: mostrar y enviar mensajes mediante polling incremental (usando `serverTime` como `since`), con indicador de oyentes activos y manejo de errores de red sin romper la interfaz.

## Requirements

### Requirement: Mostrar mensajes del chat
El sistema SHALL obtener y mostrar los mensajes del cliente (`GET /chat/messages`) y SHALL actualizarlos periódicamente mediante polling usando el `serverTime` de la última respuesta como `since`.

#### Scenario: Carga inicial
- **WHEN** la sección de chat se abre por primera vez
- **THEN** se muestran los mensajes disponibles y se guarda `serverTime` de la respuesta

#### Scenario: Mensajes nuevos
- **WHEN** el polling consulta con el `since` de la última respuesta
- **THEN** solo se agregan los mensajes posteriores a ese `since` y se actualiza `serverTime`

### Requirement: Enviar mensaje del oyente
El sistema SHALL permitir enviar mensajes con `name`, `email` y `body` mediante `POST /chat/messages`.

#### Scenario: Envío exitoso
- **WHEN** el usuario envía un mensaje con nombre y contenido válidos
- **THEN** el mensaje se envía al API y la lista se actualiza

#### Scenario: Envío inválido
- **WHEN** el nombre o el contenido están vacíos
- **THEN** el sistema no envía y muestra una validación sin romper la interfaz

### Requirement: Oyentes activos
El sistema SHALL mostrar el conteo de oyentes activos del cliente (`GET /chat/online`).

#### Scenario: Conteo disponible
- **WHEN** el API responde `chat/online`
- **THEN** se muestra el número de oyentes activos (y nombres recientes si aplica)

### Requirement: Resiliencia del polling
El sistema SHALL pausar o degradar el polling ante errores de red sin romper la interfaz, y SHALL evitar solicitudes innecesarias cuando la pestaña no está visible.

#### Scenario: Error de red en polling
- **WHEN** una consulta de polling falla por red
- **THEN** la interfaz sigue mostrando los mensajes previos y reintenta en el siguiente ciclo sin romperse

#### Scenario: Pestaña oculta
- **WHEN** la pestaña del navegador no está visible
- **THEN** el polling se reduce o detiene para evitar solicitudes innecesarias
