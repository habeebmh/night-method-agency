import { Link } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import styles from '../components/layout/Layout.module.css'

export function NotFoundPage() {
  return (
    <main className={styles.siteShell}>
      <SiteHeader />
      <section className="flex min-h-screen items-center px-5 pt-24 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c7ff5c]">
            404
          </p>
          <h1 className="mt-5 text-[clamp(2.8rem,10vw,6.5rem)] font-black uppercase leading-[.86] tracking-normal">
            Page not found.
          </h1>
          <Link className="mt-8 inline-flex border border-[#f5f1e8]/30 bg-[#050504] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#f5f1e8]" to="/">
            Return home
          </Link>
        </div>
      </section>
    </main>
  )
}
