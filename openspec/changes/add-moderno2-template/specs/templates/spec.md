# Spec Delta

## ADDED Requirements

### Requirement: Template moderno2
El sistema SHALL renderizar el template `moderno2` cuando `selectedTemplate`
coincida con ese id, manteniendo el fallback al template por defecto para ids
desconocidos o `null`. El template SHALL reutilizar el shell compartido
(reproductor persistente, secciones de contenido y PWA), diferenciándose por su
hero de reproductor, navegación por secciones y paleta.

#### Scenario: Template seleccionado
- **WHEN** el panel entrega `selectedTemplate: "moderno2"`
- **THEN** se renderiza el diseño `moderno2`

#### Scenario: Fallback
- **WHEN** `selectedTemplate` es un id no registrado o `null`
- **THEN** se renderiza el template por defecto sin romper la aplicación

### Requirement: Orden de secciones del template moderno2
El template `moderno2` SHALL mostrar todas las secciones de contenido cuyos
recursos tengan datos: noticias, programas, TV en vivo, videos, locutores,
auspiciadores, promociones, podcasts, videocasts, galerías, eventos y encuestas;
y luego el clima. El orden SHALL aplicarse únicamente cuando el template
seleccionado es `moderno2`. Las redes sociales SHALL NO mostrarse como sección,
ya que están presentes en el header y el footer.

#### Scenario: Home de moderno2 con datos
- **WHEN** un cliente con template `moderno2` abre la home
- **THEN** las secciones se muestran en el orden definido para `moderno2`

#### Scenario: Sección sin datos
- **WHEN** en un cliente `moderno2` una sección no tiene datos
- **THEN** esa sección no se renderiza y no altera el orden del resto

#### Scenario: Otro template
- **WHEN** un cliente con template distinto de `moderno2` abre su home
- **THEN** las secciones conservan el orden que ese template usaba

### Requirement: Noticias del template moderno2
El template `moderno2` SHALL mostrar la sección de noticias con una noticia
principal a la izquierda y hasta tres noticias secundarias a la derecha, y SHALL
usar para las tarjetas de contenido la paleta oscura del template en lugar de
tarjetas blancas.

#### Scenario: Noticia principal y secundarias
- **WHEN** el cliente tiene noticias y usa `moderno2`
- **THEN** se muestra una noticia principal a la izquierda y hasta tres noticias a la derecha

#### Scenario: Paleta oscura de las tarjetas
- **WHEN** se renderiza la sección de noticias en `moderno2`
- **THEN** las tarjetas usan el fondo y el texto oscuros del template

### Requirement: Programación por día del template moderno2
El template `moderno2` SHALL mostrar la programación separada por día: una fila
de días en la parte superior (Lunes a Domingo) y, al seleccionar un día, las
tarjetas de los programas de ese día con los datos que expone la API (imagen,
horario de inicio y fin, días y descripción). Si el día seleccionado no tiene
programas, SHALL mostrar un aviso sin romper la sección.

#### Scenario: Cambio de día
- **WHEN** el usuario selecciona un día en la programación de `moderno2`
- **THEN** se muestran las tarjetas de los programas de ese día y se ocultan las de los demás

#### Scenario: Tarjeta con datos del programa
- **WHEN** se muestra un programa en `moderno2`
- **THEN** la tarjeta incluye su imagen, su horario de inicio y fin y su descripción

#### Scenario: Día sin programación
- **WHEN** el día seleccionado no tiene programas
- **THEN** se muestra un aviso de que no hay programación para ese día

#### Scenario: Otro template conserva su variante
- **WHEN** un cliente con template distinto de `moderno2` muestra su programación
- **THEN** conserva la variante que ese template usaba

### Requirement: Bloque de contacto al final de moderno2
El template `moderno2` SHALL mostrar, al final del contenido y antes del footer,
un bloque con el formulario de contacto a la izquierda (que envía al dashboard
vía la API pública) y, a la derecha, el cover de la radio, los botones de redes
sociales y los botones para instalar la PWA.

#### Scenario: Formulario a la izquierda
- **WHEN** el cliente usa `moderno2`
- **THEN** el bloque final muestra el formulario de contacto a la izquierda

#### Scenario: Cover, redes e instalar a la derecha
- **WHEN** el cliente usa `moderno2`
- **THEN** a la derecha se muestran el cover de la radio, las redes y los botones de instalación de la PWA

#### Scenario: Otros templates
- **WHEN** un cliente usa un template distinto de `moderno2`
- **THEN** este bloque no se muestra

### Requirement: Barra de mensajes bajo la navegación en moderno2
El template `moderno2` SHALL mostrar la barra de mensajes (GC bar) integrada en
la barra de navegación principal, con el mismo ancho que esta, debajo de los
enlaces y antes del hero, cuando `gcBar` tenga mensajes.

#### Scenario: Barra de mensajes
- **WHEN** el cliente `moderno2` tiene mensajes en `gcBar`
- **THEN** la barra de mensajes se muestra dentro de la navegación, con su mismo ancho, debajo de los enlaces y antes del hero

#### Scenario: Sin mensajes
- **WHEN** `gcBar` está vacío o no existe
- **THEN** no se muestra la barra y la navegación conserva su aspecto

### Requirement: VU meter de fondo en el reproductor de moderno2
El template `moderno2` SHALL mostrar barras de VU meter como fondo del
reproductor inferior, por detrás de los controles y con opacidad baja para no
afectar la legibilidad.

#### Scenario: Fondo del reproductor
- **WHEN** un cliente usa `moderno2`
- **THEN** el reproductor inferior muestra barras de VU meter de fondo

#### Scenario: Otros templates
- **WHEN** un cliente usa un template distinto de `moderno2`
- **THEN** su reproductor no incorpora el fondo de VU meter

### Requirement: Tipografías self-hosted del template moderno2
El template `moderno2` SHALL usar las tipografías Bebas Neue (títulos de
display) y Montserrat (texto base) servidas desde el propio origen, sin depender
de Google Fonts, de modo que la experiencia offline de la PWA no se degrade.

#### Scenario: Fuentes servidas localmente
- **WHEN** el template `moderno2` carga
- **THEN** las fuentes se sirven desde el origen de la aplicación y no desde un CDN externo

#### Scenario: Sin conexión
- **WHEN** el usuario abre la aplicación sin conexión y las fuentes están en caché
- **THEN** el template conserva sus tipografías

### Requirement: Hero y titulares del template moderno2
El template `moderno2` SHALL mostrar un hero con el tema actual y la navegación
por secciones, y SHALL mostrar los titulares de sección con una palabra gigante
de fondo derivada del título y un texto resaltado, de forma adaptativa. La
navegación por secciones SHALL permanecer visible (pegada al borde superior)
mientras el usuario avanza por el sitio.

#### Scenario: Hero
- **WHEN** el cliente usa `moderno2`
- **THEN** el hero muestra la portada, el título y el artista del tema actual, y el control de reproducción

#### Scenario: Navegación pegada al scroll
- **WHEN** el usuario se desplaza hacia abajo por el sitio en `moderno2`
- **THEN** la barra de navegación permanece visible en la parte superior

#### Scenario: Titular de sección
- **WHEN** se renderiza una sección del template `moderno2`
- **THEN** el titular muestra el texto de la sección y una palabra gigante de fondo
