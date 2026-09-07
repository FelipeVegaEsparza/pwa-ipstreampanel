## Purpose

Formulario de contacto público del sitio de una radio/TV: envía mensajes de los visitantes al panel del cliente a través del endpoint público de mensajes de contacto, con validación en el cliente y manejo explícito de respuestas y errores.

## ADDED Requirements

### Requirement: Formulario de contacto con campos
El sistema SHALL mostrar un formulario de contacto público (sin autenticación) con los campos obligatorios `name`, `email`, `phone` y `message`, sin campo de asunto, y con un botón para enviar.

#### Scenario: Campos visibles
- **WHEN** se renderiza el formulario de contacto
- **THEN** se muestran los cuatro campos (`name`, `email`, `phone`, `message`), sus etiquetas o placeholders, y el botón de envío

#### Scenario: Sin asunto
- **WHEN** el visitante ve el formulario
- **THEN** no existe un campo de asunto (`subject`)

### Requirement: Validación en el cliente
El sistema SHALL validar en el cliente los cuatro campos antes de enviar, replicando las reglas del servidor: `name` obligatorio con máximo 120 caracteres, `email` obligatorio con formato válido y máximo 254, `phone` obligatorio con máximo 40, y `message` obligatorio con máximo 2000. Si la validación falla, el sistema SHALL mostrar feedback al visitante y SHALL NO enviar la solicitud.

#### Scenario: Campos vacíos
- **WHEN** el visitante intenta enviar con un campo obligatorio vacío
- **THEN** se muestra feedback de error en el formulario y no se envía ninguna solicitud al API

#### Scenario: Email inválido
- **WHEN** el visitante ingresa un `email` con formato no válido
- **THEN** se muestra feedback de error y no se envía la solicitud

### Requirement: Envío único al API del tenant activo
El sistema SHALL enviar el mensaje con un único POST a `https://panelipstream.cl/api/public/{clientId}/contact-messages`, usando el `clientId` del tenant activo, con `Content-Type: application/json` y un cuerpo JSON con exactamente `name`, `email`, `phone` y `message`. El envío SHALL ejecutarse una sola vez por intento (sin reintentos automáticos) y el formulario SHALL impedir envíos duplicados mientras la solicitud está en curso.

#### Scenario: Envío correcto
- **WHEN** el visitante envía un formulario válido
- **THEN** el sistema hace un POST a la URL de mensajes de contacto del tenant activo con el cuerpo JSON de los cuatro campos

#### Scenario: Sin envíos duplicados
- **WHEN** una solicitud está en curso
- **THEN** el botón de envío queda deshabilitado y los nuevos clics no disparan otra solicitud

### Requirement: Manejo de respuestas y errores
El sistema SHALL manejar cada respuesta del API con un mensaje visible para el visitante: respuesta `201` como éxito con reinicio del formulario; `400` mostrando el mensaje `error` devuelto por el API; `429` como límite anti-spam indicando esperar unos minutos; `404` con un mensaje genérico; y `500` o error de red con un mensaje genérico de "intenta más tarde".

#### Scenario: Envío exitoso
- **WHEN** el API responde `201`
- **THEN** se muestra un mensaje de éxito, se limpian los campos y el formulario vuelve a estar habilitado

#### Scenario: Error de validación del servidor
- **WHEN** el API responde `400`
- **THEN** se muestra el mensaje de error devuelto por el API

#### Scenario: Límite anti-spam
- **WHEN** el API responde `429`
- **THEN** se muestra un aviso de "demasiados intentos, espera unos minutos"

#### Scenario: Error de servidor o red
- **WHEN** el API responde `500`, `404`, o la solicitud falla por red
- **THEN** se muestra un mensaje de error genérico y el formulario queda habilitado para reintentar
