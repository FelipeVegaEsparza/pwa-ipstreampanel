import { useEffect, useState } from 'react'
import {
  FaFacebookF,
  FaLink,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter
} from 'react-icons/fa6'
import styles from './ShareModal.module.css'

interface ShareOption {
  key: string
  label: string
  icon: React.ComponentType<{ size?: number }>
  href?: string
}

function buildShareOptions(title: string, url: string): ShareOption[] {
  const text = encodeURIComponent(`${title}: ${url}`)
  return [
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      icon: FaWhatsapp,
      href: `https://wa.me/?text=${text}`
    },
    {
      key: 'facebook',
      label: 'Facebook',
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      key: 'x',
      label: 'X (Twitter)',
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
    {
      key: 'telegram',
      label: 'Telegram',
      icon: FaTelegram,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    }
  ]
}

interface ShareModalProps {
  open: boolean
  onClose: () => void
  title: string
  url: string
}

export function ShareModal({ open, onClose, title, url }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const options = buildShareOptions(title, url)

  useEffect(() => {
    if (!open) return
    setCopied(false)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={styles.card} onClick={(event) => event.stopPropagation()}>
        <header className={styles.header}>
          <h3 className={styles.title}>Compartir</h3>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Cerrar"
          >
            ×
          </button>
        </header>
        <p className={styles.subtitle}>Comparte esta radio con tus amigos</p>

        <div className={styles.options}>
          {options.map((option) => (
            <a
              key={option.key}
              className={styles.option}
              href={option.href}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.optionIcon}>
                <option.icon size={18} />
              </span>
              <span className={styles.optionLabel}>{option.label}</span>
            </a>
          ))}

          <button type="button" className={styles.option} onClick={() => void copyLink()}>
            <span className={styles.optionIcon}>
              <FaLink size={18} />
            </span>
            <span className={styles.optionLabel}>
              {copied ? '✓ Enlace copiado' : 'Copiar enlace'}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
