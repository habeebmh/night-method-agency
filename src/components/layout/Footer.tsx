import styles from './Layout.module.css'

type FooterProps = {
  left: string
  right: string
}

export function Footer({ left, right }: FooterProps) {
  return (
    <footer className={styles.footer}>
      <span>{left}</span>
      <span>{right}</span>
    </footer>
  )
}
