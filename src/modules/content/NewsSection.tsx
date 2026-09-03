import { Link } from 'react-router-dom'
import { asArray } from '@/core/adapters'
import { Card, Grid, Section, SmartImage } from '@/ui'
import type { SectionDataProps } from './format'
import { formatDate } from './format'
import styles from './content.module.css'

export function NewsSection({ clientData, isLoading }: SectionDataProps) {
  const news = asArray(clientData?.news)

  return (
    <Section title="Noticias" visible={news.length > 0} loading={isLoading}>
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
      <p>
        <Link to="/noticias" className={styles.seeAll}>
          Ver todas →
        </Link>
      </p>
    </Section>
  )
}
