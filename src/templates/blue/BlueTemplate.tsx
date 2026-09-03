import { TemplateShell } from '../shared/TemplateShell'
import type { TemplateProps } from '../index'
import styles from './BlueTemplate.module.css'

export function BlueTemplate(props: TemplateProps) {
  return <TemplateShell {...props} templateLabel="Blue" className={styles.page} />
}
