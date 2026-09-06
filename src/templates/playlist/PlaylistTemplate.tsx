import { Outlet } from 'react-router-dom'
import { useLiveRadio } from '@/modules/player/useLiveRadio'
import { NextTrack } from '@/modules/player/NextTrack'
import { TrackProgress } from '@/modules/player/TrackProgress'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { BrandIcon, getSocialLinks } from '@/modules/social/brand'
import { Weather } from '@/modules/weather/Weather'
import { SmartImage } from '@/ui'
import type { TemplateProps } from '../index'
import styles from './PlaylistTemplate.module.css'

export function PlaylistTemplate({ clientData, isLoading }: TemplateProps) {
  const live = useLiveRadio(clientData)
  const socialLinks = getSocialLinks(clientData?.socialNetworks)
  const displayName = isLoading ? 'Cargando…' : live.name
  const liveTag =
    live.status === 'off' ? 'SIN SEÑAL' : live.isLive ? 'EN VIVO' : 'AUTODJ'
  const showArtist = Boolean(live.currentTrack?.artist)

  return (
    <div className={styles.page}>
      <div className={styles.layout}>
        <aside className={styles.deck}>
          <div className={styles.deckHead}>
            <SmartImage className={styles.logo} src={live.basic?.logoUrl} alt={displayName} />
            <span className={styles.srOnly}>{displayName}</span>
            <span className={styles.srOnly}>Playlist</span>
          </div>

          <div className={styles.coverWrap}>
            <SmartImage
              className={styles.cover}
              src={live.trackCover}
              fallbacks={live.fallbacks}
              alt=""
            />
            <div className={styles.coverGlow} aria-hidden="true" />
            {live.isPlaying && (
              <div className={styles.eq} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
            )}
          </div>

          <p className={styles.liveTag}>
            <span className={live.status === 'off' ? styles.offDot : styles.onDot} />
            {liveTag}
          </p>
          <h1 className={styles.song}>
            {live.currentTrack?.title ?? 'La lista suena sola'}
          </h1>
          {showArtist && <p className={styles.artist}>{live.currentTrack?.artist}</p>}

          <div className={styles.progressWrap}>
            <TrackProgress
              duration={live.currentTrack?.duration}
              trackKey={live.trackKey}
              isPlaying={live.isPlaying}
              serverElapsed={live.currentTrack?.elapsed}
            />
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.play}
              onClick={live.toggle}
              disabled={!live.streamUrl}
              aria-label={live.isPlaying ? 'Pausar la playlist' : 'Reproducir la playlist'}
            >
              {live.isPlaying ? '❚❚' : '▶'}
            </button>
            <div className={styles.metaCol}>
              <span className={styles.listeners}>{live.listeners} oyentes</span>
              <span className={styles.bitrate}>{live.bitrate ? `${live.bitrate} kbps` : 'stream'}</span>
            </div>
          </div>

          <div className={styles.deckNext}>
            <NextTrack next={live.nextTrack} fallbackCover={live.basic?.coverUrl} />
          </div>

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
                  <BrandIcon name={link.key} size={16} />
                </a>
              ))}
            </div>
          )}
        </aside>

        <div className={styles.column}>
          <header className={styles.topbar}>
            <span className={styles.kicker}>Tu radio en lista de reproducción</span>
            <div className={styles.topActions}>
              <Weather location={live.basic?.location} />
              <InstallPrompt />
            </div>
          </header>

          <main className={styles.feed}>
            <Outlet />
          </main>

          <footer className={styles.footer}>
            <span className={styles.srOnly}>{displayName}</span>
            <SmartImage className={styles.footerLogo} src={live.basic?.logoUrl} alt="" />
            <span>IPStream Panel</span>
          </footer>
        </div>
      </div>
    </div>
  )
}
