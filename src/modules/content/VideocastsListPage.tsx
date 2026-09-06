import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { asArray, normalizePagination } from '@/core/adapters'
import { buildImageUrl, getVideocasts } from '@/core/api'
import { useTenant } from '@/core/config/TenantContext'
import { usePaginatedList } from '@/core/hooks/usePaginatedList'
import { usePageParam } from '@/core/hooks/usePageParam'
import { ErrorScreen } from '@/app/ErrorScreen'
import type { Videocast } from '@/core/types'
import { Card, EmptyState, Grid, Pagination, Skeleton, SmartImage } from '@/ui'
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

export function VideocastsListPage() {
  const tenant = useTenant()
  const clientId = tenant.status === 'ready' ? tenant.clientId : null
  const [page, setPage] = usePageParam()
  const [active, setActive] = useState<Videocast | null>(null)

  const { data, isLoading, isError, refetch } = usePaginatedList(
    clientId,
    'videocastsList',
    (p, limit) => getVideocasts(clientId!, p, limit),
    page
  )

  const items = asArray(data?.data)
  const pagination = normalizePagination(data?.pagination)

  // Si el dataset encogió y la página quedó fuera de rango, volver a la última válida.
  useEffect(() => {
    if (data && pagination.pages > 0 && page > pagination.pages) {
      setPage(pagination.pages)
    }
  }, [page, data, pagination.pages, setPage])

  if (isLoading && items.length === 0) {
    return <Skeleton rows={6} />
  }

  if (isError && items.length === 0) {
    return (
      <ErrorScreen
        title="No se pudieron cargar los videocasts"
        message="Hubo un problema de conexión. Revisa tu conexión e inténtalo de nuevo."
        onRetry={() => void refetch()}
      />
    )
  }

  const overlayItem = active && hasPlayableVideo(active) ? active : null
  const overlayUrl = overlayItem ? buildImageUrl(overlayItem.videoUrl) : null
  const overlayEmbed = overlayUrl ? videoEmbedUrl(overlayUrl) : null

  return (
    <div>
      <h1 className={styles.sectionTitle}>Videocasts</h1>
      {items.length === 0 ? (
        <EmptyState message="No hay videocasts disponibles." />
      ) : (
        <>
          <Grid>
            {items.map((videocast) => {
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
    </div>
  )
}
