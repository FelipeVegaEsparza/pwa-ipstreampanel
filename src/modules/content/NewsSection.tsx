import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { asArray } from '@/core/adapters'
import type { News } from '@/core/types'
import { Card, Grid, Section, SmartImage } from '@/ui'
import type { SectionDataProps } from './format'
import { formatDate } from './format'
import styles from './content.module.css'
import newsStyles from './NewsSection.module.css'

interface NewsSectionProps extends SectionDataProps {
  variant?: 'grid' | 'featured'
}

export function NewsSection({
  clientData,
  isLoading,
  variant = 'grid'
}: NewsSectionProps) {
  const news = asArray(clientData?.news)
  const [active, setActive] = useState<News | null>(null)
  const [featured, ...rest] = news

  const close = useCallback(() => setActive(null), [])

  useEffect(() => {
    if (!active) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, close])

  return (
    <>
      <Section title="Noticias" visible={news.length > 0} loading={isLoading}>
        {variant === 'featured' ? (
          <div className={newsStyles.layout}>
            {featured && (
              <article className={newsStyles.featured}>
                <button
                  type="button"
                  className={newsStyles.openCard}
                  onClick={() => setActive(featured)}
                  aria-label={`Abrir noticia ${featured.name}`}
                >
                  <SmartImage
                    className={newsStyles.featuredMedia}
                    src={featured.imageUrl}
                    alt={featured.name}
                  />
                  <div className={newsStyles.featuredBody}>
                    {featured.category && (
                      <span className={styles.category}>{featured.category.name}</span>
                    )}
                    <h3 className={newsStyles.featuredTitle}>{featured.name}</h3>
                    <p className={styles.muted}>{formatDate(featured.createdAt)}</p>
                  </div>
                </button>
              </article>
            )}

            {rest.length > 0 && (
              <div className={newsStyles.side}>
                {rest.slice(0, 3).map((item) => (
                  <Card key={item.id} className={newsStyles.sideCard}>
                    <button
                      type="button"
                      className={newsStyles.openSide}
                      onClick={() => setActive(item)}
                      aria-label={`Abrir noticia ${item.name}`}
                    >
                      <SmartImage
                        className={newsStyles.sideMedia}
                        src={item.imageUrl}
                        alt={item.name}
                      />
                      <div className={newsStyles.sideBody}>
                        {item.category && (
                          <span className={styles.category}>{item.category.name}</span>
                        )}
                        <h3 className={styles.itemTitle}>{item.name}</h3>
                        <p className={styles.muted}>{formatDate(item.createdAt)}</p>
                      </div>
                    </button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          <Grid>
            {news.map((item) => (
              <Card key={item.id}>
                <button
                  type="button"
                  className={styles.cardButton}
                  onClick={() => setActive(item)}
                  aria-label={`Abrir noticia ${item.name}`}
                >
                  <SmartImage className={styles.media} src={item.imageUrl} alt={item.name} />
                  <div className={styles.body}>
                    {item.category && (
                      <span className={styles.category}>{item.category.name}</span>
                    )}
                    <h3 className={styles.itemTitle}>{item.name}</h3>
                    <p className={styles.muted}>{formatDate(item.createdAt)}</p>
                  </div>
                </button>
              </Card>
            ))}
          </Grid>
        )}
        <p>
          <Link to="/noticias" className={styles.seeAll}>
            Ver todas →
          </Link>
        </p>
      </Section>

      {active && (
        <div className={newsStyles.overlay} role="dialog" aria-modal="true" onClick={close}>
          <div className={newsStyles.modal} onClick={(event) => event.stopPropagation()}>
            <div className={newsStyles.modalHeader}>
              <span className={styles.muted}>{formatDate(active.createdAt)}</span>
              <button
                type="button"
                className={newsStyles.close}
                onClick={close}
                aria-label="Cerrar noticia"
              >
                ×
              </button>
            </div>

            <SmartImage
              className={newsStyles.modalMedia}
              src={active.imageUrl}
              alt={active.name}
            />

            <div className={newsStyles.modalBody}>
              {active.category && (
                <span className={styles.category}>{active.category.name}</span>
              )}
              <h3 className={newsStyles.modalTitle}>{active.name}</h3>
              <p className={styles.sectionBody}>
                {active.longText || active.shortText || 'Sin contenido disponible.'}
              </p>
              <p className={newsStyles.modalFooter}>
                <Link to={`/noticias/${active.slug}`} className={styles.seeAll}>
                  Ver noticia completa →
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
