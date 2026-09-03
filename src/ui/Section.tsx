import type { ReactNode } from 'react'
import { Skeleton } from './Skeleton'
import styles from './Section.module.css'

interface SectionProps {
  title?: string
  visible: boolean
  loading?: boolean
  children: ReactNode
}

export function Section({ title, visible, loading, children }: SectionProps) {
  if (loading) {
    return (
      <section className={styles.section}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <Skeleton />
      </section>
    )
  }

  if (!visible) return null

  return (
    <section className={styles.section}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </section>
  )
}
