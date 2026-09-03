## Purpose

Mejora el reproductor mostrando el siguiente tema en reproducción y una barra de avance con el tiempo transcurrido y la duración del tema actual, calculada localmente y anclada al cambio de tema.

## ADDED Requirements

### Requirement: Mostrar el siguiente tema
El sistema SHALL mostrar el `nextTrack` del streaming (portada pequeña, título y artista) en los reproductores cuando exista.

#### Scenario: Hay siguiente tema
- **WHEN** `streaming.nextTrack` existe
- **THEN** el reproductor muestra su portada, título y artista

#### Scenario: Sin siguiente tema
- **WHEN** `streaming.nextTrack` es `null`
- **THEN** no se muestra el bloque de siguiente tema sin romper la interfaz

### Requirement: Barra de avance del tema actual
El sistema SHALL mostrar una barra de progreso del tema actual con el tiempo transcurrido y la duración (`mm:ss`), usando `currentTrack.duration` (segundos).

#### Scenario: Tema en reproducción
- **WHEN** el reproductor está reproduciendo y hay un tema con duración
- **THEN** la barra avanza y muestra el tiempo transcurrido vs. la duración

#### Scenario: Sin duración
- **WHEN** `currentTrack.duration` no existe o es cero
- **THEN** la barra se oculta o se muestra sin avance sin romper la interfaz

### Requirement: Anclaje al cambio de tema
El sistema SHALL reiniciar el avance cuando cambia el tema actual, usando como clave la portada del tema o, en su defecto, `título|artista`.

#### Scenario: Cambio de tema
- **WHEN** cambia la clave del tema actual
- **THEN** la barra se reinicia desde el inicio del nuevo tema

### Requirement: Pausa del avance
El sistema SHALL detener el avance de la barra cuando el reproductor está en pausa y reanudarlo al reproducir.

#### Scenario: Pausa
- **WHEN** el usuario pausa la reproducción
- **THEN** el avance se detiene
