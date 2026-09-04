import { Fragment, type ReactNode } from 'react'
import { useTenant } from '@/core/config/TenantContext'
import { useFullClientData } from '@/core/hooks/useFullClientData'
import { PollsSection } from '@/modules/polls/PollsSection'
import { ChatSection } from '@/modules/chat/ChatSection'
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
  | 'chat'

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
  'social',
  'chat'
]

function orderFor(template: string | null | undefined): SectionId[] {
  if (template !== 'covered') return DEFAULT_ORDER
  const rest = DEFAULT_ORDER.filter((id) => !EDITORIAL_ORDER.includes(id))
  return [...EDITORIAL_ORDER, ...rest]
}

function sectionFor(
  id: SectionId,
  { clientData, isLoading }: SectionDataProps,
  programVariant: 'cards' | 'list'
): ReactNode {
  switch (id) {
    case 'polls':
      return <PollsSection clientData={clientData} isLoading={isLoading} />
    case 'tv':
      return <TvSection clientData={clientData} isLoading={isLoading} />
    case 'promotions':
      return <PromotionsSection clientData={clientData} isLoading={isLoading} />
    case 'news':
      return <NewsSection clientData={clientData} isLoading={isLoading} />
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
    case 'chat':
      return <ChatSection />
  }
}

export function ContentSectionStack({ clientData, isLoading }: SectionDataProps) {
  const template = clientData?.selectedTemplate
  const programVariant = template === 'covered' ? 'cards' : 'list'

  return (
    <>
      {orderFor(template).map((id) => (
        <Fragment key={id}>
          {sectionFor(id, { clientData, isLoading }, programVariant)}
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
