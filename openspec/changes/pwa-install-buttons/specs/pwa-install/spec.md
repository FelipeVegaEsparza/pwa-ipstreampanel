## MODIFIED Requirements

### Requirement: Botón de instalación
El sistema SHALL mostrar dos botones de instalación con las imágenes de plataforma `app-android.png` y `app-apple.png` en lugar de un botón de texto, y SHALL ocultarlos cuando la aplicación ya esté instalada. Al pulsar el botón Android SHALL dispararse el prompt de instalación (`beforeinstallprompt`) cuando esté disponible; al pulsar el botón Apple SHALL mostrarse un modal con las indicaciones para agregar a la pantalla de inicio.

#### Scenario: Instalación disponible
- **WHEN** el navegador disparó `beforeinstallprompt` y el usuario pulsa el botón Android
- **THEN** se ejecuta el prompt nativo de instalación de la PWA

#### Scenario: Botón Apple
- **WHEN** el usuario pulsa el botón Apple
- **THEN** se muestra un modal con los pasos para agregar la app a la pantalla de inicio en iOS

#### Scenario: Android sin prompt disponible
- **WHEN** no hay prompt de instalación disponible y el usuario pulsa el botón Android
- **THEN** se muestra el modal con las indicaciones de instalación para Android, sin romper la interfaz

#### Scenario: App ya instalada
- **WHEN** la app ya está instalada (`appinstalled` o modo standalone)
- **THEN** no se muestran los botones de instalación

#### Scenario: App instalada en iOS
- **WHEN** la app se abre en iOS como PWA instalada (`navigator.standalone`)
- **THEN** no se muestran los botones de instalación

#### Scenario: Paso a modo standalone
- **WHEN** el usuario abre la app instalada y el display pasa a modo standalone
- **THEN** los botones se ocultan sin recargar la página

## ADDED Requirements

### Requirement: Modal de indicaciones de instalación
El sistema SHALL mostrar un modal accesible (`role="dialog"`, `aria-modal`) con las indicaciones de instalación según la plataforma. El modal SHALL poder cerrarse con la tecla Escape, con un botón de cierre y haciendo clic fuera del contenido.

#### Scenario: Contenido por plataforma
- **WHEN** se abre el modal para iOS
- **THEN** se muestran los pasos de Safari → Compartir → Añadir a pantalla de inicio
- **WHEN** se abre el modal para Android
- **THEN** se muestran los pasos del menú del navegador → Instalar aplicación

#### Scenario: Cierre del modal
- **WHEN** el usuario pulsa Escape, el botón de cerrar o el fondo
- **THEN** el modal se cierra
