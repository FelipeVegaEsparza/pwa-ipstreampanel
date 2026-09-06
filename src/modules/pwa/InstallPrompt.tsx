import { useEffect, useRef, useState } from 'react'
import styles from './InstallPrompt.module.css'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type InstallPromptSubscriber = (event: BeforeInstallPromptEvent) => void

const subscribers = new Set<InstallPromptSubscriber>()
let deferredInstallPrompt: BeforeInstallPromptEvent | null = null
let installPromptDismissed = false

// `beforeinstallprompt` se dispara una sola vez por carga y puede ocurrir antes
// de que el componente monte: se captura a nivel de módulo desde la importación.
function handleBeforeInstallPrompt(event: Event): void {
  event.preventDefault()
  const promptEvent = event as BeforeInstallPromptEvent
  deferredInstallPrompt = promptEvent
  installPromptDismissed = false
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

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(deferredInstallPrompt)
  const [installed] = useState(isStandalone)
  const prompting = useRef(false)

  useEffect(() => {
    function onBeforeInstall(event: BeforeInstallPromptEvent) {
      setDeferred(event)
    }
    function onInstalled() {
      deferredInstallPrompt = null
      setDeferred(null)
    }
    subscribers.add(onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      subscribers.delete(onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  async function handleInstallClick(): Promise<void> {
    // Evita invocar prompt() dos veces sobre el mismo evento.
    if (prompting.current || !deferred) return
    prompting.current = true
    try {
      await deferred.prompt()
      const choice = await deferred.userChoice
      if (choice?.outcome === 'accepted') {
        deferredInstallPrompt = null
        setDeferred(null)
      } else if (choice?.outcome === 'dismissed') {
        // Se oculta por esta sesión; un nuevo evento la volvería a habilitar.
        installPromptDismissed = true
        deferredInstallPrompt = null
        setDeferred(null)
      }
    } catch {
      deferredInstallPrompt = null
      setDeferred(null)
    } finally {
      prompting.current = false
    }
  }

  if (installed || installPromptDismissed || !deferred) return null

  return (
    <button
      type="button"
      className={styles.install}
      onClick={() => {
        void handleInstallClick()
      }}
    >
      Instalar app
    </button>
  )
}
