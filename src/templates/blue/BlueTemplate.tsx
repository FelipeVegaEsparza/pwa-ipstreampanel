import { type ComponentType } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useLiveRadio } from '@/modules/player/useLiveRadio'
import { PlayerBar } from '@/modules/player/PlayerBar'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { BrandIcon, getSocialLinks } from '@/modules/social/brand'
import { Weather } from '@/modules/weather/Weather'
import { SmartImage } from '@/ui'
import {
  FaBullhorn,
  FaCalendarDays,
  FaHandshake,
  FaHeart,
  FaImages,
  FaMicrophoneLines,
  FaNewspaper,
  FaPeopleGroup,
  FaPodcast,
  FaSquarePollVertical,
  FaTags,
  FaTv,
  FaVideo
} from 'react-icons/fa6'
import {
  getSectionOrder,
  SECTION_LABELS,
  sectionAnchorId,
  sectionHasContent,
  type SectionId
} from '@/modules/content/sections'
import type { TemplateProps } from '../index'
import styles from './BlueTemplate.module.css'

const SECTION_ICONS: Record<SectionId, ComponentType<{ size?: number }>> = {
  polls: FaSquarePollVertical,
  tv: FaTv,
  promotions: FaTags,
  news: FaNewspaper,
  programs: FaMicrophoneLines,
  galleries: FaImages,
  podcasts: FaPodcast,
  videocasts: FaVideo,
  videos: FaBullhorn,
  events: FaCalendarDays,
  announcers: FaPeopleGroup,
  sponsors: FaHandshake,
  social: FaHeart
}

export function BlueTemplate({ clientData, isLoading }: TemplateProps) {
  const live = useLiveRadio(clientData)
  const socialLinks = getSocialLinks(clientData?.socialNetworks)
  const displayName = isLoading ? 'Cargando…' : live.name
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  const navItems = getSectionOrder('blue').filter((id) =>
    sectionHasContent(id, clientData, socialLinks.length)
  )

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <div className={styles.brandGroup}>
          <SmartImage className={styles.logo} src={live.basic?.logoUrl} alt={displayName} />
          <span className={styles.srOnly}>{displayName}</span>
          <span className={styles.srOnly}>Blue</span>
        </div>

        {isHome && navItems.length > 0 && (
          <nav className={styles.nav} aria-label="Secciones del sitio">
            {navItems.map((id) => {
              const Icon = SECTION_ICONS[id]
              return (
                <a key={id} className={styles.navLink} href={`#${sectionAnchorId(id)}`}>
                  <Icon size={14} aria-hidden="true" />
                  <span>{SECTION_LABELS[id]}</span>
                </a>
              )
            })}
          </nav>
        )}

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
        <Outlet />
      </main>

      <footer className={styles.footer}>{displayName} · IPStream Panel</footer>
      <PlayerBar />
    </div>
  )
}
