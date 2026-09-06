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
  const onAir = live.status !== 'off'
  const city = live.basic?.location?.city || live.basic?.location?.region || null
  const claim =
    live.basic?.projectDescription || 'Música, ideas y conversación para tu día.'

  return (
    <div className={styles.page}>
      <header className={styles.topbar} id="inicio">
        <a href="#inicio" className={styles.brandGroup}>
          <SmartImage className={styles.logo} src={live.basic?.logoUrl} alt="" />
          <span className={styles.brandName}>{displayName}</span>
          <span className={styles.badge}>Petróleo</span>
        </a>

        <nav className={styles.nav} aria-label="Secciones">
          <a className={styles.navLink} href="#inicio">
            Inicio
          </a>
          <a className={styles.navLink} href="#vivo">
            En vivo
          </a>
          <a className={styles.navLink} href="#contenido">
            Programación
          </a>
        </nav>

        <div className={styles.actions}>
          <span className={`${styles.liveChip} ${onAir ? styles.liveChipOn : ''}`}>
            <span className={styles.liveDot} />
            EN VIVO
          </span>
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
        <section className={styles.hero} id="vivo">
          <div className={styles.heroInner}>
            <div className={styles.heroInfo}>
              <p className={styles.eyebrow}>
                <span className={styles.liveDot} />
                {onAir ? 'Ahora suena' : 'Fuera del aire'}
                {city ? ` · ${city}` : ''}
              </p>
              <h1 className={styles.headline}>
                {live.currentTrack?.title ?? 'Ideas y actualidad'}
              </h1>
              <p className={styles.artist}>
                {live.currentTrack?.artist ?? displayName}
              </p>

              <div className={styles.statsRow}>
                <span className={styles.stat}>{live.listeners} oyentes</span>
                <span className={styles.statSep}>·</span>
                <span className={styles.stat}>{live.bitrate ? `${live.bitrate} kbps` : 'stream'}</span>
                <span className={styles.statSep}>·</span>
                <span className={styles.stat}>
                  {live.status === 'live' ? 'Señal en vivo' : live.status === 'autodj' ? 'Automático' : 'Sin señal'}
                </span>
              </div>

              <div className={styles.controls}>
                <button
                  type="button"
                  className={styles.play}
                  onClick={live.toggle}
                  disabled={!live.streamUrl}
                  aria-label={live.isPlaying ? 'Pausar' : 'Escuchar en vivo'}
                >
                  {live.isPlaying ? '❚❚' : '▶'}
                </button>
                <span className={styles.playLabel}>
                  {live.isPlaying ? 'Pausar transmisión' : 'Escuchar en vivo'}
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

            <div className={styles.heroCover}>
              <div className={styles.coverFrame}>
                <SmartImage
                  className={styles.cover}
                  src={live.trackCover}
                  fallbacks={live.fallbacks}
                  alt=""
                />
              </div>
              {live.nextTrack && (
                <div className={styles.heroNext}>
                  <NextTrack next={live.nextTrack} fallbackCover={live.basic?.coverUrl} />
                </div>
              )}
            </div>
          </div>
        </section>

        <div className={styles.claim}>
          <span className={styles.claimMark}>◆</span>
          <span className={styles.claimText}>{claim}</span>
          <span className={styles.claimMark}>◆</span>
        </div>

        <div className={styles.content} id="contenido">
          <Outlet />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerCol}>
            <span className={styles.footerBrand}>{displayName}</span>
            <p className={styles.footerDesc}>{claim}</p>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerHeading}>Escúchanos</span>
            {city ? <span className={styles.footerLine}>{city}</span> : null}
            <span className={styles.footerLine}>También por internet, todo Chile</span>
          </div>
          <div className={styles.footerCol}>
            <span className={styles.footerHeading}>Síguenos</span>
            {socialLinks.length > 0 ? (
              <div className={styles.footerSocials}>
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
            ) : (
              <span className={styles.footerLine}>Redes sociales próximamente</span>
            )}
          </div>
        </div>
        <div className={styles.footerBottom}>
          © {displayName} · Todos los derechos reservados · IPStream Panel
        </div>
      </footer>
      <PlayerBar fallbackCovers={[live.basic?.coverUrl, live.basic?.logoUrl]} />
    </div>
  )
}
