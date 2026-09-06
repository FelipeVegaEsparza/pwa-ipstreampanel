/**
 * Catálogo de secciones del contenido: ids, etiquetas y orden por template.
 * Se mantiene fuera de los componentes para poder compartirlo con la UI de
 * los templates (p. ej. menús de navegación por secciones).
 */

import type { FullClientData } from '@/core/types'

export type SectionId =
  | 'polls'
  | 'tv'
  | 'promotions'
  | 'news'
  | 'programs'
  | 'galleries'
  | 'podcasts'
  | 'videocasts'
  | 'videos'
  | 'events'
  | 'announcers'
  | 'sponsors'
  | 'social'

export const SECTION_LABELS: Record<SectionId, string> = {
  polls: 'Encuestas',
  tv: 'TV en vivo',
  promotions: 'Promociones',
  news: 'Noticias',
  programs: 'Programación',
  galleries: 'Galerías',
  podcasts: 'Podcasts',
  videocasts: 'Videocasts',
  videos: 'Videos',
  events: 'Eventos',
  announcers: 'Locutores',
  sponsors: 'Auspiciadores',
  social: 'Síguenos'
}

export function sectionAnchorId(id: SectionId): string {
  return `seccion-${id}`
}

/** Indica si la sección tiene contenido visible para el cliente actual. */
export function sectionHasContent(
  id: SectionId,
  clientData: FullClientData | undefined,
  socialCount: number
): boolean {
  switch (id) {
    case 'news':
      return (clientData?.news?.length ?? 0) > 0
    case 'programs':
      return (clientData?.programs?.length ?? 0) > 0
    case 'podcasts':
      return (clientData?.podcasts?.length ?? 0) > 0
    case 'videocasts':
      return (clientData?.videocasts?.length ?? 0) > 0
    case 'videos':
      return (clientData?.videos?.length ?? 0) > 0
    case 'tv':
      return Boolean(clientData?.basicData?.videoStreamingUrl)
    case 'promotions':
      return (clientData?.promotions?.length ?? 0) > 0
    case 'galleries':
      return (clientData?.galleries?.length ?? 0) > 0
    case 'events':
      return (clientData?.events?.length ?? 0) > 0
    case 'announcers':
      return (clientData?.announcers?.length ?? 0) > 0
    case 'sponsors':
      return (clientData?.sponsors?.length ?? 0) > 0
    case 'polls':
      return (clientData?.polls?.length ?? 0) > 0
    case 'social':
      return socialCount > 0
  }
}

const EDITORIAL_ORDER: SectionId[] = [
  'news',
  'podcasts',
  'videocasts',
  'galleries',
  'events',
  'announcers'
]

export const DEFAULT_ORDER: SectionId[] = [
  'polls',
  'tv',
  'promotions',
  'news',
  'programs',
  'galleries',
  'podcasts',
  'videocasts',
  'videos',
  'events',
  'announcers',
  'sponsors',
  'social'
]

// Portal de radio (radiosomos.cl): lo último primero, luego programación.
const MODERNO_ORDER: SectionId[] = [
  'news',
  'programs',
  'podcasts',
  'videocasts',
  'videos',
  'promotions',
  'polls',
  'tv',
  'galleries',
  'events',
  'announcers',
  'sponsors',
  'social'
]

// Estilo cultural/editorial (radio13c.cl): parrilla protagonista.
const PETROLEO_ORDER: SectionId[] = [
  'programs',
  'news',
  'podcasts',
  'events',
  'videos',
  'videocasts',
  'promotions',
  'polls',
  'tv',
  'galleries',
  'announcers',
  'sponsors',
  'social'
]

// Lista de reproducción: noticias abren y encuestas cierran.
const PLAYLIST_ORDER: SectionId[] = [
  'news',
  'programs',
  'podcasts',
  'videocasts',
  'videos',
  'tv',
  'promotions',
  'galleries',
  'events',
  'announcers',
  'sponsors',
  'social',
  'polls'
]

// Azul: noticias en portada (destacada + resto) y el resto del contenido
// conserva el orden habitual.
const BLUE_ORDER: SectionId[] = [
  'news',
  'polls',
  'tv',
  'promotions',
  'programs',
  'galleries',
  'podcasts',
  'videocasts',
  'videos',
  'events',
  'announcers',
  'sponsors',
  'social'
]

export function getSectionOrder(template: string | null | undefined): SectionId[] {
  if (template === 'covered') {
    const rest = DEFAULT_ORDER.filter((id) => !EDITORIAL_ORDER.includes(id))
    return [...EDITORIAL_ORDER, ...rest]
  }
  if (template === 'blue') return BLUE_ORDER
  if (template === 'moderno') return MODERNO_ORDER
  if (template === 'petroleo') return PETROLEO_ORDER
  if (template === 'playlist') return PLAYLIST_ORDER
  return DEFAULT_ORDER
}
