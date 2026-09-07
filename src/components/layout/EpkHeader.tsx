import { Download, RadioTower } from 'lucide-react'
import type { MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'
import { habeebPdfHref } from '../../config'
import { ApiSpinner } from '../shared/ApiSpinner'
import { BrandButton } from '../shared/BrandButton'
import styles from './Layout.module.css'

type EpkHeaderProps = {
  isPdfLoading: boolean
  onPdfClick: MouseEventHandler<HTMLAnchorElement>
}

export function EpkHeader({ isPdfLoading, onPdfClick }: EpkHeaderProps) {
  return (
    <header className={`${styles.header} ${styles.epkHeader}`}>
      <nav className={styles.nav}>
        <Link className={styles.brand} to="/">
          <span className={styles.brandMark}>
            <RadioTower size={17} />
          </span>
          Night Method
        </Link>
        <BrandButton
          className="border border-[#f5f1e8]/30 px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em]"
          href={habeebPdfHref}
          onClick={onPdfClick}
          target="_blank"
          rel="noreferrer"
        >
          {isPdfLoading ? <ApiSpinner /> : <Download className="shrink-0" size={16} />}
          <span className="min-w-0">PDF</span>
        </BrandButton>
      </nav>
    </header>
  )
}
