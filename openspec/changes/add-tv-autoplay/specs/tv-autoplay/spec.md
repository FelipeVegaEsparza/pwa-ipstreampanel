# Spec Delta

## Purpose

Hace que el reproductor de video arranque automáticamente al abrir el sitio,
degradando a reproducción silenciada cuando el navegador bloquea el autoplay con
sonido y ofreciendo un control para activarlo.

## ADDED Requirements

### Requirement: Autoplay del video
Al montar el reproductor de video con una fuente disponible, el sistema SHALL
intentar reproducirlo automáticamente, sin esperar una acción del usuario.

#### Scenario: Autoplay permitido
- **WHEN** el reproductor de video monta con una fuente válida y el navegador permite el autoplay con sonido
- **THEN** el video comienza a reproducirse automáticamente con sonido

### Requirement: Degradación a reproducción silenciada
Cuando el navegador rechace el autoplay con sonido, el sistema SHALL reproducir
el video silenciado automáticamente y SHALL indicar que el sonido está
silenciado.

#### Scenario: Autoplay con sonido bloqueado
- **WHEN** el intento de autoplay con sonido es rechazado por el navegador
- **THEN** el video se reproduce automáticamente en silencio

### Requirement: Control para activar el sonido
El sistema SHALL ofrecer un control visible para activar el sonido; al usarlo
(gesto del usuario), SHALL quitar el silencio y reproducir con sonido.

#### Scenario: Activar sonido
- **WHEN** el video está en reproducción silenciada y el usuario pulsa "Activar sonido"
- **THEN** el video continúa reproduciéndose y ahora con sonido

#### Scenario: Sin degradación
- **WHEN** el video se reproduce con sonido (no fue silenciado)
- **THEN** el control para activar el sonido no se muestra

### Requirement: Estado de reproducción real
El estado "reproduciendo" del reproductor SHALL reflejar la reproducción efectiva
del video (evento `playing`), no solo la disponibilidad del manifiesto.

#### Scenario: Estado tras el arranque
- **WHEN** el video empieza a reproducir efectivamente
- **THEN** el reproductor pasa a estado "reproduciendo"

#### Scenario: Fallo del proveedor
- **WHEN** la señal falla de forma fatal
- **THEN** el reproductor muestra el estado de error con la opción de reintentar
