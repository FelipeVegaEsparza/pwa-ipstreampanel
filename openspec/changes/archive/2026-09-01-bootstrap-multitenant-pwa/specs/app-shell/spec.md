## Purpose

Provee el shell de la aplicación PWA: enrutado SPA, layout base con reproductor persistente, manifest instalable, service worker con estrategias de caché y página offline, y el registro idempotente de instalaciones ante la API.

## ADDED Requirements

### Requirement: Enrutado SPA del shell
El sistema SHALL proporcionar enrutado en el cliente con una ruta raíz para el tenant resuelto y rutas de aplicación. El contenido de un tenant SHALL cargarse bajo una ruta propia que permita el fallback por ruta (`/c/{clientId}`).

#### Scenario: Carga de la aplicación
- **WHEN** el usuario abre la aplicación en un subdominio registrado o en una ruta `/c/{clientId}`
- **THEN** el shell carga y renderiza la página del tenant activo

#### Scenario: Ruta de error
- **WHEN** se navega a una ruta no reconocida o a un cliente inexistente
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
El sistema SHALL mostrar una página offline informativa cuando no haya conexión y no exista una versión cacheada del contenido solicitado.

#### Scenario: Navegación sin conexión y sin caché
- **WHEN** una navegación falla por falta de conexión y el recurso no está en caché
- **THEN** se muestra la página offline

### Requirement: Registro de instalación PWA
El sistema SHALL registrar la instalación de la aplicación mediante `POST /api/public/{clientId}/pwa/register`, usando un `deviceId` generado y persistido localmente. El registro SHALL intentarse una sola vez por dispositivo y ser idempotente (no duplicar si el `deviceId` ya existe).

#### Scenario: Primer registro
- **WHEN** no existe un `deviceId` local
- **THEN** el sistema genera uno, lo persiste localmente y envía `POST /pwa/register` una vez

#### Scenario: Registro ya realizado
- **WHEN** el `deviceId` local ya existe y fue registrado
- **THEN** el sistema no vuelve a enviar el registro
