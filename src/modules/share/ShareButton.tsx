import { useState } from 'react'
import { ShareModal } from './ShareModal'
import styles from './ShareButton.module.css'

interface ShareButtonProps {
  title?: string
  url?: string
  className?: string
}

export function ShareButton({ title, url, className }: ShareButtonProps) {
  const [open, setOpen] = useState(false)
  const shareUrl = url ?? window.location.href

  return (
    <>
      <button
        type="button"
        className={`${styles.share} ${className ?? ''}`}
        onClick={() => setOpen(true)}
        aria-label="Compartir"
        aria-haspopup="dialog"
      >
        Compartir
      </button>

      <ShareModal
        open={open}
        onClose={() => setOpen(false)}
        title={title ?? document.title}
        url={shareUrl}
      />
    </>
  )
}
