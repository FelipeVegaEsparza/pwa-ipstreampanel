import { Outlet } from 'react-router-dom'
import { useLiveRadio } from '@/modules/player/useLiveRadio'
import { NextTrack } from '@/modules/player/NextTrack'
import { PlayerBar } from '@/modules/player/PlayerBar'
import { TrackProgress } from '@/modules/player/TrackProgress'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { BrandIcon, getSocialLinks } from '@/modules/social/brand'
import { Weather } from '@/modules/weather/Weather'
import { SmartImage } from '@/ui'
import type { TemplateProps } from '../index'
import styles from './BlueTemplate.module.css'

export function BlueTemplate({ clientData, isLoading }: TemplateProps) {
  const live = useLiveRadio(clientData)
  const socialLinks = getSocialLinks(clientData?.socialNetworks)
  const statusText =
    live.status === 'off' ? 'Fuera del aire' : live.isLive ? '● EN VIVO' : 'En el aire'
  const displayName = isLoading ? 'Cargando…' : live.name

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brandGroup}>
          <SmartImage className={styles.logo} src={live.basic?.logoUrl} alt="" />
          <span className={styles.brandName}>{displayName}</span>
          <span className={styles.badge}>Blue</span>
        </div>
        <div className={styles.actions}>
          <Weather location={live.basic?.location} />
          {socialLinks.length > 0 && (
            <div className={styles.socials}>
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
                  <BrandIcon name={link.key} size={15} />
                </a>
              ))}
            </div>
          )}
          <InstallPrompt />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.deck}>
            <div className={styles.coverWrap}>
              <SmartImage
                className={styles.cover}
                src={live.trackCover}
                fallbacks={live.fallbacks}
                alt=""
              />
            </div>
            <div className={styles.heroInfo}>
              <p className={styles.status}>{statusText}</p>
              <h1 className={styles.track}>
                {live.currentTrack?.title ?? 'Sintoniza nuestra señal'}
              </h1>
              <p className={styles.artist}>
                {live.currentTrack?.artist ?? live.name}
              </p>
              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.play}
                  onClick={live.toggle}
                  disabled={!live.streamUrl}
                >
                  {live.isPlaying ? 'Pausar' : 'Reproducir'}
                </button>
                <span className={styles.listeners}>
                  {live.listeners} oyentes
                  {live.bitrate ? ` · ${live.bitrate} kbps` : ''}
                </span>
              </div>
              <div className={styles.progressWrap}>
                <TrackProgress
                  duration={live.currentTrack?.duration}
                  trackKey={live.trackKey}
                  isPlaying={live.isPlaying}
                  serverElapsed={live.currentTrack?.elapsed}
                />
              </div>
            </div>
          </div>
          {live.nextTrack && (
            <div className={styles.nextRow}>
              <NextTrack next={live.nextTrack} fallbackCover={live.basic?.coverUrl} />
            </div>
          )}
        </section>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>{displayName} · IPStream Panel</footer>
      <PlayerBar />
    </div>
  )
}
