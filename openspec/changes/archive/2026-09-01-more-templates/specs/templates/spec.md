## Purpose

Registro ampliado de templates del sistema `templates`, agregando `blue`, `moderno`, `tradicional`, `app`, `petroleo`, `playlist` y `covered` como diseños seleccionables desde el panel (`selectedTemplate`), con fallback al default.

## ADDED Requirements

### Requirement: Templates adicionales seleccionables
El sistema SHALL renderizar los templates `blue`, `moderno`, `tradicional`, `app`, `petroleo`, `playlist` y `covered` cuando `selectedTemplate` coincida con su id, manteniendo el fallback al default (`minimalista`) para ids desconocidos o `null`.

#### Scenario: Template registrado
- **WHEN** el panel entrega `selectedTemplate: "petroleo"` y ese template está registrado
- **THEN** se renderiza el diseño del template `petroleo`

#### Scenario: Fallback
- **WHEN** el panel entrega un id de template no registrado
- **THEN** se renderiza el template por defecto sin romper la aplicación

### Requirement: Reutilización del shell compartido
Los templates nuevos SHALL compartir el mismo `TemplateShell` y el mismo hero de reproductor, diferenciándose solo por sus variables CSS (colores, disposición), de modo que el cambio de template no duplique lógica.

#### Scenario: Cambio de template
- **WHEN** se cambia `selectedTemplate` entre los templates nuevos
- **THEN** el reproductor, el contenido y la PWA se mantienen, cambiando solo el diseño
