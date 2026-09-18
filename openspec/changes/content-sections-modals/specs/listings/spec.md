## MODIFIED Requirements

### Requirement: Acceso desde el home
Las secciones del home con más de una página SHALL ofrecer una acción "Ver todas" que abra un modal con el listado correspondiente, en lugar de navegar a la página de listado. La página de listado SHALL seguir disponible para acceso por URL directa (deep link o recarga).

#### Scenario: Enlace ver todas
- **WHEN** una sección del home tiene más elementos que los mostrados
- **THEN** se muestra la acción "Ver todas" que abre el listado en un modal

#### Scenario: Acceso directo a la página de listado
- **WHEN** el usuario entra o recarga la URL `/noticias`, `/podcasts` o `/videocasts`
- **THEN** se muestra la página de listado paginada como hasta ahora
