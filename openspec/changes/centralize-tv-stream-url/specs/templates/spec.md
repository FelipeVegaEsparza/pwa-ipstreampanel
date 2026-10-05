# Spec Delta

## ADDED Requirements

### Requirement: Fuente central de TV en los templates
Todos los reproductores de TV de los templates SHALL resolver su fuente con la
misma regla central (desde `basicData.videoStreamingUrl`) y SHALL NO construir
rutas de stream (`/live`, `/dj`, `/vod`). Un template SHALL montar el
reproductor de TV solo cuando esa URL exista.

#### Scenario: Template en modo TV
- **WHEN** un template renderiza su reproductor de TV y `basicData.videoStreamingUrl` existe
- **THEN** reproduce la URL estable entregada por el panel

#### Scenario: Template sin TV
- **WHEN** `basicData.videoStreamingUrl` es `null` o vacío
- **THEN** el template no monta el reproductor de TV
