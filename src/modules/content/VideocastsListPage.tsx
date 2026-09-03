import { useState } from 'react'
import { asArray, normalizePagination } from '@/core/adapters'
import { buildImageUrl, getVideocasts } from '@/core/api'
import { useTenant } from '@/core/config/TenantContext'
import { usePaginatedList } from '@/core/hooks/usePaginatedList'
import type { Videocast } from '@/core/types'
import { Card, EmptyState, Grid, Pagination, Skeleton, SmartImage } from '@/ui'
import { videoEmbedUrl } from '@/modules/videos/embed'
import styles from './content.module.css'
import vidStyles from '@/modules/videos/VideosSection.module.css'

export function VideocastsListPage() {
  const tenant = useTenant()
  const clientId = tenant.status === 'ready' ? tenant.clientId : null
  const [page, setPage] = useState(1)
  const [active, setActive] = useState<Videocast | null>(null)

  const { data, isLoading } = usePaginatedList(
    clientId,
    'videocastsList',
    (p, limit) => getVideocasts(clientId!, p, limit),
    page
  )

  const items = asArray(data?.data)
  const pagination = normalizePagination(data?.pagination)

  if (isLoading && items.length === 0) {
    return <Skeleton rows={6} />
  }

  return (
    <div>
      <h1 className={styles.sectionTitle}>Videocasts</h1>
      {items.length === 0 ? (
        <EmptyState message="No hay videocasts disponibles." />
      ) : (
        <>
          <Grid>
            {items.map((videocast) => (
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
          {pagination.total > 0 && (
            <Pagination
              page={page}
              totalPages={pagination.pages}
              hasMore={pagination.hasMore}
              onPageChange={setPage}
            />
          )}
        </>
      )}

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
    </div>
  )
}
