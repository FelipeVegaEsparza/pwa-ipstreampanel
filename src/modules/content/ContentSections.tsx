import { type ReactNode } from 'react'
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
import {
  getSectionOrder,
  sectionAnchorId,
  type SectionId
} from './sections'
import type { SectionDataProps } from './format'

type NewsVariant = 'grid' | 'featured' | 'rows' | 'overlay'
type ProgramVariant = 'list' | 'cards'

// Cada template presenta la información de forma distinta: aquí se define qué
// "forma" usa para noticias y programación (el resto hereda la paleta propia
// del template). covered y el resto no mapeados conservan sus valores actuales.
const NEWS_VARIANTS: Record<string, NewsVariant> = {
  covered: 'featured',
  blue: 'featured',
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
      {getSectionOrder(template).map((id) => (
        <div key={id} id={sectionAnchorId(id)} style={{ scrollMarginTop: 96 }}>
          {sectionFor(id, { clientData, isLoading }, template)}
        </div>
      ))}
    </>
  )
}

export function ContentSections() {
  const tenant = useTenant()
  const { data, isLoading } = useFullClientData(tenant.clientId ?? '')

  return <ContentSectionStack clientData={data} isLoading={isLoading} />
}
