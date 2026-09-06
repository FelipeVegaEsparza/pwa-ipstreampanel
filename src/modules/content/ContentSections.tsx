import { Fragment, type ReactNode } from 'react'
import { useTenant } from '@/core/config/TenantContext'
import { useFullClientData } from '@/core/hooks/useFullClientData'
import { PollsSection } from '@/modules/polls/PollsSection'
import { SocialNetworksSection } from '@/modules/social/SocialNetworksSection'
import { VideosSection } from '@/modules/videos/VideosSection'
import { TvSection } from './TvSection'
import { PromotionsSection } from './PromotionsSection'
import { NewsSection } from './NewsSection'
import { ProgramsSection } from './ProgramsSection'
import { GalleriesSection } from './GalleriesSection'
import { PodcastsSection } from './PodcastsSection'
import { VideocastsSection } from './VideocastsSection'
import { EventsSection } from './EventsSection'
import { AnnouncersSection } from './AnnouncersSection'
import { SponsorsSection } from './SponsorsSection'
import type { SectionDataProps } from './format'

type SectionId =
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

const EDITORIAL_ORDER: SectionId[] = [
  'news',
  'podcasts',
  'videocasts',
  'galleries',
  'events',
  'announcers'
]

const DEFAULT_ORDER: SectionId[] = [
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

// Estilo "portal de radio" (referencia radiosomos.cl): lo último primero,
// luego la programación, los podcasts y el resto del contenido.
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

// Estilo cultural/editorial (referencia radio13c.cl): la parrilla de
// programación es protagonista y las noticias/ideas le siguen.
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

type NewsVariant = 'grid' | 'featured' | 'rows' | 'overlay'
type ProgramVariant = 'list' | 'cards'

// Cada template presenta la información de forma distinta: aquí se define qué
// "forma" usa para noticias y programación (el resto hereda la paleta propia
// del template). covered y el resto no mapeados conservan sus valores actuales.
const NEWS_VARIANTS: Record<string, NewsVariant> = {
  covered: 'featured',
  moderno: 'overlay',
  tradicional: 'rows',
  playlist: 'rows'
}

const PROGRAM_VARIANTS: Record<string, ProgramVariant> = {
  covered: 'cards',
  blue: 'cards',
  playlist: 'cards'
}

function newsVariantFor(template: string | null | undefined): NewsVariant {
  return (template && NEWS_VARIANTS[template]) || 'grid'
}

function programVariantFor(template: string | null | undefined): ProgramVariant {
  return (template && PROGRAM_VARIANTS[template]) || 'list'
}

function orderFor(template: string | null | undefined): SectionId[] {
  if (template === 'covered') {
    const rest = DEFAULT_ORDER.filter((id) => !EDITORIAL_ORDER.includes(id))
    return [...EDITORIAL_ORDER, ...rest]
  }
  if (template === 'moderno') return MODERNO_ORDER
  if (template === 'petroleo') return PETROLEO_ORDER
  return DEFAULT_ORDER
}

function sectionFor(
  id: SectionId,
  { clientData, isLoading }: SectionDataProps,
  template: string | null | undefined
): ReactNode {
  const programVariant = programVariantFor(template)
  const newsVariant = newsVariantFor(template)

  switch (id) {
    case 'polls':
      return <PollsSection clientData={clientData} isLoading={isLoading} />
    case 'tv':
      return <TvSection clientData={clientData} isLoading={isLoading} />
    case 'promotions':
      return <PromotionsSection clientData={clientData} isLoading={isLoading} />
    case 'news':
      return (
        <NewsSection
          clientData={clientData}
          isLoading={isLoading}
          variant={newsVariant}
        />
      )
    case 'programs':
      return (
        <ProgramsSection
          clientData={clientData}
          isLoading={isLoading}
          variant={programVariant}
        />
      )
    case 'galleries':
      return <GalleriesSection clientData={clientData} isLoading={isLoading} />
    case 'podcasts':
      return <PodcastsSection clientData={clientData} isLoading={isLoading} />
    case 'videocasts':
      return <VideocastsSection clientData={clientData} isLoading={isLoading} />
    case 'videos':
      return <VideosSection clientData={clientData} isLoading={isLoading} />
    case 'events':
      return <EventsSection clientData={clientData} isLoading={isLoading} />
    case 'announcers':
      return <AnnouncersSection clientData={clientData} isLoading={isLoading} />
    case 'sponsors':
      return <SponsorsSection clientData={clientData} isLoading={isLoading} />
    case 'social':
      return <SocialNetworksSection clientData={clientData} isLoading={isLoading} />
  }
}

export function ContentSectionStack({ clientData, isLoading }: SectionDataProps) {
  const template = clientData?.selectedTemplate

  return (
    <>
      {orderFor(template).map((id) => (
        <Fragment key={id}>
          {sectionFor(id, { clientData, isLoading }, template)}
        </Fragment>
      ))}
    </>
  )
}

export function ContentSections() {
  const tenant = useTenant()
  const { data, isLoading } = useFullClientData(tenant.clientId ?? '')

  return <ContentSectionStack clientData={data} isLoading={isLoading} />
}
