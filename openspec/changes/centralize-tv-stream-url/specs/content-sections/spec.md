# Spec Delta

## ADDED Requirements

### Requirement: Fuente única de la TV en vivo
El sistema SHALL obtener la URL de la TV en vivo exclusivamente desde
`basicData.videoStreamingUrl` del cliente activo, y SHALL NO construir ni
derivar rutas de stream (`/live`, `/dj`, `/vod`) por su cuenta. Cuando
`basicData.videoStreamingUrl` sea `null` o vacío, el sistema SHALL tratar la TV
como no disponible.

#### Scenario: URL estable del panel
- **WHEN** `basicData.videoStreamingUrl` contiene una URL (p. ej. `/tv/<streamKey>.m3u8`)
- **THEN** el reproductor usa esa URL tal cual, sin modificarla ni recomponerla

#### Scenario: Sin URL de TV
- **WHEN** `basicData.videoStreamingUrl` es `null` o vacío
- **THEN** no se intenta reproducir ni se construye una URL alternativa
