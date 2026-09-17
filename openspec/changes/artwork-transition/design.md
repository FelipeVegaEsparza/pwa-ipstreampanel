## Context

Ver `proposal.md` - Why. Estado actual relevante:

- `TenantApp` espera los datos del cliente (`useFullClientData`) antes de montar el template, pero el estado de streaming lo consulta el template (`useLiveRadio` → `useStreaming`, queryKey `['streaming', clientId]`). Por eso el hero arranca con fallback y luego salta a la carátula.
- `SmartImage` cambia el `src` del `<img>` sin transición.
- El logo del splash mide 120px.

## Goals / Non-Goals

**Goals:**

- Que la carátula del tema esté disponible al montar el template (en el caso común).
- Que cualquier cambio de imagen del artwork sea un fundido cruzado, no un corte.
- Respetar `prefers-reduced-motion`.

**Non-Goals:**

- Precargar todas las imágenes de las secciones.
- Cambiar la cadencia de polling de streaming.
- Splash del sistema operativo.

## Decisions

### D1. Prefetch de streaming con `prefetchQuery`

En `TenantApp`, un `useEffect` llama a `queryClient.prefetchQuery({ queryKey: ['streaming', clientId], queryFn: () => getStreaming(clientId) })` mientras se ve el splash. Usa la misma queryKey que `useStreaming`, así que React Query deduplica y el template encuentra los datos en caché. Alternativa: añadir un `useStreaming` en `TenantApp` - crearía un segundo observador con su propio `refetchInterval` (doble polling); `prefetchQuery` no crea observador.

### D2. Crossfade opt-in en `SmartImage`

Se agrega un prop `crossfade`. Cuando está activo, se renderizan dos capas: la imagen actual y la nueva encima con `opacity: 0 → 1` al cargar; al terminar la transición se promueve la nueva. El modo es opt-in (por defecto off) porque el wrapper adicional podría alterar layouts existentes (logos, cards); se aplica solo al artwork del hero. Alternativa descartada: crossfade global por defecto - riesgo de regresiones de layout y de tests.

### D3. Ante error, sin crossfade

Si la nueva imagen falla, se avanza al fallback y se reemplaza de inmediato (sin fundido), para no dejar huecos. El fundido solo aplica a cambios de fuente exitosos.

### D4. Movimiento reducido

`@media (prefers-reduced-motion: reduce)` desactiva la transición de opacidad del crossfade.

### D5. Logo del splash

Se sube de 120px a 160px en `index.html` y `LoadingScreen`.

## Risks / Trade-offs

- [El wrapper del crossfade podría alterar el layout del hero] → Se aplica solo al artwork (bloque con tamaño definido) y se valida visualmente.
- [El timer de promoción del crossfade puede solaparse con un cambio rápido] → Se promueve la imagen más reciente y se cancela el timer anterior.
- [Prefetch en dev sin red] → El error se ignora; el template sigue con su propio fetch.
