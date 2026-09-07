import { Suspense, type CSSProperties } from 'react'
import { habeebSounds } from '../../data/habeeb'
import { AudienceStatsLoading, LiveAudienceStats } from './AudienceStats'
import styles from './HabeebSections.module.css'

export function SoundSection() {
  return (
    <section className={`${styles.darkSection} px-5 py-16 sm:px-8 lg:px-12`} data-reveal-root>
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div data-reveal>
          <p className={`${styles.eyebrow} ${styles.red}`}>Sound</p>
          <h2 className="mt-4 text-[clamp(2.2rem,6vw,4.7rem)] font-black uppercase leading-[.88] tracking-normal">
            Bass pressure. Emotional release.
          </h2>
          <div className="mt-10 grid gap-3">
            {habeebSounds.map((sound, index) => (
              <div className="border border-[#f5f1e8]/16 p-5 text-sm font-bold uppercase leading-6 tracking-[0.12em] text-[#f5f1e8]/82" data-reveal style={{ '--reveal-delay': `${150 + index * 70}ms` } as CSSProperties} key={sound}>
                {sound}
              </div>
            ))}
          </div>
        </div>
        <Suspense fallback={<AudienceStatsLoading />}>
          <LiveAudienceStats />
        </Suspense>
      </div>
    </section>
  )
}
