# Spec Delta

## Purpose

Permite que cada cliente aplique un color de acento libre sobre cualquier
template, leído de la API del panel, con derivación de variantes y fallback al
color propio de la plantilla.

## ADDED Requirements

### Requirement: Acento por cliente desde la API
El sistema SHALL leer `accentColor` (hexadecimal `#RRGGBB`, nullable) de los
datos del cliente y SHALL aplicarlo a la interfaz cuando tenga un valor válido.
Cuando `accentColor` sea `null`, esté ausente o sea inválido, el sistema SHALL
usar el color propio del template sin romper el diseño.

#### Scenario: Color válido
- **WHEN** el cliente tiene `accentColor` con un hex válido (`#RRGGBB`)
- **THEN** la interfaz usa ese color como acento

#### Scenario: Sin color configurado
- **WHEN** `accentColor` es `null` o no está presente
- **THEN** la interfaz usa el color de acento propio del template

#### Scenario: Color inválido
- **WHEN** `accentColor` tiene un formato inválido
- **THEN** el sistema ignora el valor y usa el color propio del template

### Requirement: Aplicación en runtime sobre el template seleccionado
El sistema SHALL aplicar el `accentColor` en tiempo de ejecución sobre el
template actualmente seleccionado, sin recompilar ni cambiar de template, y
SHALL degradar al comportamiento actual cuando no haya color.

#### Scenario: Cambio sin recompilar
- **WHEN** el administrador cambia `accentColor` en el panel y el usuario recarga
- **THEN** el sitio aplica el nuevo acento sin reconstruir el bundle del cliente

#### Scenario: Comportamiento sin color
- **WHEN** el cliente no tiene `accentColor`
- **THEN** el sitio se ve igual que antes de esta capacidad

### Requirement: Derivación de variantes y contraste
El sistema SHALL derivar a partir del hex elegido las variantes necesarias
(hover, versión tenue y color de texto sobre el acento), y SHALL elegir un color
de texto con contraste suficiente según la luminancia del acento.

#### Scenario: Acento oscuro
- **WHEN** el acento elegido es oscuro
- **THEN** el texto sobre el acento se muestra en color claro

#### Scenario: Acento claro
- **WHEN** el acento elegido es claro
- **THEN** el texto sobre el acento se muestra en color oscuro

### Requirement: Protagonismo del acento
Cuando el cliente define un `accentColor`, el acento SHALL tener presencia
destacada en los títulos de sección (una marca de acento), en el reproductor y
en los fondos con gradiente de los templates (un realce derivado del acento),
además de los roles que ya lo usan, sin alterar las tipografías ni la estructura
del diseño. Cuando no hay `accentColor`, estos realces SHALL quedar neutros para
no cambiar el diseño original.

#### Scenario: Título de sección con acento
- **WHEN** el cliente tiene `accentColor`
- **THEN** los títulos de sección muestran una marca con el acento

#### Scenario: Reproductor con acento
- **WHEN** el cliente tiene `accentColor`
- **THEN** el reproductor incorpora el acento en su borde superior

#### Scenario: Fondo con realce del acento
- **WHEN** el cliente tiene `accentColor`
- **THEN** los fondos con gradiente de los templates incluyen un realce derivado del acento

#### Scenario: Sin acento no cambia el diseño
- **WHEN** el cliente no tiene `accentColor`
- **THEN** los títulos, el reproductor y los fondos se ven igual que antes

### Requirement: Alcance sobre componentes compartidos
El acento por cliente SHALL aplicarse también a los componentes compartidos que
usan el rol de acento (reproductor, resaltado de titulares de sección, barra de
mensajes y tarjetas de contenido), no solo al chrome propio del template.

#### Scenario: Componentes compartidos
- **WHEN** el cliente define un `accentColor`
- **THEN** el botón de reproducción, el resaltado de titulares y las tarjetas de contenido usan ese acento

### Requirement: Alcance por tipo de template
En templates de un solo acento, el `accentColor` SHALL reemplazar ese acento. En
templates bi-tono, SHALL reemplazar el color primario y conservar el secundario.
En templates de acento claro, SHALL reemplazar ese acento claro por el elegido.

#### Scenario: Template de un solo acento
- **WHEN** el template seleccionado usa un único acento y hay `accentColor`
- **THEN** ese acento se reemplaza por el elegido

#### Scenario: Template bi-tono
- **WHEN** el template seleccionado es bi-tono y hay `accentColor`
- **THEN** se reemplaza el acento primario y se conserva el secundario

#### Scenario: Template de acento claro
- **WHEN** el template seleccionado usa acento claro y hay `accentColor`
- **THEN** el acento claro se reemplaza por el color elegido
