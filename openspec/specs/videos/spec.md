# videos Specification

## Purpose
Muestra el ranking de videos del cliente (`GET /videos`, ordenado por `order`) cuando existan, con reproducción al hacer clic.

## Requirements

### Requirement: Mostrar ranking de videos
El sistema SHALL mostrar la sección de videos del cliente y SHALL renderizarla solo si hay videos con `videoUrl`.

#### Scenario: Sin videos
- **WHEN** `videos` devuelve una lista vacía o sin `videoUrl`
- **THEN** la sección de videos no se renderiza

#### Scenario: Con videos
- **WHEN** `videos` tiene elementos con `videoUrl`
- **THEN** la sección se muestra ordenada por `order`

### Requirement: Reproducir video
El sistema SHALL permitir reproducir el video al hacer clic en él (embebido/iframe para URLs de YouTube y reproducción nativa para URLs de archivo).

#### Scenario: Clic en un video
- **WHEN** el usuario hace clic en un video del ranking
- **THEN** se reproduce el video correspondiente
