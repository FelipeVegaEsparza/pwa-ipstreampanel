import { Link } from 'react-router-dom'
import { asArray } from '@/core/adapters'
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
  const [featured, ...rest] = news

  return (
    <Section title="Noticias" visible={news.length > 0} loading={isLoading}>
      {variant === 'featured' ? (
        <div className={newsStyles.layout}>
          {featured && (
            <article className={newsStyles.featured}>
              <Link
                to={`/noticias/${featured.slug}`}
                className={newsStyles.linkCard}
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
              </Link>
            </article>
          )}

          {rest.length > 0 && (
            <div className={newsStyles.side}>
              {rest.slice(0, 3).map((item) => (
                <Card key={item.id} className={newsStyles.sideCard}>
                  <Link
                    to={`/noticias/${item.slug}`}
                    className={newsStyles.sideLink}
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
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <Grid>
          {news.map((item) => (
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
      )}
      <p>
        <Link to="/noticias" className={styles.seeAll}>
          Ver todas →
        </Link>
      </p>
    </Section>
  )
}
