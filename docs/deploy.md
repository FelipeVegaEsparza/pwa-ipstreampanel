# Despliegue por cliente (Modelo C)

Un solo repo contiene el core y la configuración de cada radio. Cada cliente se
construye y despliega de forma independiente en Dockploy; un cambio en el repo
puede llegar a todos reconstruyendo cada cliente.

## Estructura

```
clients/<nombre>/
├─ client.json          # { "clientId": "...", "name": "..." }  ← lo único que configuras por radio
└─ (opcional) overrides/   # desarrollos específicos de ese cliente
```

El `clientId` se obtiene desde el panel de IPStream en `/dashboard/api-test`.

## Elegir el template de cada radio

El template **se elige desde el panel** (campo `selectedTemplate`), no en el
código. Cada build de cliente consulta ese campo y renderiza el diseño
correspondiente. Al cambiar el template en el panel y recargar la app, el diseño
cambia **sin redesplegar**.

Templates disponibles en esta app: `minimalista`, `moderna`, `blue`, `moderno`,
`tradicional`, `app`, `petroleo`, `playlist`, `covered`. Cualquier id no
registrado usa `minimalista` por defecto (sin romper).

## Agregar una nueva radio

1. Crear la configuración y validar el build en un solo paso:

```bash
npm run new-client -- radio-nueva cmXXXXXXXXXXXX "Nombre de la Radio"
```

   - `radio-nueva` → nombre de la carpeta (kebab-case).
   - `cmXXXXXXXXXXXX` → el `clientId` del panel (`/dashboard/api-test`).
   - `"Nombre de la Radio"` → opcional; el nombre visible.
   - El script crea `clients/radio-nueva/client.json` y ejecuta el build para confirmar que queda listo.

2. Si el build no falla, verás `✓ Cliente listo. Despliégalo en Dockploy con CLIENT=radio-nueva`.

3. Probar con preview (opcional):

```bash
npx vite preview --outDir dist/radio-nueva
```

## Desplegar en Dockploy

Para cada cliente, crea un proyecto que apunte a este repositorio y usa el
`Dockerfile` con el build arg del cliente:

- **Build args**: `CLIENT=radio-nueva` (coincide con `clients/<nombre>`).
- El `Dockerfile` ejecuta `npm run build:client -- ${CLIENT}` y sirve
  `dist/${CLIENT}` con nginx (SPA fallback incluido).

> En Dockploy/Easypanel los build args se configuran en la sección "Build" del
> proyecto (variable `BUILD_ARGS`). El puerto expuesto es `80`.

## Actualizar todos los clientes a la vez

1. Cambiar el código del core en el repo.
2. Reconstruir/redesplegar cada proyecto en Dockploy (o disparar el rebuild de
   cada cliente). Como todos usan el mismo repo, el mismo commit llega a todos.

## Desarrollos específicos por cliente

El core no se toca para personalizaciones: los cambios específicos viven en
`clients/<nombre>/` (p. ej. `overrides/`). Si un cliente requiere algo que el
core no soporta, se incorpora como extensión opt-in sin afectar al resto.

## Desarrollo local

```bash
cp .env.example .env   # clientId por defecto (solo dev)
npm run dev            # abre / con ese clientId
```

Para probar otro cliente sin cambiar `.env`: `npm run dev` y abre
`/c/{clientId}`.
