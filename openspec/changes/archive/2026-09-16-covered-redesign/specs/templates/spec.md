## Purpose

Render del template `covered` como sitio de radio completo estilo magicafm: hero de reproductor destacado y, bajo él, todo el contenido del cliente.

## ADDED Requirements

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
