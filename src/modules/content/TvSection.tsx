import { useRef } from 'react'
import { Section } from '@/ui'
import type { SectionDataProps } from './format'
import { useHlsVideo } from '@/modules/tv/useHlsVideo'
import styles from './content.module.css'

export function TvSection({ clientData }: SectionDataProps) {
  const rawUrl = clientData?.basicData?.videoStreamingUrl
  const videoUrl = (rawUrl ?? '').trim() || null
  const videoRef = useRef<HTMLVideoElement>(null)

  const { status, reload } = useHlsVideo(videoRef, videoUrl)

  return (
    <Section title="TV en vivo" visible={Boolean(videoUrl)}>
      {videoUrl && (
        <div className={styles.tv}>
          <video ref={videoRef} className={styles.video} controls playsInline />
          {status === 'error' && (
            <div
              role="status"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 8,
                marginTop: 8
              }}
            >
              <p className={styles.muted} style={{ margin: 0 }}>
                La señal no está disponible en este momento.
              </p>
              <button type="button" onClick={reload}>
                Reintentar
              </button>
            </div>
          )}
        </div>
      )}
    </Section>
  )
}
