import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  totalPages: number
  hasMore?: boolean
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, hasMore, onPageChange }: PaginationProps) {
  const canPrev = page > 1
  const canNext = hasMore ?? page < totalPages

  return (
    <div className={styles.pagination}>
      <button
        type="button"
        className={styles.button}
        disabled={!canPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Anterior
      </button>
      <span className={styles.info}>
        Página {page} de {Math.max(totalPages, 1)}
      </span>
      <button
        type="button"
        className={styles.button}
        disabled={!canNext}
        onClick={() => onPageChange(page + 1)}
      >
        Siguiente
      </button>
    </div>
  )
}
