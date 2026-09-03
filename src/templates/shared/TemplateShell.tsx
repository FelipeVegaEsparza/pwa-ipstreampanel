import { Outlet } from 'react-router-dom'
import type { FullClientData } from '@/core/types'
import { useTenant } from '@/core/config/TenantContext'
import { PlayerBar } from '@/modules/player/PlayerBar'
import { RadioPlayerHero } from '@/modules/player/RadioPlayerHero'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import styles from './TemplateShell.module.css'

interface TemplateShellProps {
  clientData: FullClientData | undefined
  isLoading: boolean
  templateLabel: string
  className?: string
}

export function TemplateShell({
  clientData,
  isLoading,
  templateLabel,
  className
}: TemplateShellProps) {
  const tenant = useTenant()
  const basic = clientData?.basicData
  const name = basic?.projectName ?? tenant.clientId ?? 'IPStream'

  return (
    <div className={`${styles.shell} ${className ?? ''}`}>
      <header className={styles.header}>
        <span className={styles.brand}>{isLoading ? 'Cargando…' : name}</span>
        <div className={styles.actions}>
          <InstallPrompt />
          <span className={styles.badge}>{templateLabel}</span>
        </div>
      </header>

      <main className={styles.main}>
        <RadioPlayerHero clientData={clientData} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>{name} · IPStream Panel</footer>
      <PlayerBar />
    </div>
  )
}
