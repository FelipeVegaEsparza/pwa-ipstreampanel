## MODIFIED Requirements

### Requirement: Reproducir video
El sistema SHALL permitir reproducir el video al hacer clic en él: embebido/iframe para URLs de YouTube y Vimeo, reproducción nativa para URLs de archivo directo, y reproducción mediante HLS para URLs de lista de reproducción (`.m3u8`), que no SHALL enviarse a un elemento `<video>` nativo cuando el navegador no soporte HLS.

#### Scenario: Clic en un video
- **WHEN** el usuario hace clic en un video del ranking
- **THEN** se reproduce el video correspondiente

#### Scenario: Video con URL HLS
- **WHEN** el ranking incluye un video con `videoUrl` terminada en `.m3u8`
- **THEN** se reproduce con el reproductor HLS (o HLS nativo) y no con `<video>` plano, de modo que no falle silenciosamente
