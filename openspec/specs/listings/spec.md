# listings Specification

## Purpose
Provee páginas de listado paginado para noticias, podcasts y videocasts (con enlaces "Ver todas" desde el home), usando la paginación `page`/`limit` del contrato y el componente de paginación.

## Requirements

### Requirement: Listado paginado de noticias
El sistema SHALL proveer una página `/noticias` que liste las noticias con paginación (`GET /news?page&limit`) y permita navegar entre páginas.

#### Scenario: Navegación de página
- **WHEN** el usuario cambia de página en el listado de noticias
- **THEN** se cargan las noticias de la nueva página y la paginación refleja el total

#### Scenario: Listado vacío
- **WHEN** no hay noticias
- **THEN** el listado muestra un estado vacío sin romper la página

### Requirement: Listado paginado de podcasts
El sistema SHALL proveer una página `/podcasts` que liste los podcasts con paginación (`GET /podcasts?page&limit`), cada uno con enlace a su detalle.

#### Scenario: Navegación de página
- **WHEN** el usuario cambia de página en el listado de podcasts
- **THEN** se cargan los podcasts de la nueva página

### Requirement: Listado paginado de videocasts
El sistema SHALL proveer una página `/videocasts` que liste los videocasts con paginación (`GET /videocasts?page&limit`), cada uno con enlace a su detalle.

#### Scenario: Navegación de página
- **WHEN** el usuario cambia de página en el listado de videocasts
- **THEN** se cargan los videocasts de la nueva página

### Requirement: Acceso desde el home
Las secciones del home con más de una página SHALL ofrecer un enlace "Ver todas" a la página de listado correspondiente.

#### Scenario: Enlace ver todas
- **WHEN** una sección del home tiene más elementos que los mostrados
- **THEN** se muestra un enlace "Ver todas" a la página de listado
