import { Outlet } from 'react-router-dom'
import { useLiveRadio } from '@/modules/player/useLiveRadio'
import { NextTrack } from '@/modules/player/NextTrack'
import { PlayerBar } from '@/modules/player/PlayerBar'
import { TrackProgress } from '@/modules/player/TrackProgress'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { BrandIcon, getSocialLinks } from '@/modules/social/brand'
import { SmartImage } from '@/ui'
import type { TemplateProps } from '../index'
import styles from './PetroleoTemplate.module.css'

export function PetroleoTemplate({ clientData, isLoading }: TemplateProps) {
  const live = useLiveRadio(clientData)
  const socialLinks = getSocialLinks(clientData?.socialNetworks)
  const displayName = isLoading ? 'Cargando…' : live.name
  const boardLabel =
    live.status === 'off' ? 'OFF AIR' : live.isLive ? 'LIVE' : 'AUTO DJ'

  return (
    <div className={styles.page}>
      <div className={styles.hazardTop} aria-hidden="true" />
      <header className={styles.header}>
        <div className={styles.brandGroup}>
          <SmartImage className={styles.logo} src={live.basic?.logoUrl} alt="" />
          <span className={styles.brandName}>{displayName}</span>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.badge}>Petróleo</span>
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
        <section className={styles.board}>
          <div className={styles.plate}>
            <span className={styles.plateNo}>IP-01</span>
            <SmartImage
              className={styles.cover}
              src={live.trackCover}
              fallbacks={live.fallbacks}
              alt=""
            />
          </div>

          <div className={styles.readout}>
            <div className={styles.readoutRow}>
              <span className={`${styles.readoutVal} ${live.status === 'off' ? styles.offVal : ''}`}>
                {boardLabel}
              </span>
              <span className={styles.readoutSub}>
                {live.isPlaying ? 'TRANSMITIENDO' : 'EN ESPERA'}
              </span>
            </div>
            <p className={styles.song}>
              {live.currentTrack?.title ?? 'Señal en mantenimiento'}
            </p>
            <p className={styles.artist}>{live.currentTrack?.artist ?? live.name}</p>
            <div className={styles.stats}>
              <span className={styles.stat}>
                <b>{live.listeners}</b> oyentes
              </span>
              <span className={styles.statDivider}>|</span>
              <span className={styles.stat}>
                <b>{live.bitrate ?? '—'}</b> kbps
              </span>
              <span className={styles.statDivider}>|</span>
              <span className={styles.stat}>
                <b>{live.nextTrack ? 'Q' : '—'}</b> next
              </span>
            </div>
          </div>

          <div className={styles.controls}>
            <button
              type="button"
              className={styles.play}
              onClick={live.toggle}
              disabled={!live.streamUrl}
            >
              {live.isPlaying ? 'DETENER' : 'TRANSMITIR'}
            </button>
            <div className={styles.progressWrap}>
              <TrackProgress
                duration={live.currentTrack?.duration}
                trackKey={live.trackKey}
                isPlaying={live.isPlaying}
                serverElapsed={live.currentTrack?.elapsed}
              />
            </div>
          </div>
        </section>

        <section className={styles.nextPanel}>
          <span className={styles.panelLabel}>SIGUIENTE EN LA BANDA</span>
          {live.nextTrack ? (
            <NextTrack next={live.nextTrack} fallbackCover={live.basic?.coverUrl} />
          ) : (
            <span className={styles.emptyNext}>— sin datos —</span>
          )}
        </section>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <span className={styles.footerMark}>◆ {displayName}</span>
        <span className={styles.footerSub}>IPStream Panel · TRANSMISIÓN INDUSTRIAL</span>
      </footer>
      <div className={styles.hazardBottom} aria-hidden="true" />
      <PlayerBar />
    </div>
  )
}
