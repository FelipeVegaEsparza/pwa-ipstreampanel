# pwa-install Specification

## Purpose
Permite instalar la aplicación PWA desde un botón (aprovechando `beforeinstallprompt`) y fija el título del documento con el nombre del cliente.

## Requirements

### Requirement: Botón de instalación
El sistema SHALL ofrecer un botón "Instalar" cuando el navegador dispare `beforeinstallprompt`, y ocultarlo cuando la app ya esté instalada o el evento no esté disponible.

#### Scenario: Instalación disponible
- **WHEN** el navegador dispara `beforeinstallprompt` y la app no está instalada
- **THEN** se muestra el botón "Instalar" que al hacer clic muestra el prompt de instalación

#### Scenario: App ya instalada
- **WHEN** la app ya está instalada (`appinstalled` o sin evento disponible)
- **THEN** el botón de instalación no se muestra

### Requirement: Título del documento por cliente
El sistema SHALL fijar `document.title` con el nombre del cliente (de `basicData.projectName` o el config del cliente).

#### Scenario: Nombre del cliente disponible
- **WHEN** el cliente tiene `projectName`
- **THEN** el título de la pestaña muestra ese nombre
