import styles from './LoadingScreen.module.css'

const splashImage = import.meta.env.VITE_SPLASH_IMAGE as string | undefined
const clientName = import.meta.env.VITE_CLIENT_NAME as string | undefined

/**
 * Splash de carga. Usa la portada del cliente (inyectada en build) como fondo,
 * con un overlay legible sobre la imagen. Replica el look del splash estático
 * de `index.html` para que la transición sea imperceptible.
 */
export function LoadingScreen() {
  return (
    <div
      className={styles.screen}
      role="status"
      aria-label="Cargando"
      style={splashImage ? { backgroundImage: `url(${splashImage})` } : undefined}
    >
      <div className={styles.overlay}>
        {clientName && <p className={styles.name}>{clientName}</p>}
        <span className={styles.spinner} aria-hidden="true" />
      </div>
    </div>
  )
}
