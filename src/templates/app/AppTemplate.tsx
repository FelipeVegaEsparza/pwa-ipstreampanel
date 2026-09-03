import { TemplateShell } from '../shared/TemplateShell'
import type { TemplateProps } from '../index'
import styles from './AppTemplate.module.css'

export function AppTemplate(props: TemplateProps) {
  return <TemplateShell {...props} templateLabel="App" className={styles.page} />
}
