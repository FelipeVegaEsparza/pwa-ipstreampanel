## Purpose

Render del template `minimalista` como un reproductor now-playing con fondo dinámico de la portada del tema, enfocado solo en streaming (actual + siguiente), TV, redes sociales y compartir.

## ADDED Requirements

### Requirement: Reproductor now-playing
El template `minimalista` SHALL renderizar su home como un reproductor centrado que muestra portada, tema actual (título y artista), indicador EN VIVO, oyentes, barra de avance, control play/pausa y el siguiente tema, sin mostrar las secciones de contenido.

#### Scenario: Home del template minimalista
- **WHEN** el cliente usa `minimalista` y abre la home
- **THEN** se muestra el reproductor now-playing con tema actual y siguiente

### Requirement: Fondo dinámico
El fondo del template SHALL usar la portada del tema actual (desenfocada con overlay), cambiando junto al cambio de tema, y adaptarse a cualquier tamaño de pantalla.

#### Scenario: Cambio de tema
- **WHEN** cambia el tema en reproducción
- **THEN** el fondo cambia a la nueva portada del tema

### Requirement: TV solo con botón
El template SHALL mostrar un botón "Señal de TV" solo si `basicData.videoStreamingUrl` existe; al hacer clic, abre un modal con la reproducción del video.

#### Scenario: TV disponible
- **WHEN** `videoStreamingUrl` existe
- **THEN** se muestra el botón "Señal de TV" que abre el modal de video

#### Scenario: TV no disponible
- **WHEN** `videoStreamingUrl` es `null`
- **THEN** el botón no se muestra

### Requirement: Redes sociales y compartir
El template SHALL mostrar las redes sociales configuradas y un botón de compartir el sitio.

#### Scenario: Compartir
- **WHEN** el usuario hace clic en compartir
- **THEN** se comparte/copia el enlace del sitio
