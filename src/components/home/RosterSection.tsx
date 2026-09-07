import type { CSSProperties } from 'react'
import { rosterTags } from '../../data/home'
import styles from './HomeSections.module.css'

export function RosterSection() {
  return (
    <section id="roster" className={styles.roster} data-reveal-root>
      <div className={styles.rosterImage}>
        <img
          className={styles.backgroundImage}
          data-image-motion
          src="/images/duo.webp"
          alt="Coco event crowd under club lighting"
        />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,16,14,.85),rgba(16,16,14,.1)_50%,rgba(16,16,14,.62))]" />
      </div>
      <div className={styles.rosterCopy}>
        <div data-reveal>
          <p className={`${styles.eyebrow} ${styles.green}`}>Roster</p>
          <p className="mt-8 text-[clamp(4rem,18vw,11rem)] font-black uppercase leading-none text-[#f5f1e8]/[0.045] lg:-ml-2">
            Private
          </p>
          <h2 className="mt-4 max-w-xl text-[clamp(2.4rem,11vw,4.5rem)] font-black uppercase leading-[.94] tracking-normal sm:text-7xl">
            Select artists. Limited disclosure.
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#f5f1e8]/74">
            We work quietly with developing and established projects across
            electronic, hip-hop, left-pop, and multidisciplinary nightlife.
            Public credits are shared case by case.
          </p>
        </div>
        <div className="mt-16 grid gap-3 sm:grid-cols-3">
          {rosterTags.map((item, index) => (
            <div
              className="flex min-h-16 items-center justify-center border border-[#f5f1e8]/15 px-6 text-center text-sm font-bold uppercase tracking-[0.16em] text-[#f5f1e8]/82"
              data-reveal
              style={{ '--reveal-delay': `${160 + index * 80}ms` } as CSSProperties}
              key={item}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
