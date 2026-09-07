import { useState, type MouseEvent } from 'react'
import { BioSection } from '../components/habeeb/BioSection'
import { EpkContactSection } from '../components/habeeb/EpkContactSection'
import { HabeebHero } from '../components/habeeb/HabeebHero'
import { PressSection } from '../components/habeeb/PressSection'
import { SnapshotSection } from '../components/habeeb/SnapshotSection'
import { SoundSection } from '../components/habeeb/SoundSection'
import { EpkHeader } from '../components/layout/EpkHeader'
import { Footer } from '../components/layout/Footer'
import styles from '../components/layout/Layout.module.css'
import { useScrollReveals } from '../hooks/useScrollReveals'
import { openHabeebPdf } from '../services/habeebPdf'

export function HabeebEpkPage() {
  useScrollReveals()

  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const handleHabeebPdfClick = (event: MouseEvent<HTMLAnchorElement>) => {
    openHabeebPdf(event, setIsPdfLoading)
  }

  return (
    <main className={styles.epkShell}>
      <EpkHeader isPdfLoading={isPdfLoading} onPdfClick={handleHabeebPdfClick} />
      <HabeebHero />
      <SnapshotSection />
      <BioSection />
      <SoundSection />
      <PressSection />
      <EpkContactSection isPdfLoading={isPdfLoading} onPdfClick={handleHabeebPdfClick} />
      <Footer left="Habeeb EPK" right="Night Method Agency" />
    </main>
  )
}
