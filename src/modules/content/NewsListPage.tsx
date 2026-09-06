import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { asArray, normalizePagination } from '@/core/adapters'
import { getNews } from '@/core/api'
import { useTenant } from '@/core/config/TenantContext'
import { usePaginatedList } from '@/core/hooks/usePaginatedList'
import { usePageParam } from '@/core/hooks/usePageParam'
import { ErrorScreen } from '@/app/ErrorScreen'
import { Card, EmptyState, Grid, Pagination, Skeleton, SmartImage } from '@/ui'
import { formatDate } from './format'
import styles from './content.module.css'

export function NewsListPage() {
  const tenant = useTenant()
  const clientId = tenant.status === 'ready' ? tenant.clientId : null
  const [page, setPage] = usePageParam()

  const { data, isLoading, isError, refetch } = usePaginatedList(
    clientId,
    'newsList',
    (p, limit) => getNews(clientId!, p, limit),
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
        title="No se pudieron cargar las noticias"
        message="Hubo un problema de conexión. Revisa tu conexión e inténtalo de nuevo."
        onRetry={() => void refetch()}
      />
    )
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
