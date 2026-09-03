import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { firstPublicImageUrl } from '@/core/api'
import { useTenant } from '@/core/config/TenantContext'
import { useStreaming } from '@/core/hooks/useStreaming'
import { PlayerBar } from '@/modules/player/PlayerBar'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { usePlayer } from '@/modules/player/PlayerContext'
import { useMediaSession } from '@/modules/player/useMediaSession'
import { NextTrack } from '@/modules/player/NextTrack'
import { TrackProgress } from '@/modules/player/TrackProgress'
import type { TemplateProps } from '../index'
import styles from './ModernaTemplate.module.css'

export function ModernaTemplate({ clientData, isLoading }: TemplateProps) {
  const tenant = useTenant()
  const { setStreamUrl, isPlaying, toggle } = usePlayer()
  const { data: streaming } = useStreaming(tenant.clientId ?? '')

  const basic = clientData?.basicData
  const name = basic?.projectName ?? tenant.clientId ?? 'IPStream'
  const streamUrl = basic?.radioStreamingUrl ?? null
  const currentTrack = streaming?.currentTrack
  const trackCover = currentTrack?.coverUrl ?? null
  const trackKey =
    trackCover ?? `${currentTrack?.title ?? ''}|${currentTrack?.artist ?? ''}`

  useEffect(() => {
    if (streamUrl) setStreamUrl(streamUrl)
  }, [streamUrl, setStreamUrl])

  const cover = firstPublicImageUrl([
    trackCover,
    basic?.coverUrl,
    basic?.logoUrl
  ])
  const status = streaming?.status ?? 'off'
  const isLive = streaming?.isLive ?? false

  useMediaSession({
    title: streaming?.currentTrack?.title,
    artist: streaming?.currentTrack?.artist,
    artwork: cover
  })

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span className={styles.brand}>{isLoading ? 'Cargando…' : name}</span>
        <div className={styles.headerActions}>
          <InstallPrompt />
          <span className={styles.badge}>Moderna</span>
        </div>
      </header>

      <main className={styles.main}>
        <section
          className={styles.hero}
          style={cover ? { backgroundImage: `url(${cover})` } : undefined}
        >
          <div className={styles.heroOverlay}>
            <p className={styles.status}>
              {status === 'off' ? 'Fuera del aire' : isLive ? 'EN VIVO' : 'En el aire'}
            </p>
            <h1 className={styles.track}>
              {streaming?.currentTrack?.title ?? 'Sintoniza nuestra señal'}
            </h1>
            <p className={styles.artist}>
              {streaming?.currentTrack?.artist ?? name}
            </p>
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.play}
                onClick={toggle}
                disabled={!streamUrl}
              >
                {isPlaying ? 'Pausar' : 'Reproducir en vivo'}
              </button>
              <span className={styles.listeners}>
                {streaming?.listeners ?? 0} oyentes
              </span>
            </div>
            <div className={styles.progressArea}>
              <TrackProgress
                duration={currentTrack?.duration}
                trackKey={trackKey}
                isPlaying={isPlaying}
                serverElapsed={currentTrack?.elapsed}
              />
              <NextTrack
                next={streaming?.nextTrack}
                fallbackCover={basic?.coverUrl}
              />
            </div>
          </div>
        </section>

        <div className={styles.contentArea}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>{name} · IPStream Panel</footer>
      <PlayerBar />
    </div>
  )
}
