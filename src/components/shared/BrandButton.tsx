import { clsx } from 'clsx'
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import styles from './BrandButton.module.css'

type BrandButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
}

export function BrandButton({ children, className, ...props }: BrandButtonProps) {
  return (
    <a className={clsx(styles.button, className)} {...props}>
      {children}
    </a>
  )
}
