# content-sections Specification

## Purpose
Renderiza las secciones de contenido de un cliente (noticias, programas, galerías, podcasts, videocasts, eventos, auspiciadores, promociones y TV en vivo) de forma data-driven: cada sección aparece solo si el backend entrega datos para ese cliente, y se oculta si el recurso viene vacío o nulo.

## Requirements

### Requirement: Secciones visibles solo con datos
Cada sección de contenido SHALL renderizarse únicamente cuando su recurso del API tenga datos para el cliente activo, y SHALL NO renderizarse (ni ocupar espacio) cuando el recurso venga vacío, `null` o con una lista sin elementos.

#### Scenario: Recurso con datos
- **WHEN** el API devuelve elementos para la sección (p. ej. `news.data` con noticias)
- **THEN** la sección se muestra con su contenido

#### Scenario: Recurso vacío o nulo
- **WHEN** el API devuelve una lista vacía o `null` para la sección
- **THEN** la sección no se renderiza y no interfiere con el resto de la página

### Requirement: Estados de carga y error
El sistema SHALL mostrar un estado de carga mientras una sección se obtiene y SHALL degradar sin romper la aplicación si la solicitud falla (recurso no disponible, error de red).

#### Scenario: Carga en progreso
- **WHEN** una sección está obteniendo sus datos
- **THEN** se muestra un estado de carga (placeholder/skeleton) en lugar del contenido

#### Scenario: Error de red
- **WHEN** la solicitud de una sección falla
- **THEN** la sección se omite o muestra un mensaje de degradación, y el resto de la página sigue funcionando

### Requirement: Normalización de datos de la API
El sistema SHALL normalizar los datos de cada sección mediante los adaptadores compartidos (`asArray`, `normalizeWeekDay`, `getNewsCategory`, `normalizePagination`), de modo que variaciones del shape de la API (días numéricos vs. strings, `pagination.pages` vs. `totalPages`, `source: generic` con categoría) se resuelvan de forma consistente.

#### Scenario: Días de programación numéricos
- **WHEN** una sección de programación recibe `weekDays` como números (`0`=Domingo…`6`=Sábado)
- **THEN** se muestra el nombre del día en español

#### Scenario: Noticias genéricas
- **WHEN** `news.source` es `generic` y cada ítem incluye `category`
- **THEN** la sección muestra la categoría sin romper el render

### Requirement: Imágenes de las secciones
Las imágenes de cada sección SHALL resolverse a URLs absolutas con `buildImageUrl` y cargarse con lazy-loading.

#### Scenario: Ruta relativa de imagen
- **WHEN** un ítem entrega `imageUrl` relativo
- **THEN** la imagen se muestra con la URL absoluta correspondiente

### Requirement: Sección de TV en vivo
El sistema SHALL mostrar una sección de TV en vivo solo cuando `basicData.videoStreamingUrl` exista para el cliente, y SHALL ocultarla cuando sea `null`.

#### Scenario: TV disponible
- **WHEN** `basicData.videoStreamingUrl` está presente
- **THEN** la sección de TV en vivo se muestra con la fuente de video

#### Scenario: TV no disponible
- **WHEN** `basicData.videoStreamingUrl` es `null`
- **THEN** la sección de TV en vivo no se muestra
