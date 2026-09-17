## Why

En la home del template `covered`, bajo el hero, las secciones de contenido se muestran en el orden compartido por todos los templates (el de `ContentSections`: encuestas, TV, promociones, noticias, programas, galerías, podcasts, videocasts, videos, eventos, locutores, auspiciadores, redes y chat). Se quiere que `covered` tenga un orden editorial propio (noticias → podcast → videocast → galería → eventos → locutores) y que antes del footer aparezca un bloque de identidad de la radio en dos columnas (cover a la izquierda, título y descripción a la derecha) con datos de `basicData`.

## What Changes

- **Orden de secciones solo en la home de `covered`**: bajo el hero se muestran primero `NewsSection`, `PodcastsSection`, `VideocastsSection`, `GalleriesSection`, `EventsSection` y `AnnouncersSection`, en ese orden; luego el resto de secciones (encuestas, TV, promociones, programas, videos, auspiciadores, redes y chat) conservando su orden relativo actual. Las demás templates mantienen el orden actual.
- **Bloque de la radio antes del footer (solo `covered`)**: sección en dos columnas (adaptativa); a la izquierda el cover de la radio y a la derecha el título de la radio (`projectName`) con su descripción (`projectDescription`), ambos desde `basicData`.
- Cada sección sigue siendo data-driven (se muestra solo si tiene datos), como hoy.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `templates`: el orden de las secciones de contenido de la home y el bloque previo al footer son comportamientos propios del template `covered`.

## Impact

- **Modificado**: `src/modules/content/ContentSections.tsx` (orden de secciones condicionado al template `covered`) y `src/templates/covered/CoveredTemplate.tsx` con su CSS (bloque de la radio antes del footer).
- **Reutiliza**: las secciones data-driven existentes (`NewsSection`, `PodcastsSection`, `VideocastsSection`, `GalleriesSection`, `EventsSection`, `AnnouncersSection` y las demás), `basicData` y `SmartImage`.
- **API**: sin cambios (usa los datos ya consumidos; sin nuevos endpoints ni campos).
- **No afecta**: los demás templates (mantienen el orden y layout actuales).
