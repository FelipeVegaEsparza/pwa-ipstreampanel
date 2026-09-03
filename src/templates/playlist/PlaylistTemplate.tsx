import { TemplateShell } from '../shared/TemplateShell'
import type { TemplateProps } from '../index'
import styles from './PlaylistTemplate.module.css'

export function PlaylistTemplate(props: TemplateProps) {
  return (
    <TemplateShell {...props} templateLabel="Playlist" className={styles.page} />
  )
}
