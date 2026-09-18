## ADDED Requirements

### Requirement: Apertura de contenido en modal
Los ítems de las secciones de Noticias, Podcasts y Videocasts del home SHALL abrir su contenido en un modal in-place al hacer clic, sin navegar a una página aparte: noticia como lectura, podcast con su reproductor de audio cuando exista `audioUrl`, y videocast con su reproductor de video cuando exista `videoUrl`. El modal SHALL poder cerrarse y SHALL devolver el foco sin recargar ni perder el estado de la home. Aplica a todos los templates.

#### Scenario: Noticia en modal
- **WHEN** el usuario hace clic en una noticia del home
- **THEN** se abre un modal con el contenido de la noticia y la URL del home no cambia

#### Scenario: Podcast en modal con audio
- **WHEN** el usuario hace clic en un podcast que tiene `audioUrl`
- **THEN** se abre un modal con el detalle del podcast y su reproductor de audio, sin recargar la página

#### Scenario: Videocast en modal con video
- **WHEN** el usuario hace clic en un videocast que tiene `videoUrl`
- **THEN** se abre un modal con el detalle del videocast y su reproductor de video, sin recargar la página

#### Scenario: Cierre del modal
- **WHEN** el usuario cierra el modal
- **THEN** vuelve a la home sin recarga y puede seguir navegando las secciones

### Requirement: Listado completo en modal
Las acciones "Ver todas/todos" de las secciones Noticias, Podcasts y Videocasts SHALL abrir un modal con el listado correspondiente en lugar de navegar a una página, y SHALL permitir abrir un ítem de ese listado en el mismo modal de contenido.

#### Scenario: Ver todas en modal
- **WHEN** el usuario activa "Ver todas/todos" en una de esas secciones
- **THEN** se abre un modal con el listado de elementos en vez de navegar a la página de listado

#### Scenario: Abrir un ítem desde el listado
- **WHEN** el usuario selecciona un ítem dentro del modal de listado
- **THEN** se muestra su contenido en el modal, sin salir del home

#### Scenario: Listado vacío
- **WHEN** la sección no tiene elementos
- **THEN** la acción "Ver todas/todos" no se ofrece
