import type { ReactNode } from 'react'
import { Skeleton } from './Skeleton'
import styles from './Section.module.css'

interface SectionProps {
  title?: string
  visible: boolean
  loading?: boolean
  /** Quita el margen vertical de la sección (para composición dentro de grids). */
  flush?: boolean
  children: ReactNode
}

export function Section({ title, visible, loading, flush = false, children }: SectionProps) {
  const sectionClass = flush ? `${styles.section} ${styles.sectionFlush}` : styles.section

  if (loading) {
    return (
      <section className={sectionClass}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <Skeleton />
      </section>
    )
  }

  if (!visible) return null

  return (
    <section className={sectionClass}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </section>
  )
}
