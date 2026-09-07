import type { CSSProperties } from 'react'
import { Mail } from 'lucide-react'
import { email } from '../../config'
import { BrandButton } from '../shared/BrandButton'
import styles from './HomeSections.module.css'

export function HomeHero() {
  return (
    <section className={styles.hero} data-reveal-root>
      <img
        className={styles.heroImage}
        data-image-motion
        src="/images/stage.webp"
        alt="Wide club room with crowd and blue lights"
      />
      <div className={styles.heroOverlay} />
      <div className="absolute left-5 top-24 z-10 hidden h-[45svh] w-px origin-top bg-[#c7ff5c]/60 sm:block lg:left-12" data-line-reveal />
      <div className="absolute right-5 top-24 z-10 hidden max-w-[18rem] border border-[#f5f1e8]/18 bg-[#050504]/60 p-4 text-xs font-bold uppercase leading-5 tracking-[0.18em] text-[#f5f1e8]/70 backdrop-blur-md lg:block" data-reveal style={{ '--reveal-delay': '180ms' } as CSSProperties}>
        No public roster. No inflated deck. Just the work between the room
        and the record.
      </div>
      <div className="relative z-10 flex min-h-[100svh] items-end px-5 pb-14 pt-28 sm:px-8 lg:px-12">
        <div className="flex w-full flex-col gap-8">
          <div className="max-w-7xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.38em] text-[#c7ff5c]" data-reveal>
              Night Method
            </p>
            <h1 className="text-balance text-[clamp(3.2rem,9vw,8.6rem)] font-black uppercase leading-[.84] tracking-normal" data-reveal style={{ '--reveal-delay': '90ms' } as CSSProperties}>
              Artist management after dark.
            </h1>
          </div>
          <div className="mb-2 max-w-2xl border-l border-[#f5f1e8]/25 pl-5 lg:ml-auto" data-reveal style={{ '--reveal-delay': '220ms' } as CSSProperties}>
            <p className="text-lg leading-7 text-[#f5f1e8]/82">
              A discreet management and strategy office for select artists,
              producers, and culture projects. Built for release plans, rooms,
              tours, partnerships, and the decisions between them.
            </p>
            <BrandButton className="mt-6 max-w-full border border-[#f5f1e8]/30 px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] sm:text-sm sm:tracking-[0.18em]" href={`mailto:${email}`}>
              <Mail className="shrink-0" size={17} />
              <span className="min-w-0 text-left">Contact us</span>
            </BrandButton>
          </div>
        </div>
      </div>
    </section>
  )
}
