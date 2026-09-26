# Spec Delta

## ADDED Requirements

### Requirement: Mensajes de barra en la respuesta agregada tipada
La respuesta agregada tipada de `GET /api/public/{clientId}` SHALL exponer el campo opcional `gcBar` como un arreglo de mensajes con `id`, `text`, `order`, `createdAt` y `updatedAt`. El campo SHALL ser opcional para que los clientes cuya respuesta no lo incluya sigan siendo válidos.

#### Scenario: Cliente con barra
- **WHEN** la API entrega un cliente con el campo `gcBar` poblado
- **THEN** el consumidor tipado recibe el arreglo de mensajes de barra del tenant

#### Scenario: Cliente sin barra
- **WHEN** la API entrega un cliente sin el campo `gcBar`
- **THEN** la respuesta sigue siendo válida para el consumidor tipado y la barra se trata como sin mensajes
