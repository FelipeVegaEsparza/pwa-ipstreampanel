# client-branding Specification

## Purpose
Permite que cada build de cliente sirva su propio favicon e iconos de instalación de la PWA, tomando los assets de `clients/<nombre>/icons/` y heredando los compartidos de `public/` cuando un archivo no esté definido.

## Requirements

### Requirement: Iconos de marca por cliente
El sistema de build SHALL permitir definir assets de marca por cliente en `clients/<clientName>/icons/`: `favicon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` y `apple-touch-icon.png`. El build de ese cliente SHALL servir esos archivos como favicon e iconos del manifest, de modo que la pestaña y la instalación de la PWA usen la marca de la radio.

#### Scenario: Cliente con iconos propios
- **WHEN** se construye un cliente que tiene archivos en `clients/<clientName>/icons/`
- **THEN** el build resultante sirve esos archivos como favicon e iconos de instalación en lugar de los compartidos

#### Scenario: Cliente sin iconos propios
- **WHEN** se construye un cliente que no tiene carpeta `clients/<clientName>/icons/`
- **THEN** el build resultante usa los iconos compartidos de `public/` sin fallar

#### Scenario: Favicon PNG
- **WHEN** el cliente define `favicon.png`
- **THEN** el build sirve ese archivo como `/favicon.png` y `index.html` lo referencia con `type="image/png"`

### Requirement: Herencia parcial de assets
Cuando un cliente defina solo algunos archivos de marca, el build SHALL heredar de `public/` los archivos que el cliente no defina, incluyendo los assets no relacionados con marca (p. ej. `offline.html`).

#### Scenario: Cliente con favicon propio y resto heredado
- **WHEN** `clients/<clientName>/icons/` contiene solo `favicon.png`
- **THEN** el build usa ese `favicon.png` y los demás iconos y assets de `public/`

#### Scenario: Asset compartido no duplicado
- **WHEN** se construye cualquier cliente
- **THEN** los assets compartidos que el cliente no redefine (como `offline.html`) siguen presentes en el build aunque el cliente tenga su propia carpeta `icons/`

### Requirement: Nombres de archivo estables para el manifest
Los archivos de icono por cliente SHALL conservar los mismos nombres usados por el manifest de la PWA (`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`), de modo que la personalización no requiera cambiar la configuración del manifest.

#### Scenario: Manifest apunta a los iconos del cliente
- **WHEN** el navegador evalúa el manifest del build de un cliente con iconos propios
- **THEN** las URLs de los iconos del manifest resuelven a los archivos del cliente en el mismo origen
