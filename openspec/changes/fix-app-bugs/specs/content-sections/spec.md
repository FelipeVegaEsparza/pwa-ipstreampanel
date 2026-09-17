## MODIFIED Requirements

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
