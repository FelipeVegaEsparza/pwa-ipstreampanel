import { Section } from '@/ui'
import { InstallPrompt } from '@/modules/pwa/InstallPrompt'
import { ContactForm } from '@/modules/contact/ContactSection'
import { SocialLinks } from '@/modules/social/SocialNetworksSection'
import { getSocialLinks } from '@/modules/social/brand'
import type { SectionDataProps } from './format'
import styles from './ContactSocialSection.module.css'

export function ContactSocialSection({ clientData }: SectionDataProps) {
  const links = getSocialLinks(clientData?.socialNetworks)

  return (
    <div className={styles.grid}>
      <Section title="Contáctanos" visible flush>
        <ContactForm />
      </Section>
      <Section title="Síguenos" visible flush>
        <div className={styles.aside}>
          <SocialLinks links={links} />
          <InstallPrompt />
        </div>
      </Section>
    </div>
  )
}
