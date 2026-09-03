import { useState } from 'react'
import { Link } from 'react-router-dom'
import { asArray, normalizePagination } from '@/core/adapters'
import { getPodcasts } from '@/core/api'
import { useTenant } from '@/core/config/TenantContext'
import { usePaginatedList } from '@/core/hooks/usePaginatedList'
import { Card, EmptyState, Grid, Pagination, Skeleton, SmartImage } from '@/ui'
import { episodeMeta } from './format'
import styles from './content.module.css'

export function PodcastsListPage() {
  const tenant = useTenant()
  const clientId = tenant.status === 'ready' ? tenant.clientId : null
  const [page, setPage] = useState(1)

  const { data, isLoading } = usePaginatedList(
    clientId,
    'podcastsList',
    (p, limit) => getPodcasts(clientId!, p, limit),
    page
  )

  const items = asArray(data?.data)
  const pagination = normalizePagination(data?.pagination)

  if (isLoading && items.length === 0) {
    return <Skeleton rows={6} />
  }

  return (
    <div>
      <h1 className={styles.sectionTitle}>Podcasts</h1>
      {items.length === 0 ? (
        <EmptyState message="No hay podcasts disponibles." />
      ) : (
        <>
          <Grid>
            {items.map((podcast) => (
              <Card key={podcast.id}>
                <Link to={`/podcasts/${podcast.id}`} className={styles.link}>
                  <SmartImage className={styles.media} src={podcast.imageUrl} alt={podcast.title} />
                  <div className={styles.body}>
                    <h3 className={styles.itemTitle}>{podcast.title}</h3>
                    {podcast.description && (
                      <p className={`${styles.muted} ${styles.clamp}`}>
                        {podcast.description}
                      </p>
                    )}
                    <p className={styles.muted}>
                      {episodeMeta(
                        podcast.season,
                        podcast.episodeNumber,
                        podcast.duration
                      )}
                    </p>
                  </div>
                </Link>
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
    </div>
  )
}
