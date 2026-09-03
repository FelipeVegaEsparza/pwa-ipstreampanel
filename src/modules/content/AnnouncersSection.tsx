import { asArray } from '@/core/adapters'
import { Card, Grid, Section, SmartImage } from '@/ui'
import type { SectionDataProps } from './format'
import styles from './content.module.css'

export function AnnouncersSection({ clientData, isLoading }: SectionDataProps) {
  const announcers = asArray(clientData?.announcers)

  return (
    <Section title="Locutores" visible={announcers.length > 0} loading={isLoading}>
      <Grid>
        {announcers.map((announcer) => (
          <Card key={announcer.id}>
            <SmartImage className={styles.media} src={announcer.imageUrl} alt={announcer.name} />
            <div className={styles.body}>
              <h3 className={styles.itemTitle}>{announcer.name}</h3>
              {announcer.description && (
                <p className={styles.muted}>{announcer.description}</p>
              )}
            </div>
          </Card>
        ))}
      </Grid>
    </Section>
  )
}
