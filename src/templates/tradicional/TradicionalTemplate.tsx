import { Outlet } from 'react-router-dom'
import { useLiveRadio } from '@/modules/player/useLiveRadio'
import { NextTrack } from '@/modules/player/NextTrack'
import { PlayerBar } from '@/modules/player/PlayerBar'
import { TrackProgress } from '@/modules/player/TrackProgress'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { BrandIcon, getSocialLinks } from '@/modules/social/brand'
import { Weather } from '@/modules/weather/Weather'
import { DigitalClock, SmartImage } from '@/ui'
import type { TemplateProps } from '../index'
import styles from './TradicionalTemplate.module.css'

export function TradicionalTemplate({ clientData, isLoading }: TemplateProps) {
  const live = useLiveRadio(clientData)
  const socialLinks = getSocialLinks(clientData?.socialNetworks)
  const displayName = isLoading ? 'Cargando…' : live.name
  const air =
    live.status === 'off' ? 'Fuera del aire' : live.isLive ? '● Transmisión en vivo' : '● Al aire'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brandBlock}>
          <SmartImage className={styles.logo} src={live.basic?.logoUrl} alt="" />
          <div className={styles.brandText}>
            <span className={styles.brandName}>{displayName}</span>
            <span className={styles.tagline}>
              <span className={styles.badge}>Tradicional</span> Radio & Cultura · IPStream
            </span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <DigitalClock />
          <Weather location={live.basic?.location} />
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
          <InstallPrompt />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.console}>
          <div className={styles.consoleTop}>
            <span className={styles.consoleLabel}>{air}</span>
            <span className={styles.consoleMeta}>
              {live.listeners} oyentes
              {live.bitrate ? ` · ${live.bitrate} kbps` : ''}
            </span>
          </div>
          <div className={styles.consoleBody}>
            <SmartImage
              className={styles.artwork}
              src={live.trackCover}
              fallbacks={live.fallbacks}
              alt=""
            />
            <div className={styles.now}>
              <span className={styles.nowCaption}>Ahora suena</span>
              <h1 className={styles.song}>
                {live.currentTrack?.title ?? 'Nuestra programación habitual'}
              </h1>
              <p className={styles.singer}>
                {live.currentTrack?.artist ?? live.name}
              </p>
              <div className={styles.progressWrap}>
                <TrackProgress
                  duration={live.currentTrack?.duration}
                  trackKey={live.trackKey}
                  isPlaying={live.isPlaying}
                  serverElapsed={live.currentTrack?.elapsed}
                />
              </div>
            </div>
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.play}
                onClick={live.toggle}
                disabled={!live.streamUrl}
                aria-label={live.isPlaying ? 'Detener la radio' : 'Encender la radio'}
              >
                {live.isPlaying ? '❚❚' : '▶'}
              </button>
              <span className={styles.playLabel}>
                {live.isPlaying ? 'Detener' : 'Escuchar'}
              </span>
            </div>
          </div>
          <div className={styles.consoleBottom}>
            <span className={styles.freqLine}>AM · FM · WEB</span>
            <span className={styles.stationLine}>desde {live.basic?.location?.city || 'tu ciudad'}</span>
          </div>
        </section>

        {live.nextTrack && (
          <div className={styles.nextBlock}>
            <span className={styles.nextCaption}>Sigue después</span>
            <NextTrack next={live.nextTrack} fallbackCover={live.basic?.coverUrl} />
          </div>
        )}

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <span>{displayName}</span>
        <span className={styles.footerDot}>·</span>
        <span>IPStream Panel</span>
      </footer>
      <PlayerBar />
    </div>
  )
}
