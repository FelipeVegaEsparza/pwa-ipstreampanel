import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { firstPublicImageUrl } from '@/core/api'
import { useTenant } from '@/core/config/TenantContext'
import { useStreaming } from '@/core/hooks/useStreaming'
import type { TemplateProps } from '../index'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { NextTrack } from '@/modules/player/NextTrack'
import { useMediaSession } from '@/modules/player/useMediaSession'
import { usePlayer } from '@/modules/player/PlayerContext'
import { useTrackProgress } from '@/modules/player/useTrackProgress'
import { VuMeter } from '@/modules/player/VuMeter'
import { ShareButton } from '@/modules/share/ShareButton'
import { BrandIcon, getSocialLinks } from '@/modules/social/brand'
import { SmartImage } from '@/ui'
import styles from './CoveredTemplate.module.css'

export function CoveredTemplate({ clientData, isLoading }: TemplateProps) {
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
  const socialLinks = getSocialLinks(clientData?.socialNetworks)

  const [bg, setBg] = useState<{ current: string | null; previous: string | null }>({
    current: null,
    previous: null
  })
  useEffect(() => {
    if (!cover) return
    setBg((prev) =>
      prev.current === cover ? prev : { current: cover, previous: prev.current }
    )
  }, [cover])

  useMediaSession({
    title: currentTrack?.title,
    artist: currentTrack?.artist,
    artwork: cover
  })

  const { progress } = useTrackProgress(
    currentTrack?.duration,
    trackKey,
    isPlaying,
    currentTrack?.elapsed
  )

  const dateText = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBg} aria-hidden="true">
          {bg.previous && (
            <img
              className={`${styles.bgImg} ${styles.bgOut}`}
              src={bg.previous}
              alt=""
            />
          )}
          {bg.current && <img className={styles.bgImg} src={bg.current} alt="" />}
          <VuMeter className={styles.vuLayer} />
          <div className={styles.bgOverlay} />
        </div>

        <div className={styles.container}>
          <header className={styles.header}>
            <SmartImage className={styles.logo} src={basic?.logoUrl} alt={name} />
            <div className={styles.headerRight}>
              <span className={styles.date}>{dateText}</span>
              <span className={styles.live}>
                <span className={styles.liveDot} />
                EN VIVO
              </span>
              {socialLinks.length > 0 && (
                <div className={styles.social}>
                  {socialLinks.map((link) => (
                    <a
                      key={link.key}
                      className={styles.socialLink}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={link.label}
                      title={link.label}
                    >
                      <BrandIcon name={link.key} size={16} />
                    </a>
                  ))}
                </div>
              )}
              <InstallPrompt />
            </div>
          </header>

          <div className={styles.heroInner}>
            <div className={styles.coverCard}>
              <SmartImage
                className={styles.cover}
                src={trackCover}
                fallbacks={[basic?.coverUrl, basic?.logoUrl]}
                alt=""
              />
              <div className={styles.coverBar}>
                <div
                  className={styles.coverBarFill}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>

            <div className={styles.heroInfo}>
              <span className={styles.onAir}>
                {status === 'off'
                  ? 'FUERA DEL AIRE'
                  : isLive
                    ? 'ON AIR'
                    : 'EN EL AIRE'}
              </span>
              <span className={styles.nowLabel}>Reproduciendo ahora</span>
              <h1 className={styles.title}>
                {isLoading ? 'Cargando…' : currentTrack?.title ?? name}
              </h1>
              <p className={styles.artist}>
                {currentTrack?.artist ?? 'En Vivo'}
              </p>
              {currentTrack?.album && (
                <p className={styles.album}>{currentTrack.album}</p>
              )}

              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.play}
                  onClick={toggle}
                  disabled={!streamUrl}
                >
                  {isPlaying ? '❚❚ Detener' : '▶ Reproducir ahora'}
                </button>
                <ShareButton title={name} />
              </div>

              <div className={styles.meta}>
                <span>
                  <b>{streaming?.listeners ?? 0}</b> oyentes
                </span>
                {streaming?.bitrate ? (
                  <span>
                    <b>{streaming.bitrate}</b> kbps
                  </span>
                ) : null}
              </div>

              <NextTrack
                next={streaming?.nextTrack}
                fallbackCover={basic?.coverUrl}
              />
            </div>
          </div>
        </div>
      </section>

      <main className={styles.content}>
        <div className={styles.container}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          {name} · IPStream Panel
        </div>
      </footer>
    </div>
  )
}
