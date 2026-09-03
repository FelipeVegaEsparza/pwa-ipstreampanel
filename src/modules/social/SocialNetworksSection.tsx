import { Section } from '@/ui'
import type { SectionDataProps } from '@/modules/content/format'
import { BrandIcon, getSocialLinks } from './brand'
import styles from './SocialNetworksSection.module.css'

export function SocialNetworksSection({ clientData, isLoading }: SectionDataProps) {
  const links = getSocialLinks(clientData?.socialNetworks)

  return (
    <Section title="Síguenos" visible={links.length > 0} loading={isLoading}>
      <div className={styles.links}>
        {links.map((link) => (
          <a
            key={link.key}
            className={styles.link}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            aria-label={link.label}
            title={link.label}
          >
            <BrandIcon name={link.key} size={20} />
          </a>
        ))}
      </div>
    </Section>
  )
}
