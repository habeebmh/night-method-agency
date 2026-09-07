import type { MouseEvent } from 'react'
import { habeebFallbackPdfHref, habeebPdfHref } from '../config'

export function openHabeebPdf(
  event: MouseEvent<HTMLAnchorElement>,
  setIsPdfLoading: (isLoading: boolean) => void,
) {
  event.preventDefault()
  setIsPdfLoading(true)

  const pdfTab = window.open('', '_blank')
  if (pdfTab) {
    pdfTab.document.write('<!doctype html><title>Generating Habeeb EPK</title><body style="margin:0;background:#0a0908;color:#f5f1e8;font:700 14px Arial,sans-serif;display:grid;min-height:100vh;place-items:center;letter-spacing:.14em;text-transform:uppercase">Generating PDF...</body>')
  }

  fetch(habeebPdfHref)
    .then((response) => {
      if (!response.ok) {
        throw new Error('PDF API failed.')
      }

      return response.blob()
    })
    .then((pdfBlob) => {
      const href = URL.createObjectURL(pdfBlob)

      if (pdfTab) {
        pdfTab.location.href = href
        window.setTimeout(() => URL.revokeObjectURL(href), 60_000)
        return
      }

      window.location.href = href
      window.setTimeout(() => URL.revokeObjectURL(href), 60_000)
    })
    .catch(() => {
      if (pdfTab) {
        pdfTab.location.href = habeebFallbackPdfHref
        return
      }

      window.location.href = habeebFallbackPdfHref
    })
    .finally(() => setIsPdfLoading(false))
}
