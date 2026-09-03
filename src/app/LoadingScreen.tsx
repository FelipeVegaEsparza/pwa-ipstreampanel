import styles from './LoadingScreen.module.css'

export function LoadingScreen() {
  return (
    <div className={styles.screen}>
      <p className={styles.text}>Cargando…</p>
    </div>
  )
}
