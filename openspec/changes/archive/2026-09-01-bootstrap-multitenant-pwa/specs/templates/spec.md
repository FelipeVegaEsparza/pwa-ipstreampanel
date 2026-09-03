## Purpose

Renderiza el sitio de cada cliente con un diseño (template) seleccionado desde el panel de IPStream a través del campo `selectedTemplate`, permitiendo cambiar el aspecto sin redesplegar, e incluye un reproductor mínimo conectado al estado en vivo.

## ADDED Requirements

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
