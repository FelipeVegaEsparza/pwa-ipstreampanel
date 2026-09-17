import { useEffect, useRef, useState } from 'react'
import styles from './InstallPrompt.module.css'
import { InstallHelpModal, type InstallPlatform } from './InstallHelpModal'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type InstallPromptSubscriber = (event: BeforeInstallPromptEvent) => void

const subscribers = new Set<InstallPromptSubscriber>()
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null

// `beforeinstallprompt` se dispara una sola vez por carga y puede ocurrir antes
// de que el componente monte: se captura a nivel de módulo desde la importación.
function handleBeforeInstallPrompt(event: Event): void {
  event.preventDefault()
  const promptEvent = event as BeforeInstallPromptEvent
  deferredInstallPrompt = promptEvent
  subscribers.forEach((subscriber) => subscriber(promptEvent))
}

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
}

function isStandalone(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(display-mode: standalone)').matches
}

/** Solo para tests: limpia el estado a nivel de módulo. */
export function resetInstallPromptForTests(): void {
  deferredInstallPrompt = null
}

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    deferredInstallPrompt
  )
  const [installed, setInstalled] = useState(isStandalone)
  const [helpFor, setHelpFor] = useState<InstallPlatform | null>(null)
  const prompting = useRef(false)

  useEffect(() => {
    function onBeforeInstall(event: BeforeInstallPromptEvent) {
      setDeferred(event)
    }
    function onInstalled() {
      deferredInstallPrompt = null
      setDeferred(null)
      setInstalled(true)
    }
    subscribers.add(onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      subscribers.delete(onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function handleAndroidClick(): Promise<void> {
    if (prompting.current) return
    if (!deferred) {
      // Sin prompt nativo disponible (p. ej. otro navegador): instrucciones.
      setHelpFor('android')
      return
    }
    prompting.current = true
    try {
      await deferred.prompt()
      const choice = await deferred.userChoice
      deferredInstallPrompt = null
      setDeferred(null)
      if (choice?.outcome === 'accepted') setInstalled(true)
    } catch {
      deferredInstallPrompt = null
      setDeferred(null)
      setHelpFor('android')
    } finally {
      prompting.current = false
    }
  }

  if (installed) return null

  return (
    <>
      <div className={styles.row}>
        <button
          type="button"
          className={styles.button}
          aria-label="Instalar en Android"
          onClick={() => {
            void handleAndroidClick()
          }}
        >
          <img className={styles.image} src="/app-android.png" alt="" />
        </button>
        <button
          type="button"
          className={styles.button}
          aria-label="Instalar en iPhone o iPad"
          onClick={() => setHelpFor('apple')}
        >
          <img className={styles.image} src="/app-apple.png" alt="" />
        </button>
      </div>
      {helpFor && (
        <InstallHelpModal platform={helpFor} onClose={() => setHelpFor(null)} />
      )}
    </>
  )
}
