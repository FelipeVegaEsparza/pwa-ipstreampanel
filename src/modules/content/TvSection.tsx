import { Section } from '@/ui'
import type { SectionDataProps } from './format'
import { TvPlayer } from '@/modules/tv/TvPlayer'

export function TvSection({ clientData }: SectionDataProps) {
  const rawUrl = clientData?.basicData?.videoStreamingUrl
  const videoUrl = (rawUrl ?? '').trim() || null

  return (
    <Section title="TV en vivo" visible={Boolean(videoUrl)}>
      {videoUrl && <TvPlayer src={videoUrl} />}
    </Section>
  )
}
