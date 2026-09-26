# Spec Delta

## Purpose

Barra de mensajes configurables del cliente que se muestra en todos los templates y desplaza su texto de forma continua, para comunicar lemas o anuncios breves definidos en el panel.

## ADDED Requirements

### Requirement: Origen de los mensajes de la barra
El sistema SHALL obtener los mensajes de la barra desde el campo `gcBar` de la respuesta agregada de `GET /api/public/{clientId}`. Cada mensaje SHALL tratarse como un objeto con `id`, `text`, `order`, `createdAt` y `updatedAt`. El sistema SHALL ignorar los mensajes cuyo `text` esté vacío o contenga solo espacios.

#### Scenario: Cliente con mensajes
- **WHEN** la respuesta agregada del cliente incluye `gcBar` con uno o más mensajes con `text` no vacío
- **THEN** el sistema usa esos mensajes para la barra

#### Scenario: Mensaje sin texto
- **WHEN** un elemento de `gcBar` tiene `text` vacío o compuesto solo por espacios
- **THEN** ese mensaje no se incluye en la barra

### Requirement: Orden de los mensajes
El sistema SHALL mostrar los mensajes ordenados de forma ascendente por el campo `order`.

#### Scenario: Orden ascendente
- **WHEN** `gcBar` contiene mensajes con `order` desordenados
- **THEN** la barra los muestra de menor a mayor `order`

### Requirement: Barra con texto en movimiento
El sistema SHALL renderizar los mensajes en una barra con desplazamiento horizontal continuo e infinito, sin cortes ni saltos visibles, de modo que todos los mensajes pasen por la pantalla de forma cíclica.

#### Scenario: Scroll continuo
- **WHEN** la barra tiene al menos un mensaje
- **THEN** el texto se desplaza de forma continua e infinita y reinicia sin salto visible

#### Scenario: Múltiples mensajes
- **WHEN** la barra tiene más de un mensaje
- **THEN** todos se muestran uno tras otro en el mismo desplazamiento continuo

### Requirement: Ocultar la barra sin mensajes
El sistema SHALL no renderizar la barra cuando `gcBar` esté ausente, sea `null` o no contenga mensajes con texto, sin alterar el resto de la interfaz.

#### Scenario: Cliente sin mensajes
- **WHEN** la respuesta del cliente no incluye `gcBar` o este viene vacío
- **THEN** la barra no se renderiza y el resto del sitio se muestra con normalidad

### Requirement: Accesibilidad de la barra
El sistema SHALL exponer el contenido de la barra de forma legible para tecnologías de asistencia (sin depender de la animación) y SHALL respetar la preferencia `prefers-reduced-motion`: cuando esté activa, SHALL detener el desplazamiento y presentar el texto de forma estática y legible.

#### Scenario: Lectura asistida
- **WHEN** un lector de pantalla recorre la página
- **THEN** el contenido de la barra se anuncia una sola vez, sin repetir el texto duplicado de la animación

#### Scenario: Movimiento reducido
- **WHEN** el usuario tiene activada la preferencia `prefers-reduced-motion: reduce`
- **THEN** la barra no anima y el texto queda visible de forma estática
