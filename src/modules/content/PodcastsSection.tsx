import { Link } from 'react-router-dom'
import { asArray } from '@/core/adapters'
import { Card, Grid, Section, SmartImage } from '@/ui'
import type { SectionDataProps } from './format'
import { episodeMeta } from './format'
import styles from './content.module.css'

export function PodcastsSection({ clientData, isLoading }: SectionDataProps) {
  const podcasts = asArray(clientData?.podcasts)

  return (
    <Section title="Podcasts" visible={podcasts.length > 0} loading={isLoading}>
      <Grid>
        {podcasts.map((podcast) => (
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
      <p>
        <Link to="/podcasts" className={styles.seeAll}>
          Ver todos →
        </Link>
      </p>
    </Section>
  )
}
