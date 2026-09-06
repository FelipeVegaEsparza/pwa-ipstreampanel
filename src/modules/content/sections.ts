/**
 * Catálogo de secciones del contenido: ids, etiquetas y orden por template.
 * Se mantiene fuera de los componentes para poder compartirlo con la UI de
 * los templates (p. ej. menús de navegación por secciones).
 */

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

export function getSectionOrder(template: string | null | undefined): SectionId[] {
  if (template === 'covered') {
    const rest = DEFAULT_ORDER.filter((id) => !EDITORIAL_ORDER.includes(id))
    return [...EDITORIAL_ORDER, ...rest]
  }
  if (template === 'moderno') return MODERNO_ORDER
  if (template === 'petroleo') return PETROLEO_ORDER
  if (template === 'playlist') return PLAYLIST_ORDER
  return DEFAULT_ORDER
}
