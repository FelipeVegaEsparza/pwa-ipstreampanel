## ADDED Requirements

### Requirement: Manejo de errores de conexión en páginas de detalle
Las páginas de detalle (noticia por slug, podcast por id, videocast por id) SHALL distinguir entre un recurso inexistente (HTTP 404) y un error de conexión o de servidor. Ante un recurso inexistente SHALL mostrar una pantalla de "no encontrado"; ante un error de conexión o servidor SHALL mostrar un mensaje de error recuperable que permita reintentar la consulta, sin presentarlo como "no encontrado".

#### Scenario: Recurso inexistente
- **WHEN** la consulta de detalle responde HTTP 404
- **THEN** se muestra la pantalla de "no encontrado"

#### Scenario: Error de conexión en un detalle profundo
- **WHEN** la consulta de detalle falla por red, timeout o error 5xx
- **THEN** se muestra un mensaje de error con una acción para reintentar, distinto de "no encontrado"
