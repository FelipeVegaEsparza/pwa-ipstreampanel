import { Outlet } from 'react-router-dom'
import { FaBolt } from 'react-icons/fa6'
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

  // Titulares del ticker superior: últimas noticias o, si no hay, el claim.
  const tickerItems = (clientData?.news ?? [])
    .map((item) => item.name?.trim())
    .filter((name): name is string => Boolean(name))
    .slice(0, 8)
  const tickerText = tickerItems.length > 0 ? tickerItems.join('   •   ') : claim

  const currentTitle = live.currentTrack?.title ?? 'SIN PROGRAMA'
  const currentArtist = live.currentTrack?.artist ?? displayName
  const showStatus =
    live.status === 'live' ? 'EN VIVO' : live.status === 'autodj' ? 'AUTODJ' : 'FUERA DEL AIRE'

  return (
    <div className={styles.page}>
      <div className={styles.headerWrap}>
        <div className={styles.topStrip}>
          <div className={styles.topStripInner}>
            <div className={styles.ticker}>
              <span className={styles.tickerLabel}>
                <FaBolt className={styles.tickerBolt} size={11} aria-hidden="true" /> Últimas
                noticias
              </span>
              <div className={styles.tickerTrack}>
                <span className={styles.tickerText}>{tickerText}</span>
                <span className={styles.tickerText} aria-hidden="true">
                  {tickerText}
                </span>
              </div>
            </div>

            {socialLinks.length > 0 && (
              <div className={styles.topSocials}>
                <span className={styles.topSocialsText}>Síguenos en:</span>
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
                    <BrandIcon name={link.key} size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <header className={styles.header} id="inicio">
          <div className={styles.headerInner}>
            <a href="#inicio" className={styles.brandGroup}>
              <SmartImage className={styles.logo} src={live.basic?.logoUrl} alt="" />
              <span className={styles.brandName}>{displayName}</span>
              <span className={styles.badge}>Petróleo</span>
            </a>

            <div className={styles.actions}>
              <InstallPrompt />
            </div>
          </div>
        </header>
      </div>

      <main className={styles.main}>
        <section className={styles.hero} id="vivo">
          <div className={styles.heroInner}>
            <div className={styles.heroMedia}>
              <SmartImage
                className={styles.heroCover}
                crossfade
                src={live.trackCover}
                fallbacks={live.fallbacks}
                alt=""
              />
              <span className={styles.heroTag}>{onAir ? 'EN VIVO' : 'RADIO'}</span>
              {city && <span className={styles.heroCity}>{city}</span>}
            </div>

            <div className={styles.heroInfo}>
              <p className={styles.eyebrow}>{onAir ? 'Ahora suena' : 'Fuera del aire'}</p>
              <h1 className={styles.headline}>{currentTitle}</h1>
              <p className={styles.artist}>{currentArtist}</p>

              <div className={styles.statsRow}>
                <span className={styles.stat}>{live.listeners} oyentes</span>
                <span className={styles.statSep}>•</span>
                <span className={styles.stat}>{live.bitrate ? `${live.bitrate} kbps` : 'stream'}</span>
                <span className={styles.statSep}>•</span>
                <span className={styles.stat}>{showStatus}</span>
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

              {live.nextTrack && (
                <div className={styles.heroNext}>
                  <NextTrack next={live.nextTrack} fallbackCover={live.basic?.coverUrl} />
                </div>
              )}
            </div>
          </div>
        </section>

        <div className={styles.claim}>
          <span className={styles.claimBar} />
          <span className={styles.claimText}>{claim}</span>
          <span className={styles.claimBar} />
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
