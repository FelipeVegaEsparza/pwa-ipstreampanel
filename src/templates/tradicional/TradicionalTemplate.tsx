import { TemplateShell } from '../shared/TemplateShell'
import type { TemplateProps } from '../index'
import styles from './TradicionalTemplate.module.css'

export function TradicionalTemplate(props: TemplateProps) {
  return (
    <TemplateShell {...props} templateLabel="Tradicional" className={styles.page} />
  )
}
