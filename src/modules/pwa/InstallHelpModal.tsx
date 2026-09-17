import { useEffect } from 'react'
import styles from './InstallHelpModal.module.css'

export type InstallPlatform = 'apple' | 'android'

interface HelpContent {
  title: string
  image: string
  steps: string[]
}

const CONTENT: Record<InstallPlatform, HelpContent> = {
  apple: {
    title: 'Agregar a pantalla de inicio',
    image: '/app-apple.png',
    steps: [
      'Abre esta página en Safari.',
      'Toca el botón Compartir (el cuadro con la flecha hacia arriba).',
      'Elige "Añadir a pantalla de inicio" y confirma.'
    ]
  },
  android: {
    title: 'Instalar la aplicación',
    image: '/app-android.png',
    steps: [
      'Abre el menú del navegador (⋮).',
      'Elige "Instalar aplicación" o "Añadir a pantalla de inicio".',
      'Confirma para crear el acceso directo.'
    ]
  }
}

interface InstallHelpModalProps {
  platform: InstallPlatform
  onClose: () => void
}

export function InstallHelpModal({ platform, onClose }: InstallHelpModalProps) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const content = CONTENT[platform]

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={content.title}
      onClick={onClose}
    >
      <div className={styles.card} onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Cerrar"
        >
          ×
        </button>
        <img className={styles.icon} src={content.image} alt="" />
        <h3 className={styles.title}>{content.title}</h3>
        <ol className={styles.steps}>
          {content.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  )
}
