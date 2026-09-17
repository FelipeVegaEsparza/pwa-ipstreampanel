# app-shell Specification

## Purpose
Provee el shell de la aplicación PWA: enrutado SPA, layout base con reproductor persistente, manifest instalable, service worker con estrategias de caché y página offline, y el registro idempotente de instalaciones ante la API.

## Requirements

### Requirement: Enrutado SPA del shell
El sistema SHALL proporcionar enrutado en el cliente con una ruta raíz para el tenant resuelto y rutas de aplicación. El tenant activo SHALL determinarse por la configuración inyectada en el build (ver capacidad de multi-tenant); no SHALL depender de un subdominio ni de un parámetro de ruta. Las rutas de detalle SHALL resolverse con el fallback SPA del servidor.

#### Scenario: Carga de la aplicación
- **WHEN** el usuario abre el build del cliente en la raíz `/`
- **THEN** el shell carga y renderiza la página del tenant activo

#### Scenario: Ruta de error
- **WHEN** se navega a una ruta no reconocida
- **THEN** el shell renderiza la pantalla de error correspondiente sin un ciclo de carga infinito

### Requirement: Layout con reproductor persistente
El shell SHALL incluir un layout base con un área de reproductor de audio que permanezca disponible al navegar entre páginas, una cabecera con la identidad del tenant y una navegación.

#### Scenario: Navegación sin detener el reproductor
- **WHEN** el usuario navega de una página a otra
- **THEN** el reproductor continúa existiendo en el layout sin interrumpir la reproducción de audio

### Requirement: Manifest PWA instalable
El shell SHALL proveer un manifest de aplicación web con nombre, íconos, colores y modo de visualización que permitan instalar la aplicación desde el navegador.

#### Scenario: Instalación
- **WHEN** el navegador evalúa el manifest
- **THEN** la aplicación cumple los requisitos mínimos de instalabilidad (manifest, service worker, HTTPS)

### Requirement: Service worker con estrategias de caché
El shell SHALL registrar un service worker que precachee el shell de la aplicación (bundle, HTML, manifest, íconos y página offline) y aplique estrategias de caché por tipo de recurso: los datos de API dinámicos SHALL seguir estrategias network-first y los endpoints de streaming y chat SHALL NO cachearse.

#### Scenario: Carga offline del shell
- **WHEN** el dispositivo está sin conexión y el usuario abre la aplicación ya visitada
- **THEN** el shell se carga desde la caché

#### Scenario: Estado en vivo no cacheado
- **WHEN** el dispositivo está sin conexión y se solicita el estado de streaming o mensajes de chat
- **THEN** la aplicación no entrega datos obsoletos provenientes de una caché persistente

### Requirement: Página offline
El sistema SHALL mostrar una página offline informativa cuando una navegación no pueda resolverse desde la caché por falta de conexión. El service worker SHALL registrar un fallback de navegación hacia la página offline como respaldo cuando el shell tampoco esté disponible.

#### Scenario: Navegación sin conexión y sin caché
- **WHEN** una navegación falla por falta de conexión y el recurso no está en caché
- **THEN** se muestra la página offline en lugar de un error del navegador

### Requirement: Registro de instalación PWA
El sistema SHALL registrar la instalación de la aplicación mediante `POST /api/public/{clientId}/pwa/register`, usando un `deviceId` generado y persistido localmente. El registro SHALL intentarse una sola vez por dispositivo y ser idempotente (no duplicar si el `deviceId` ya existe). Cuando la persistencia local no esté disponible, el sistema SHALL reutilizar un `deviceId` estable durante la sesión en lugar de generar uno nuevo en cada intento, para no registrar instalaciones distintas del mismo dispositivo.

#### Scenario: Primer registro
- **WHEN** no existe un `deviceId` local
- **THEN** el sistema genera uno, lo persiste localmente y envía `POST /pwa/register` una vez

#### Scenario: Registro ya realizado
- **WHEN** el `deviceId` local ya existe y fue registrado
- **THEN** el sistema no vuelve a enviar el registro

#### Scenario: Persistencia no disponible
- **WHEN** el almacenamiento local no está disponible al generar el `deviceId`
- **THEN** el sistema mantiene un identificador estable durante la sesión y no genera uno nuevo en cada llamada
