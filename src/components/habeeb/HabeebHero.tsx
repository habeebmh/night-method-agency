import type { CSSProperties } from 'react'
import { ExternalLink } from 'lucide-react'
import { habeebLinks } from '../../data/habeeb'
import { BrandButton } from '../shared/BrandButton'
import styles from './HabeebSections.module.css'

export function HabeebHero() {
  return (
    <section className={styles.hero} data-reveal-root>
      <img
        className={styles.heroImage}
        data-image-motion
        src="/images/booth.webp"
        alt="DJ booth facing a lit crowd"
      />
      <div className={styles.heroOverlay} />
      <div className="relative z-10 flex min-h-[calc(100svh-6rem)] items-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,.55fr)] lg:items-end">
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.38em] text-[#c7ff5c]" data-reveal>
              Electronic Press Kit
            </p>
            <h1 className="text-[clamp(4.2rem,17vw,13rem)] font-black uppercase leading-[.78] tracking-normal" data-reveal style={{ '--reveal-delay': '90ms' } as CSSProperties}>
              Habeeb
            </h1>
            <p className="mt-7 max-w-3xl text-balance text-xl leading-8 text-[#f5f1e8]/82" data-reveal style={{ '--reveal-delay': '170ms' } as CSSProperties}>
              Independent electronic artist and DJ from Dallas, Texas building emotional club records across Tech House, UK Speed Garage, Bassline, and melodic dance music.
            </p>
          </div>
          <aside className="border border-[#f5f1e8]/18 bg-[#050504]/72 p-5 backdrop-blur-md" data-reveal style={{ '--reveal-delay': '240ms' } as CSSProperties}>
            <div className="grid gap-3">
              {habeebLinks.map((link) => {
                const Icon = link.icon
                return (
                  <BrandButton
                    className="justify-between border border-[#f5f1e8]/22 px-4 py-3 text-xs font-black uppercase tracking-[0.16em]"
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    key={link.label}
                  >
                    <span className="inline-flex min-w-0 items-center gap-3">
                      <Icon className="shrink-0" size={17} />
                      <span className="min-w-0">{link.label}</span>
                    </span>
                    <ExternalLink className="shrink-0" size={15} />
                  </BrandButton>
                )
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
