import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLiveRadio } from '@/modules/player/useLiveRadio'
import { NextTrack } from '@/modules/player/NextTrack'
import { TrackProgress } from '@/modules/player/TrackProgress'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { BrandIcon, getSocialLinks } from '@/modules/social/brand'
import { Weather } from '@/modules/weather/Weather'
import { SmartImage } from '@/ui'
import {
  getSectionOrder,
  SECTION_LABELS,
  sectionAnchorId,
  type SectionId
} from '@/modules/content/sections'
import type { FullClientData } from '@/core/types'
import type { TemplateProps } from '../index'
import styles from './PlaylistTemplate.module.css'

function sectionHasContent(id: SectionId, clientData: FullClientData | undefined, socialCount: number): boolean {
  switch (id) {
    case 'news':
      return (clientData?.news?.length ?? 0) > 0
    case 'programs':
      return (clientData?.programs?.length ?? 0) > 0
    case 'podcasts':
      return (clientData?.podcasts?.length ?? 0) > 0
    case 'videocasts':
      return (clientData?.videocasts?.length ?? 0) > 0
    case 'videos':
      return (clientData?.videos?.length ?? 0) > 0
    case 'tv':
      return Boolean(clientData?.basicData?.videoStreamingUrl)
    case 'promotions':
      return (clientData?.promotions?.length ?? 0) > 0
    case 'galleries':
      return (clientData?.galleries?.length ?? 0) > 0
    case 'events':
      return (clientData?.events?.length ?? 0) > 0
    case 'announcers':
      return (clientData?.announcers?.length ?? 0) > 0
    case 'sponsors':
      return (clientData?.sponsors?.length ?? 0) > 0
    case 'polls':
      return (clientData?.polls?.length ?? 0) > 0
    case 'social':
      return socialCount > 0
  }
}

export function PlaylistTemplate({ clientData, isLoading }: TemplateProps) {
  const live = useLiveRadio(clientData)
  const socialLinks = getSocialLinks(clientData?.socialNetworks)
  const displayName = isLoading ? 'Cargando…' : live.name
  const liveTag =
    live.status === 'off' ? 'SIN SEÑAL' : live.isLive ? 'EN VIVO' : 'AUTODJ'
  const showArtist = Boolean(live.currentTrack?.artist)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems = getSectionOrder('playlist').filter((id) =>
    sectionHasContent(id, clientData, socialLinks.length)
  )

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [menuOpen])

  return (
    <div className={styles.page}>
      {isHome && menuItems.length > 0 && (
        <div className={styles.mobTop}>
          <button
            type="button"
            className={styles.menuBtn}
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú de secciones"
            aria-controls="menu-secciones"
            aria-expanded={menuOpen}
          >
            ☰
          </button>
        </div>
      )}

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

      {isHome && menuItems.length > 0 && (
        <>
          <div
            className={`${styles.scrim} ${menuOpen ? styles.scrimOpen : ''}`}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <nav
            id="menu-secciones"
            className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}
            aria-label="Secciones de la radio"
          >
            <div className={styles.drawerHead}>
              <SmartImage
                className={styles.drawerLogo}
                src={live.basic?.logoUrl}
                alt={displayName}
              />
              <span className={styles.drawerTitle}>Secciones</span>
              <button
                type="button"
                className={styles.drawerClose}
                onClick={() => setMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                ×
              </button>
            </div>
            <ul className={styles.drawerList}>
              {menuItems.map((id) => (
                <li key={id}>
                  <a
                    className={styles.drawerLink}
                    href={`#${sectionAnchorId(id)}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className={styles.drawerDot} aria-hidden="true" />
                    {SECTION_LABELS[id]}
                  </a>
                </li>
              ))}
            </ul>
            <div className={styles.drawerFoot}>
              {socialLinks.length > 0 && (
                <div className={styles.drawerSocials}>
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
              <div className={styles.drawerInstall}>
                <InstallPrompt />
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  )
}
