import { domain } from '../config'
import { imagePanels } from '../data/home'
import { useScrollReveals } from '../hooks/useScrollReveals'
import { ContactSection } from '../components/home/ContactSection'
import { HomeHero } from '../components/home/HomeHero'
import { ImageSegment } from '../components/home/ImageSegment'
import { RosterSection } from '../components/home/RosterSection'
import { ServicesSection } from '../components/home/ServicesSection'
import { Footer } from '../components/layout/Footer'
import { SiteHeader } from '../components/layout/SiteHeader'
import styles from '../components/layout/Layout.module.css'

export function HomePage() {
  useScrollReveals()

  return (
    <main className={styles.siteShell}>
      <SiteHeader />
      <HomeHero />
      {imagePanels.slice(1).map((panel, index) => (
        <ImageSegment
          key={panel.title}
          panel={panel}
          number={index + 1}
          reverse={index % 2 === 0}
        />
      ))}
      <ServicesSection />
      <RosterSection />
      <ContactSection />
      <Footer left="Night Method Agency" right={domain} />
    </main>
  )
}
