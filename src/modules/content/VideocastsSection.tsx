import { useState } from 'react'
import { Link } from 'react-router-dom'
import { asArray } from '@/core/adapters'
import { buildImageUrl } from '@/core/api'
import type { Videocast } from '@/core/types'
import { Card, Grid, Section, SmartImage } from '@/ui'
import type { SectionDataProps } from './format'
import { videoEmbedUrl } from '@/modules/videos/embed'
import styles from './content.module.css'
import vidStyles from '@/modules/videos/VideosSection.module.css'

export function VideocastsSection({ clientData, isLoading }: SectionDataProps) {
  const videocasts = asArray(clientData?.videocasts)
  const [active, setActive] = useState<Videocast | null>(null)

  return (
    <>
      <Section title="Videocasts" visible={videocasts.length > 0} loading={isLoading}>
        <Grid>
          {videocasts.map((videocast) => (
            <Card key={videocast.id}>
              <button
                type="button"
                className={styles.cardButton}
                onClick={() => setActive(videocast)}
                aria-label={`Ver ${videocast.title}`}
              >
                <SmartImage className={styles.media} src={videocast.imageUrl} alt={videocast.title} />
                <div className={styles.body}>
                  <h3 className={styles.itemTitle}>{videocast.title}</h3>
                  {videocast.description && (
                    <p className={`${styles.muted} ${styles.clamp}`}>
                      {videocast.description}
                    </p>
                  )}
                </div>
              </button>
            </Card>
          ))}
        </Grid>
        <p>
          <Link to="/videocasts" className={styles.seeAll}>
            Ver todos →
          </Link>
        </p>
      </Section>

      {active && active.videoUrl && (
        <div className={vidStyles.overlay} role="dialog" aria-modal="true" onClick={() => setActive(null)}>
          <div className={vidStyles.overlayCard} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={vidStyles.close}
              onClick={() => setActive(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
            {videoEmbedUrl(active.videoUrl) ? (
              <iframe
                className={vidStyles.iframe}
                src={videoEmbedUrl(active.videoUrl)!}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                className={vidStyles.video}
                controls
                playsInline
                autoPlay
                src={buildImageUrl(active.videoUrl) ?? undefined}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}
