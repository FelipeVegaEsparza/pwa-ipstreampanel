# templates Specification

## Purpose
Registro ampliado de templates del sistema `templates`, agregando `blue`, `moderno`, `tradicional`, `app`, `petroleo`, `playlist` y `covered` como diseños seleccionables desde el panel (`selectedTemplate`), con fallback al default.

## Requirements

### Requirement: Templates adicionales seleccionables
El sistema SHALL renderizar los templates `blue`, `moderno`, `tradicional`, `app`, `petroleo`, `playlist` y `covered` cuando `selectedTemplate` coincida con su id, manteniendo el fallback al default (`minimalista`) para ids desconocidos o `null`.

#### Scenario: Template registrado
- **WHEN** el panel entrega `selectedTemplate: "petroleo"` y ese template está registrado
- **THEN** se renderiza el diseño del template `petroleo`

#### Scenario: Fallback
- **WHEN** el panel entrega un id de template no registrado
- **THEN** se renderiza el template por defecto sin romper la aplicación

### Requirement: Reutilización del shell compartido
Los templates nuevos SHALL compartir el mismo `TemplateShell` y el mismo hero de reproductor, diferenciándose solo por sus variables CSS (colores, disposición), de modo que el cambio de template no duplique lógica.

#### Scenario: Cambio de template
- **WHEN** se cambia `selectedTemplate` entre los templates nuevos
- **THEN** el reproductor, el contenido y la PWA se mantienen, cambiando solo el diseño

### Requirement: Seleccionar template desde el panel
El sistema SHALL leer `selectedTemplate` de la respuesta de `GET /api/public/{clientId}` y renderizar el template registrado con ese id. Si el id no existe o es `null`, SHALL usar el template por defecto.

#### Scenario: Template conocido
- **WHEN** el panel entrega `selectedTemplate: "moderna"` y ese template está registrado
- **THEN** se renderiza el diseño del template `moderna`

#### Scenario: Template desconocido o nulo
- **WHEN** el panel entrega un id de template no registrado, o `null`
- **THEN** se renderiza el template por defecto sin romper la aplicación

### Requirement: Cambio de template sin redesplegar
El sistema SHALL reflejar un cambio de `selectedTemplate` en el panel al recargar la aplicación, sin necesidad de reconstruir ni redesplegar el cliente.

#### Scenario: Cambio en el panel
- **WHEN** el administrador cambia `selectedTemplate` en el panel y el usuario recarga
- **THEN** la aplicación renderiza el nuevo template

### Requirement: Reproductor mínimo en el template
El template SHALL tomar `basicData.radioStreamingUrl` como fuente de audio del reproductor y SHALL mostrar el estado en vivo (`status`, `isLive`, tema actual, artistas y oyentes) consultando `/streaming` con polling.

#### Scenario: Fuente disponible
- **WHEN** `basicData.radioStreamingUrl` existe
- **THEN** el botón de reproducción está habilitado y reproduce esa URL

#### Scenario: Fuente ausente
- **WHEN** no hay `radioStreamingUrl`
- **THEN** el botón de reproducción está deshabilitado y la interfaz no falla

#### Scenario: Estado del streaming
- **WHEN** el endpoint `/streaming` responde con `status` y `currentTrack`
- **THEN** el template muestra el estado (en vivo/fuera del aire), tema, artista y oyentes, y refresca periódicamente

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
