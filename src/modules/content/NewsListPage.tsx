import { useState } from 'react'
import { Link } from 'react-router-dom'
import { asArray, normalizePagination } from '@/core/adapters'
import { getNews } from '@/core/api'
import { useTenant } from '@/core/config/TenantContext'
import { usePaginatedList } from '@/core/hooks/usePaginatedList'
import { Card, EmptyState, Grid, Pagination, Skeleton, SmartImage } from '@/ui'
import { formatDate } from './format'
import styles from './content.module.css'

export function NewsListPage() {
  const tenant = useTenant()
  const clientId = tenant.status === 'ready' ? tenant.clientId : null
  const [page, setPage] = useState(1)

  const { data, isLoading } = usePaginatedList(
    clientId,
    'newsList',
    (p, limit) => getNews(clientId!, p, limit),
    page
  )

  const items = asArray(data?.data)
  const pagination = normalizePagination(data?.pagination)

  if (isLoading && items.length === 0) {
    return <Skeleton rows={6} />
  }

  return (
    <div>
      <h1 className={styles.sectionTitle}>Noticias</h1>
      {items.length === 0 ? (
        <EmptyState message="No hay noticias disponibles." />
      ) : (
        <>
          <Grid>
            {items.map((item) => (
              <Card key={item.id}>
                <Link to={`/noticias/${item.slug}`} className={styles.link}>
                  <SmartImage className={styles.media} src={item.imageUrl} alt={item.name} />
                  <div className={styles.body}>
                    {item.category && (
                      <span className={styles.category}>{item.category.name}</span>
                    )}
                    <h3 className={styles.itemTitle}>{item.name}</h3>
                    <p className={styles.muted}>{formatDate(item.createdAt)}</p>
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
