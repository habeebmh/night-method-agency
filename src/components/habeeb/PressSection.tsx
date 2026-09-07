import { ArrowUpRight } from 'lucide-react'
import type { CSSProperties } from 'react'
import { habeebPressQuotes } from '../../data/habeeb'
import styles from './HabeebSections.module.css'

export function PressSection() {
  return (
    <section
      id="press"
      className={`${styles.paleSection} px-5 py-16 sm:px-8 lg:px-12 lg:py-24`}
      data-reveal-root
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b border-[#171310]/18 pb-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.2fr)] lg:items-end">
          <div data-reveal>
            <p className={`${styles.eyebrow} ${styles.red}`}>Press</p>
            <h2 className="mt-4 text-[clamp(2.2rem,6vw,4.7rem)] font-black uppercase leading-[.88] tracking-normal">
              In their words.
            </h2>
          </div>
          <p
            className="max-w-2xl text-base leading-7 text-[#423a32] lg:justify-self-end lg:text-lg"
            data-reveal
            style={{ '--reveal-delay': '100ms' } as CSSProperties}
          >
            Selected coverage of <cite className="not-italic">Stick Together</cite> and{' '}
            <cite className="not-italic">Money on My Mind</cite>.
          </p>
        </div>

        <div className="grid gap-px bg-[#171310]/18 lg:grid-cols-2">
          {habeebPressQuotes.map((item, index) => (
            <a
              className="group flex min-h-72 flex-col justify-between bg-[#f5f1e8] p-6 transition-colors hover:bg-[#ebe6da] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#d94b2b] sm:p-8"
              data-reveal
              href={item.href}
              key={item.publication}
              rel="noreferrer"
              style={{ '--reveal-delay': `${140 + (index % 2) * 70}ms` } as CSSProperties}
              target="_blank"
            >
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#d94b2b]">
                  {String(index + 1).padStart(2, '0')} / {item.publication}
                </p>
                <blockquote className="mt-8 text-[clamp(1.35rem,2.5vw,2rem)] font-black leading-[1.08] tracking-[-0.02em]">
                  “{item.quote}”
                </blockquote>
                {item.translation ? (
                  <p className="mt-5 border-l-2 border-[#171310]/20 pl-4 text-sm leading-6 text-[#5b5148]">
                    <span className="font-bold uppercase tracking-[0.12em]">English:</span>{' '}
                    {item.translation}
                  </p>
                ) : null}
              </div>
              <span className="mt-10 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em]">
                Read coverage
                <ArrowUpRight
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  size={16}
                />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
