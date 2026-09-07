import { RadioTower } from 'lucide-react'
import { Link } from 'react-router-dom'
import styles from './Layout.module.css'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link className={styles.brand} to="/">
          <span className={styles.brandMark}>
            <RadioTower size={17} />
          </span>
          Night Method
        </Link>
        <div className={styles.navLinks}>
          <a href="/#services">Services</a>
          <a href="/#roster">Roster</a>
          <a href="/#contact">Contact</a>
        </div>
      </nav>
    </header>
  )
}
