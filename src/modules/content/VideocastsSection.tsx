import { useState } from 'react'
import { Link } from 'react-router-dom'
import { asArray } from '@/core/adapters'
import { buildImageUrl } from '@/core/api'
import type { Videocast } from '@/core/types'
import { Card, Grid, Section, SmartImage } from '@/ui'
import type { SectionDataProps } from './format'
import { isDirectMediaFile, videoEmbedUrl } from '@/modules/videos/embed'
import styles from './content.module.css'
import vidStyles from '@/modules/videos/VideosSection.module.css'

function VideocastCardContent({ videocast }: { videocast: Videocast }) {
  return (
    <>
      <SmartImage className={styles.media} src={videocast.imageUrl} alt={videocast.title} />
      <div className={styles.body}>
        <h3 className={styles.itemTitle}>{videocast.title}</h3>
        {videocast.description && (
          <p className={`${styles.muted} ${styles.clamp}`}>{videocast.description}</p>
        )}
      </div>
    </>
  )
}

function hasPlayableVideo(videocast: Videocast): boolean {
  const url = buildImageUrl(videocast.videoUrl)
  if (!url) return false
  return Boolean(videoEmbedUrl(url) || isDirectMediaFile(url))
}

export function VideocastsSection({ clientData, isLoading }: SectionDataProps) {
  const videocasts = asArray(clientData?.videocasts)
  const [active, setActive] = useState<Videocast | null>(null)

  const overlayItem = active && hasPlayableVideo(active) ? active : null
  const overlayUrl = overlayItem ? buildImageUrl(overlayItem.videoUrl) : null
  const overlayEmbed = overlayUrl ? videoEmbedUrl(overlayUrl) : null

  return (
    <>
      <Section title="Videocasts" visible={videocasts.length > 0} loading={isLoading}>
        <Grid>
          {videocasts.map((videocast) => {
            const playable = hasPlayableVideo(videocast)
            return (
              <Card key={videocast.id}>
                {playable ? (
                  <button
                    type="button"
                    className={styles.cardButton}
                    onClick={() => setActive(videocast)}
                    aria-label={`Ver ${videocast.title}`}
                  >
                    <VideocastCardContent videocast={videocast} />
                  </button>
                ) : (
                  <Link to={`/videocasts/${videocast.id}`} className={styles.link}>
                    <VideocastCardContent videocast={videocast} />
                  </Link>
                )}
              </Card>
            )
          })}
        </Grid>
        <p>
          <Link to="/videocasts" className={styles.seeAll}>
            Ver todos →
          </Link>
        </p>
      </Section>

      {overlayItem && overlayUrl && (
        <div
          className={vidStyles.overlay}
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-3)',
              width: '100%',
              maxWidth: 860
            }}
          >
            <div className={vidStyles.overlayCard} onClick={(event) => event.stopPropagation()}>
              <button
                type="button"
                className={vidStyles.close}
                onClick={() => setActive(null)}
                aria-label="Cerrar"
              >
                ×
              </button>
              {overlayEmbed ? (
                <iframe
                  className={vidStyles.iframe}
                  src={overlayEmbed}
                  title={overlayItem.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  className={vidStyles.video}
                  controls
                  playsInline
                  autoPlay
                  src={overlayUrl}
                />
              )}
            </div>
            <Link
              to={`/videocasts/${overlayItem.id}`}
              style={{
                color: '#fff',
                fontSize: '0.9rem',
                fontWeight: 600,
                textDecoration: 'underline'
              }}
            >
              Ver ficha
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
