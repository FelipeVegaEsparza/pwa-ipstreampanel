import { Outlet } from 'react-router-dom'
import { useLiveRadio } from '@/modules/player/useLiveRadio'
import { NextTrack } from '@/modules/player/NextTrack'
import { PlayerBar } from '@/modules/player/PlayerBar'
import { TrackProgress } from '@/modules/player/TrackProgress'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { Weather } from '@/modules/weather/Weather'
import { SmartImage } from '@/ui'
import type { TemplateProps } from '../index'
import styles from './ModernoTemplate.module.css'

export function ModernoTemplate({ clientData, isLoading }: TemplateProps) {
  const live = useLiveRadio(clientData)
  const displayName = isLoading ? 'Cargando…' : live.name
  const livePill =
    live.status === 'off' ? 'Fuera del aire' : live.isLive ? 'EN VIVO' : 'EN EL AIRE'

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brandLine}>
          <SmartImage className={styles.logo} src={live.basic?.logoUrl} alt="" />
          <span className={styles.brandName}>{displayName}</span>
          <span className={styles.badge}>Moderno</span>
        </div>
        <div className={styles.headerActions}>
          <Weather location={live.basic?.location} />
          <InstallPrompt />
        </div>
      </header>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>
              <span className={styles.liveDot} />
              {livePill}
              {live.bitrate ? ` · ${live.bitrate} kbps` : ''}
            </p>
            <h1 className={styles.headline}>
              {live.currentTrack?.title ?? 'La voz de tu ciudad'}
            </h1>
            <p className={styles.subhead}>
              {live.currentTrack?.artist ?? live.basic?.projectDescription ?? live.name}
            </p>
            <div className={styles.heroControls}>
              <button
                type="button"
                className={styles.play}
                onClick={live.toggle}
                disabled={!live.streamUrl}
              >
                {live.isPlaying ? 'Pausar' : 'Reproducir'}
              </button>
              <span className={styles.listeners}>{live.listeners} oyentes ahora</span>
            </div>
            <div className={styles.rule} />
            <div className={styles.nowMeta}>
              <span className={styles.nowLabel}>Ahora en el aire</span>
              <span className={styles.artistName}>
                {live.currentTrack?.artist || 'En Vivo'}
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

          <div className={styles.heroArt}>
            <div className={styles.frame}>
              <SmartImage
                className={styles.cover}
                src={live.trackCover}
                fallbacks={live.fallbacks}
                alt=""
              />
            </div>
          </div>
        </section>

        {live.nextTrack && (
          <div className={styles.nextRow}>
            <span className={styles.nextLabel}>A continuación</span>
            <NextTrack next={live.nextTrack} fallbackCover={live.basic?.coverUrl} />
          </div>
        )}

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>{displayName} · IPStream Panel</footer>
      <PlayerBar />
    </div>
  )
}
