import { useState } from 'react'
import styles from './ShareButton.module.css'

interface ShareButtonProps {
  title?: string
  url?: string
  className?: string
}

export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareUrl = url ?? window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title: title ?? document.title, url: shareUrl })
        return
      } catch {
        // usuario canceló o falló; continuar al fallback no es necesario
        return
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // sin clipboard
    }
  }

  return (
    <button
      type="button"
      className={`${styles.share} ${className ?? ''}`}
      onClick={() => void handleShare()}
      aria-label="Compartir"
    >
      {copied ? '✓ Enlace copiado' : 'Compartir'}
    </button>
  )
}
