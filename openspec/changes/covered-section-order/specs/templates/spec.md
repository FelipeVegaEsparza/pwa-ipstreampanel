## ADDED Requirements

### Requirement: Orden editorial de secciones en la home de `covered`
En la home del template `covered`, bajo el hero, el sistema SHALL mostrar las secciones de contenido en este orden: noticias, podcasts, videocasts, galerías, eventos y locutores; y después de ellas SHALL mostrar las secciones restantes (encuestas, TV, promociones, programas, videos, auspiciadores, redes y chat) conservando su orden relativo actual. Este orden SHALL aplicarse únicamente cuando el template seleccionado es `covered`; los demás templates SHALL conservar el orden que usan hoy. Cada sección SHALL seguir mostrándose solo si su recurso tiene datos.

#### Scenario: Home de covered con datos completos
- **WHEN** un cliente con template `covered` abre la home y tiene datos en todas las secciones
- **THEN** las secciones se muestran bajo el hero en el orden noticias, podcasts, videocasts, galerías, eventos, locutores y luego encuestas, TV, promociones, programas, videos, auspiciadores, redes y chat

#### Scenario: Home de covered con secciones sin datos
- **WHEN** en un cliente `covered` alguna de las secciones no tiene datos
- **THEN** esa sección no se renderiza y no altera el orden del resto

#### Scenario: Otro template conserva su orden
- **WHEN** un cliente con template distinto de `covered` abre su home
- **THEN** las secciones se muestran en el orden que el template usaba antes de este cambio

### Requirement: Bloque de identidad de la radio antes del footer
El template `covered` SHALL mostrar, entre el contenido y el footer, una sección de identidad de la radio con dos columnas: a la izquierda la imagen del cover de la radio y a la derecha el título de la radio y su descripción. Los datos SHALL provenir de `basicData` (`projectName` como título, `projectDescription` como descripción y el cover de la radio como imagen). El bloque SHALL ser adaptativo (columnas apiladas en pantallas pequeñas) y SHALL aparecer solo en el template `covered`.

#### Scenario: Radio con cover y descripción
- **WHEN** un cliente `covered` entrega `basicData` con cover de radio, `projectName` y `projectDescription`
- **THEN** el bloque se muestra antes del footer con el cover a la izquierda y el título con su descripción a la derecha

#### Scenario: Radio sin cover
- **WHEN** el cliente `covered` no entrega cover de la radio pero sí `logoUrl`
- **THEN** el bloque se muestra igual usando el logo de la radio como imagen de la columna izquierda

#### Scenario: Otro template
- **WHEN** un cliente con template distinto de `covered` abre su sitio
- **THEN** el bloque de identidad de la radio no se muestra
