import styles from './ErrorScreen.module.css'

interface ErrorScreenProps {
  title?: string
  message?: string
}

export function ErrorScreen({
  title = 'Cliente no encontrado',
  message = 'No pudimos identificar la radio o canal de TV solicitado. Verifica la dirección e inténtalo de nuevo.'
}: ErrorScreenProps) {
  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <span className={styles.icon} aria-hidden="true">
          !
        </span>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  )
}
