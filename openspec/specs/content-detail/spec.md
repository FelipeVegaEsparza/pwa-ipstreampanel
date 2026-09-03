# content-detail Specification

## Purpose
Provee las páginas de detalle enrutadas de los contenidos de lectura: noticia por slug, podcast por id y videocast por id, accesibles por URL directa (deep link) y con manejo de no encontrado.

## Requirements

### Requirement: Detalle de noticia por slug
El sistema SHALL renderizar la página de detalle de una noticia bajo la ruta `/noticias/:slug`, consultando `GET /news/{slug}` del cliente activo.

#### Scenario: Slug válido
- **WHEN** el usuario navega a `/noticias/mi-noticia` y el slug existe
- **THEN** se muestra el detalle de la noticia (título, textos, imagen)

#### Scenario: Slug inexistente
- **WHEN** el slug no existe o la noticia no está disponible
- **THEN** se muestra una pantalla de "no encontrado" sin romper la aplicación

### Requirement: Detalle de podcast por id
El sistema SHALL renderizar la página de detalle de un podcast bajo la ruta `/podcasts/:id`, consultando `GET /podcasts/{id}` del cliente activo, e incluir el reproductor de audio del episodio cuando exista `audioUrl`.

#### Scenario: Podcast válido
- **WHEN** el usuario navega a `/podcasts/{id}` y el episodio existe
- **THEN** se muestra el detalle del podcast y un reproductor de audio si hay `audioUrl`

#### Scenario: Podcast inexistente
- **WHEN** el id no existe
- **THEN** se muestra la pantalla de "no encontrado"

### Requirement: Detalle de videocast por id
El sistema SHALL renderizar la página de detalle de un videocast bajo la ruta `/videocasts/:id`, consultando `GET /videocasts/{id}` del cliente activo, e incluir el reproductor de video cuando exista `videoUrl`.

#### Scenario: Videocast válido
- **WHEN** el usuario navega a `/videocasts/{id}` y el episodio existe
- **THEN** se muestra el detalle del videocast y un reproductor de video si hay `videoUrl`

#### Scenario: Videocast inexistente
- **WHEN** el id no existe
- **THEN** se muestra la pantalla de "no encontrado"

### Requirement: Acceso por URL directa
El sistema SHALL permitir cargar las páginas de detalle directamente por su URL (al recargar o pegar el enlace), con el fallback SPA del servidor.

#### Scenario: Recarga de una URL de detalle
- **WHEN** el usuario recarga `/noticias/:slug` u otra ruta de detalle
- **THEN** la aplicación carga el detalle correspondiente sin romperse
