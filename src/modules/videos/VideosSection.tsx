import { useState } from 'react'
import { asArray } from '@/core/adapters'
import type { Video } from '@/core/types'
import { Card, Grid, Section } from '@/ui'
import type { SectionDataProps } from '@/modules/content/format'
import { videoEmbedUrl } from './embed'
import styles from './VideosSection.module.css'

export function VideosSection({ clientData, isLoading }: SectionDataProps) {
  const videos = asArray(clientData?.videos).filter((video) => Boolean(video.videoUrl))
  const [active, setActive] = useState<Video | null>(null)

  return (
    <>
      <Section title="Videos" visible={videos.length > 0} loading={isLoading}>
        <Grid>
          {videos.map((video) => {
            const embed = video.videoUrl ? videoEmbedUrl(video.videoUrl) : null
            return (
              <Card key={video.id}>
                <button
                  type="button"
                  className={styles.videoCard}
                  onClick={() => setActive(video)}
                  aria-label={`Reproducir ${video.name}`}
                >
                  {embed ? (
                    <img
                      className={styles.thumb}
                      src={`https://i.ytimg.com/vi/${embed.split('/').pop()}/hqdefault.jpg`}
                      alt={video.name}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.thumbPlaceholder}>▶</div>
                  )}
                  <div className={styles.body}>
                    <h3 className={styles.title}>{video.name}</h3>
                  </div>
                </button>
              </Card>
            )
          })}
        </Grid>
      </Section>

      {active && active.videoUrl && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div className={styles.overlayCard} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.close}
              onClick={() => setActive(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            {videoEmbedUrl(active.videoUrl) ? (
              <iframe
                className={styles.iframe}
                src={videoEmbedUrl(active.videoUrl)!}
                title={active.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video className={styles.video} controls playsInline src={active.videoUrl} />
            )}
          </div>
        </div>
      )}
    </>
  )
}
