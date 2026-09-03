import { TemplateShell } from '../shared/TemplateShell'
import type { TemplateProps } from '../index'
import styles from './PetroleoTemplate.module.css'

export function PetroleoTemplate(props: TemplateProps) {
  return (
    <TemplateShell {...props} templateLabel="Petróleo" className={styles.page} />
  )
}
