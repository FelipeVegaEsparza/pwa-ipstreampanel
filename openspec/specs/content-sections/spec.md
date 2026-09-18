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
El sistema SHALL mostrar una sección de TV en vivo solo cuando `basicData.videoStreamingUrl` exista para el cliente, y SHALL ocultarla cuando sea `null`. El reproductor de la señal SHALL tratar los errores no fatales de HLS como recuperables (sin marcar la señal como caída), SHALL mostrar un estado de error con acción de reintento cuando el error sea fatal o el formato no sea soportado por el navegador, y SHALL marcar el estado de error en vez de permanecer en carga indefinidamente cuando no haya una vía de reproducción disponible.

#### Scenario: TV disponible
- **WHEN** `basicData.videoStreamingUrl` está presente
- **THEN** la sección de TV en vivo se muestra con la fuente de video

#### Scenario: TV no disponible
- **WHEN** `basicData.videoStreamingUrl` es `null`
- **THEN** la sección de TV en vivo no se muestra

#### Scenario: Error no fatal de HLS
- **WHEN** el reproductor recibe un error de HLS recuperable (búfer, fragmento no fatal)
- **THEN** la sección continúa mostrando la señal sin declararla caída

#### Scenario: Formato no soportado
- **WHEN** el navegador no puede reproducir HLS por ninguna vía
- **THEN** la sección muestra un estado de error con opción de reintentar en lugar de quedar cargando

### Requirement: Sección de pronóstico del clima
El stack de contenido SHALL incluir una sección "Clima" con el pronóstico de la ciudad configurada, ubicada según el orden de secciones de cada template. La sección SHALL mostrarse solo cuando el cliente tenga coordenadas en `basicData.location` y SHALL no renderizarse en caso contrario.

#### Scenario: Cliente con ubicación
- **WHEN** el template renderiza sus secciones y `basicData.location` tiene coordenadas
- **THEN** la sección "Clima" aparece en el orden definido para ese template

#### Scenario: Cliente sin ubicación
- **WHEN** `basicData.location` no tiene coordenadas
- **THEN** la sección "Clima" no se renderiza ni ocupa espacio

#### Scenario: Orden por template
- **WHEN** un template define su propio orden de secciones
- **THEN** la sección "Clima" respeta la posición definida para ese template
