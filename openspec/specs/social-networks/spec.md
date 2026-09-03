# social-networks Specification

## Purpose
Muestra los enlaces de redes sociales del cliente (Facebook, YouTube, Instagram, TikTok, WhatsApp, X) cuando al menos una red esté configurada, de forma data-driven.

## Requirements

### Requirement: Mostrar redes sociales configuradas
El sistema SHALL mostrar la sección de redes sociales del cliente y SHALL renderizarla solo si al menos una red tiene una URL configurada.

#### Scenario: Sin redes configuradas
- **WHEN** `social-networks` devuelve todas las URLs como `null`
- **THEN** la sección de redes sociales no se renderiza

#### Scenario: Con redes configuradas
- **WHEN** al menos una red tiene una URL
- **THEN** la sección se muestra con los enlaces a las redes presentes

### Requirement: Enlaces funcionando
Cada red configurada SHALL renderizarse como un enlace a su URL, abriendo en una pestaña nueva.

#### Scenario: Clic en una red
- **WHEN** el usuario hace clic en una red social configurada
- **THEN** se abre la URL de esa red en una pestaña nueva
