## ADDED Requirements

### Requirement: Títulos de sección con acento de marca en `covered`
El template `covered` SHALL presentar los títulos de las secciones de contenido con un acento de marca consistente: una barra vertical a la izquierda del texto y una regla bajo el título, ambas con el color de acento del template, manteniendo el texto del título legible. Este tratamiento SHALL aplicar únicamente cuando el template seleccionado es `covered`; los demás templates SHALL conservar el estilo de título que usan hoy, sin barra lateral.

#### Scenario: Títulos de sección en covered
- **WHEN** un cliente con template `covered` abre su home y hay secciones con datos
- **THEN** cada título de sección se muestra con la barra de acento a la izquierda y la regla bajo el texto

#### Scenario: Otro template conserva su estilo de título
- **WHEN** un cliente con un template distinto de `covered` abre su home
- **THEN** los títulos de sección se muestran con el estilo que ese template usaba antes de este cambio, sin barra lateral

#### Scenario: Sección sin datos
- **WHEN** en un cliente `covered` una sección no tiene datos
- **THEN** esa sección no se renderiza y no altera el estilo ni el orden de las demás
