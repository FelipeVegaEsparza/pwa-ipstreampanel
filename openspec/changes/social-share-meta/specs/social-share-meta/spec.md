## Purpose

Genera e inyecta en el HTML de cada build de cliente los metadatos Open Graph y Twitter necesarios para que al compartir el enlace de una radio en redes sociales y WhatsApp se muestre su nombre, logo/portada y descripción, sin depender de JavaScript en el cliente.

## ADDED Requirements

### Requirement: Metadatos Open Graph por cliente
El build de cada cliente SHALL incluir en el `index.html` generado los metadatos Open Graph con el nombre, la descripción y una imagen del cliente, obtenidos de la API pública (`basic-data`). El sistema SHALL inyectar al menos: `og:type`, `og:title`, `og:description`, `og:image` y `og:site_name`, además de los equivalentes `twitter:card`, `twitter:title`, `twitter:description` y `twitter:image`.

#### Scenario: Cliente con datos en la API
- **WHEN** se construye un cliente y `basic-data` responde con `projectName`, `projectDescription` y `logoUrl`/`coverUrl`
- **THEN** el `index.html` del build contiene los tags `og:title`, `og:description` y `og:image` con esos valores y el `<title>` con `projectName`

#### Scenario: Preview en WhatsApp
- **WHEN** un crawler lee el HTML servido de una radio sin ejecutar JavaScript
- **THEN** encuentra `og:title`, `og:description` y `og:image` en el HTML crudo y puede construir el preview

### Requirement: Imagen absoluta y elección de portada
La imagen usada en `og:image`/`twitter:image` SHALL ser una URL absoluta HTTPS. El sistema SHALL preferir la portada (`coverUrl`) y usar el logo (`logoUrl`) como alternativa; si la API no entrega ninguna, SHALL usar una imagen del propio sitio cuando se conozca su URL base y SHALL omitir el tag si no hay ninguna disponible.

#### Scenario: Portada disponible
- **WHEN** `basic-data` entrega `coverUrl`
- **THEN** `og:image` apunta a esa portada como URL absoluta

#### Scenario: Sin imagen de la API
- **WHEN** `basic-data` no entrega `coverUrl` ni `logoUrl`
- **THEN** el build no incluye `og:image` (o usa una del sitio si conoce su base) sin fallar

### Requirement: Degradación ante fallo del API
Si la consulta a la API pública falla durante el build (red, timeout, error del servidor), el build SHALL continuar usando el nombre configurado del cliente y SHALL omitir los campos que no pueda resolver, sin romper la construcción.

#### Scenario: API no disponible en build
- **WHEN** la consulta a `basic-data` falla durante el build
- **THEN** el build termina correctamente con `og:title` igual al nombre del cliente y sin campos inventados

### Requirement: Escape de contenido
Los valores inyectados en los metadatos SHALL escaparse para HTML, de modo que comillas, `&`, `<` o `>` provenientes de la API no rompan el HTML ni permitan inyección de etiquetas.

#### Scenario: Descripción con caracteres especiales
- **WHEN** `projectDescription` contiene comillas o `&`
- **THEN** el atributo `content` resultante mantiene el texto íntegro y no rompe el HTML

### Requirement: URL del sitio y `siteUrl`
El sistema SHALL usar como `og:url` una URL base del cliente: el campo opcional `siteUrl` de `clients/<nombre>/client.json` o, si no está, el `websiteUrl` de la API. Si no se conoce ninguna, SHALL omitir `og:url`.

#### Scenario: `siteUrl` configurado
- **WHEN** `client.json` define `siteUrl`
- **THEN** `og:url` usa ese valor

#### Scenario: Sin URL conocida
- **WHEN** no hay `siteUrl` ni `websiteUrl`
- **THEN** el build omite `og:url` sin fallar
