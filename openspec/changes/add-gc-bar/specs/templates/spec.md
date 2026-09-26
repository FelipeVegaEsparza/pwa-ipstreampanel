# Spec Delta

## ADDED Requirements

### Requirement: Barra GC en todos los templates
Todos los templates SHALL mostrar la barra de mensajes GC debajo de su header y en todas las rutas, siempre que el cliente tenga mensajes. En el template `petroleo` la barra SHALL mostrarse debajo del header y mantenerse separada del ticker de noticias existente. En el template `playlist`, que no tiene header, la barra SHALL mostrarse en la parte superior del layout de contenido. El template `petroleoblue` SHALL heredar el comportamiento de `petroleo`.

#### Scenario: Template con header
- **WHEN** se renderiza cualquiera de los templates con header (`minimalista`, `moderna`, `blue`, `moderno`, `tradicional`, `app`, `covered`, `petroleo`, `petroleoblue`) y el cliente tiene mensajes
- **THEN** la barra GC aparece debajo del header, en la home y en las rutas de listado/detalle

#### Scenario: Template sin header
- **WHEN** se renderiza el template `playlist` y el cliente tiene mensajes
- **THEN** la barra GC aparece en la parte superior del layout de contenido

#### Scenario: petroleo con ticker de noticias
- **WHEN** se renderiza el template `petroleo` con mensajes GC y con noticias
- **THEN** el ticker de noticias existente se mantiene y la barra GC se muestra aparte, debajo del header

#### Scenario: Sin mensajes
- **WHEN** cualquier template se renderiza para un cliente sin mensajes GC
- **THEN** ningún template muestra la barra y el resto del layout no cambia
