import { useRef } from 'react'
import { Section } from '@/ui'
import type { SectionDataProps } from './format'
import { useHlsVideo } from '@/modules/tv/useHlsVideo'
import styles from './content.module.css'

export function TvSection({ clientData, isLoading }: SectionDataProps) {
  const videoUrl = clientData?.basicData?.videoStreamingUrl ?? null
  const videoRef = useRef<HTMLVideoElement>(null)

  useHlsVideo(videoRef, videoUrl)

  return (
    <Section title="TV en vivo" visible={Boolean(videoUrl)} loading={isLoading}>
      <div className={styles.tv}>
        <video ref={videoRef} className={styles.video} controls playsInline />
      </div>
    </Section>
  )
}
