import type { CSSProperties } from 'react'
import { services } from '../../data/home'
import styles from './HomeSections.module.css'

export function ServicesSection() {
  return (
    <section id="services" className={`${styles.paleSection} px-5 py-20 sm:px-8 lg:px-12`} data-reveal-root>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.35fr)] xl:gap-16">
        <div data-reveal>
          <p className={`${styles.eyebrow} ${styles.red}`}>Services</p>
          <h2 className="mt-4 max-w-[34rem] text-[clamp(1.85rem,3.35vw,3rem)] font-black uppercase leading-[.94] tracking-normal">
            <span className="block">Quiet</span>
            <span className="block">Infrastructure</span>
            <span className="block">for visible</span>
            <span className="block">work.</span>
          </h2>
          <div className="mt-10 grid grid-cols-3 border-y border-[#171310]/20 py-4 text-center text-[10px] font-black uppercase tracking-[0.14em] text-[#171310]/62">
            <span>Private</span>
            <span>Fast</span>
            <span>Selective</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#171310]/15 bg-[#171310]/15 md:grid-cols-2" data-reveal style={{ '--reveal-delay': '120ms' } as CSSProperties}>
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <article className="bg-[#f5f1e8] p-6 sm:p-8" data-reveal style={{ '--reveal-delay': `${180 + index * 70}ms` } as CSSProperties} key={service.label}>
                <div className="mb-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#171310] text-[#c7ff5c]">
                  <Icon size={21} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-normal">
                  {service.label}
                </h3>
                <p className="mt-4 text-base leading-7 text-[#423a32]">
                  {service.text}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
