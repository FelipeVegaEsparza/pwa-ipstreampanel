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

### Requirement: Orden editorial de secciones en la home de `covered`
En la home del template `covered`, bajo el hero, el sistema SHALL mostrar las secciones de contenido en este orden: noticias, podcasts, videocasts, galerías, eventos y locutores; y después de ellas SHALL mostrar las secciones restantes (encuestas, TV, promociones, programas, videos, auspiciadores, redes y chat) conservando su orden relativo actual. Este orden SHALL aplicarse únicamente cuando el template seleccionado es `covered`; los demás templates SHALL conservar el orden que usan hoy. Cada sección SHALL seguir mostrándose solo si su recurso tiene datos.

#### Scenario: Home de covered con datos completos
- **WHEN** un cliente con template `covered` abre la home y tiene datos en todas las secciones
- **THEN** las secciones se muestran bajo el hero en el orden noticias, podcasts, videocasts, galerías, eventos, locutores y luego encuestas, TV, promociones, programas, videos, auspiciadores, redes y chat

#### Scenario: Home de covered con secciones sin datos
- **WHEN** en un cliente `covered` alguna de las secciones no tiene datos
- **THEN** esa sección no se renderiza y no altera el orden del resto

#### Scenario: Otro template conserva su orden
- **WHEN** un cliente con template distinto de `covered` abre su home
- **THEN** las secciones se muestran en el orden que el template usaba antes de este cambio

### Requirement: Bloque de identidad de la radio antes del footer
El template `covered` SHALL mostrar, entre el contenido y el footer, una sección de identidad de la radio con dos columnas: a la izquierda la imagen del cover de la radio y a la derecha el título de la radio y su descripción. Los datos SHALL provenir de `basicData` (`projectName` como título, `projectDescription` como descripción y el cover de la radio como imagen). El bloque SHALL ser adaptativo (columnas apiladas en pantallas pequeñas) y SHALL aparecer solo en el template `covered`.

#### Scenario: Radio con cover y descripción
- **WHEN** un cliente `covered` entrega `basicData` con cover de radio, `projectName` y `projectDescription`
- **THEN** el bloque se muestra antes del footer con el cover a la izquierda y el título con su descripción a la derecha

#### Scenario: Radio sin cover
- **WHEN** el cliente `covered` no entrega cover de la radio pero sí `logoUrl`
- **THEN** el bloque se muestra igual usando el logo de la radio como imagen de la columna izquierda

#### Scenario: Otro template
- **WHEN** un cliente con template distinto de `covered` abre su sitio
- **THEN** el bloque de identidad de la radio no se muestra

### Requirement: Hero de reproductor
`covered` SHALL mostrar un hero con la portada del tema, estado ON AIR/"reproduciendo ahora", título, artista y álbum del tema actual, botón de reproducción, compartir, oyentes/bitrate, barra de avance y el siguiente tema.

#### Scenario: Hero
- **WHEN** el cliente usa `covered`
- **THEN** el hero muestra el reproductor con los datos del tema actual y el siguiente

### Requirement: Contenido completo bajo el hero
`covered` SHALL mostrar bajo el hero el contenido de todos los endpoints disponibles del cliente (noticias, programas, galerías, podcasts, videocasts, videos, encuestas, eventos, auspiciadores, locutores, promociones, redes y TV), cada sección solo si tiene datos, y las rutas de detalle.

#### Scenario: Contenido del home
- **WHEN** se abre la home en `covered`
- **THEN** se muestran las secciones de contenido disponibles (solo las que tienen datos)

### Requirement: Fondo dinámico del hero
El hero SHALL usar la portada del tema actual como fondo, con overlay que garantiza contraste y adaptación a cualquier pantalla.

#### Scenario: Fondo
- **WHEN** cambia el tema en reproducción
- **THEN** el fondo del hero cambia a la nueva portada
