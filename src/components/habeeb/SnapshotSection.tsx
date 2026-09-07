import type { CSSProperties } from 'react'
import { habeebHighlights } from '../../data/habeeb'
import styles from './HabeebSections.module.css'

export function SnapshotSection() {
  return (
    <section className={`${styles.paleSection} px-5 py-16 sm:px-8 lg:px-12`} data-reveal-root>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.45fr)]">
        <div data-reveal>
          <p className={`${styles.eyebrow} ${styles.red}`}>Snapshot</p>
          <h2 className="mt-4 text-[clamp(2.2rem,6vw,4.7rem)] font-black uppercase leading-[.88] tracking-normal">
            Club music with a human center.
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden border border-[#171310]/15 bg-[#171310]/15 md:grid-cols-2" data-reveal style={{ '--reveal-delay': '110ms' } as CSSProperties}>
          {habeebHighlights.map((item, index) => (
            <div className="bg-[#f5f1e8] p-6 text-lg font-black uppercase leading-6 tracking-normal" key={item} data-reveal style={{ '--reveal-delay': `${160 + index * 60}ms` } as CSSProperties}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
