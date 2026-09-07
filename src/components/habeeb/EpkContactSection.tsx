import type { CSSProperties, MouseEventHandler } from 'react'
import { ArrowUpRight, Download } from 'lucide-react'
import { habeebEmail, habeebPdfHref } from '../../config'
import { ApiSpinner } from '../shared/ApiSpinner'
import { BrandButton } from '../shared/BrandButton'
import styles from './HabeebSections.module.css'

type EpkContactSectionProps = {
  isPdfLoading: boolean
  onPdfClick: MouseEventHandler<HTMLAnchorElement>
}

export function EpkContactSection({ isPdfLoading, onPdfClick }: EpkContactSectionProps) {
  return (
    <section className={`${styles.contactSection} px-5 py-16 sm:px-8 lg:px-12`} data-reveal-root>
      <img
        className={`${styles.backgroundImage} opacity-45`}
        data-image-motion
        src="/images/stage.webp"
        alt="Wide club room with crowd and blue lights"
      />
      <div className={styles.contactOverlay} />
      <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div data-reveal>
          <p className={`${styles.eyebrow} ${styles.green}`}>Contact</p>
          <h2 className="mt-4 max-w-5xl text-[clamp(2.4rem,8vw,6rem)] font-black uppercase leading-[.86] tracking-normal">
            Bookings, press, and management inquiries.
          </h2>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f5f1e8]/76">
            This EPK was prepared by Night Method Agency for Habeeb. For routing, press materials, performance context, or direct artist inquiries, use the links below.
          </p>
        </div>
        <div className="grid min-w-[min(100%,22rem)] gap-3" data-reveal style={{ '--reveal-delay': '150ms' } as CSSProperties}>
          <BrandButton className="justify-between px-5 py-4 text-sm font-black uppercase tracking-[0.14em]" href={`mailto:${habeebEmail}`}>
            <span className="min-w-0">Contact us</span>
            <ArrowUpRight className="shrink-0" size={19} />
          </BrandButton>
          <BrandButton
            className="justify-between border border-[#f5f1e8]/24 px-5 py-4 text-sm font-black uppercase tracking-[0.14em]"
            href={habeebPdfHref}
            onClick={onPdfClick}
            target="_blank"
            rel="noreferrer"
          >
            <span className="min-w-0">Download PDF</span>
            {isPdfLoading ? <ApiSpinner /> : <Download className="shrink-0" size={19} />}
          </BrandButton>
        </div>
      </div>
    </section>
  )
}
