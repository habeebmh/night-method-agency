import type { CSSProperties } from 'react'
import { habeebBio } from '../../data/habeeb'
import styles from './HabeebSections.module.css'

export function BioSection() {
  return (
    <section className={styles.splitSection} data-reveal-root>
      <div className={styles.splitImage}>
        <img
          className={styles.backgroundImage}
          data-image-motion
          src="/images/street-portrait.webp"
          alt="Artist portrait in nightlife setting"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,16,14,.85),rgba(16,16,14,.16)_52%,rgba(16,16,14,.55))]" />
      </div>
      <div className="px-5 py-16 sm:px-8 lg:px-12">
        <p className={`${styles.eyebrow} ${styles.green}`} data-reveal>Biography</p>
        <div className="mt-8 max-w-3xl space-y-6 text-base leading-7 text-[#f5f1e8]/78 sm:text-lg sm:leading-8" data-reveal style={{ '--reveal-delay': '100ms' } as CSSProperties}>
          {habeebBio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
