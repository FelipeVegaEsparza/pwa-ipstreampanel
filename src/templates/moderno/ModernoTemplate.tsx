import { TemplateShell } from '../shared/TemplateShell'
import type { TemplateProps } from '../index'
import styles from './ModernoTemplate.module.css'

export function ModernoTemplate(props: TemplateProps) {
  return <TemplateShell {...props} templateLabel="Moderno" className={styles.page} />
}
