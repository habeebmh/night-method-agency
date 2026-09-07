import type { CSSProperties } from 'react'
import { Sparkles } from 'lucide-react'
import { clsx } from 'clsx'
import type { ImagePanel } from '../../data/home'
import styles from './HomeSections.module.css'

type ImageSegmentProps = {
  panel: ImagePanel
  number: number
  reverse?: boolean
}

export function ImageSegment({ panel, number, reverse = false }: ImageSegmentProps) {
  return (
    <section className={styles.segment} data-reveal-root>
      <div className={clsx(styles.segmentImage, reverse ? styles.imageReverse : styles.imageForward)}>
        <img className={styles.backgroundImage} data-image-motion src={panel.src} alt={panel.alt} />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,9,8,.82),rgba(10,9,8,.08)_54%,rgba(10,9,8,.45))]" />
      </div>
      <div className={styles.segmentCopy}>
        <span className="absolute right-4 top-8 text-[9rem] font-black leading-none text-[#f5f1e8]/[0.035] sm:text-[13rem] lg:right-8 lg:top-12" data-drift-number>
          0{number}
        </span>
        <div data-reveal style={{ '--reveal-delay': '80ms' } as CSSProperties}>
          <p className={`${styles.eyebrow} ${styles.green}`}>{panel.eyebrow}</p>
          <h2 className="mt-5 max-w-2xl text-[clamp(2.35rem,10.5vw,4.5rem)] font-black uppercase leading-[.94] tracking-normal sm:text-7xl">
            {panel.title}
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#f5f1e8]/74">
            {panel.copy}
          </p>
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          {panel.meta.map((item, index) => (
            <span
              className="inline-flex items-center gap-2 border border-[#f5f1e8]/16 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f5f1e8]/78"
              data-reveal
              style={{ '--reveal-delay': `${190 + index * 70}ms` } as CSSProperties}
              key={item}
            >
              <Sparkles size={14} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
