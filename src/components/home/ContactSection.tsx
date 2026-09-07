import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { email } from '../../config'
import { BrandButton } from '../shared/BrandButton'
import styles from './HomeSections.module.css'

export function ContactSection() {
  return (
    <section id="contact" className={`${styles.contact} bg-[#0a0908]`} data-reveal-root>
      <img
        className={`${styles.backgroundImage} opacity-70`}
        data-image-motion
        src="/images/booth.webp"
        alt="Sunset Sessions crowd under rooftop signage"
      />
      <div className={styles.contactOverlay} />
      <div className="relative z-10 flex min-h-[92svh] flex-col justify-between px-5 py-16 sm:px-8 lg:px-12">
        <div className="max-w-5xl" data-reveal>
          <p className={`${styles.eyebrow} ${styles.red}`}>Inquiries</p>
          <h2 className="mt-5 text-balance text-[clamp(2.35rem,10.5vw,4.5rem)] font-black uppercase leading-[.94] tracking-normal sm:text-7xl lg:text-8xl">
            Send the music, context, and what needs managing.
          </h2>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end" data-reveal style={{ '--reveal-delay': '160ms' } as CSSProperties}>
          <p className="max-w-2xl text-lg leading-8 text-[#f5f1e8]/74">
            Include links, timeline, city, and the practical ask. We read
            everything, reply when there is a fit, and keep details off the
            public site.
          </p>
          <BrandButton className="max-w-full px-5 py-4 text-xs font-black uppercase tracking-[0.1em] sm:w-fit sm:text-base sm:tracking-[0.18em]" href={`mailto:${email}`}>
            <span className="min-w-0 text-left">Contact us</span>
            <ArrowUpRight className="shrink-0" size={20} />
          </BrandButton>
        </div>
      </div>
    </section>
  )
}
