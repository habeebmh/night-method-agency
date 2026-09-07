import { useEffect } from 'react'

export function useScrollReveals() {
  useEffect(() => {
    const animatedElements = Array.from(
      document.querySelectorAll<HTMLElement>('[data-reveal-root], [data-reveal]'),
    )

    const reveal = (element: HTMLElement) => {
      element.classList.add('is-visible')
    }

    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach(reveal)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveal(entry.target as HTMLElement)
            observer.unobserve(entry.target)
          }
        })
      },
      { rootMargin: '0px 0px -16% 0px', threshold: 0.18 },
    )

    animatedElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [])
}
