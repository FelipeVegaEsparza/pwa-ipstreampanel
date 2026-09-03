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

export function ContentSections() {
  const tenant = useTenant()
  const { data, isLoading } = useFullClientData(tenant.clientId ?? '')

  const programVariant = data?.selectedTemplate === 'covered' ? 'cards' : 'list'

  return (
    <>
      <PollsSection clientData={data} isLoading={isLoading} />
      <TvSection clientData={data} isLoading={isLoading} />
      <PromotionsSection clientData={data} isLoading={isLoading} />
      <NewsSection clientData={data} isLoading={isLoading} />
      <ProgramsSection
        clientData={data}
        isLoading={isLoading}
        variant={programVariant}
      />
      <GalleriesSection clientData={data} isLoading={isLoading} />
      <PodcastsSection clientData={data} isLoading={isLoading} />
      <VideocastsSection clientData={data} isLoading={isLoading} />
      <VideosSection clientData={data} isLoading={isLoading} />
      <EventsSection clientData={data} isLoading={isLoading} />
      <AnnouncersSection clientData={data} isLoading={isLoading} />
      <SponsorsSection clientData={data} isLoading={isLoading} />
      <SocialNetworksSection clientData={data} isLoading={isLoading} />
      <ChatSection />
    </>
  )
}
