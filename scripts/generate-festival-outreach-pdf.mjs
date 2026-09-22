import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { jsPDF } from 'jspdf'
import { validatePacket, writeValidatedPdfAtomically } from './festival-outreach-output.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const date = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Chicago', year: 'numeric', month: '2-digit', day: '2-digit',
}).format(new Date())
const inputPath = path.join(root, 'tasks/festival-outreach', `${date}.json`)
const historyPath = path.join(root, 'tasks/festival-outreach/delivery-history.json')
const input = JSON.parse(await readFile(inputPath, 'utf8'))
const history = JSON.parse(await readFile(historyPath, 'utf8'))
const packet = validatePacket(input, history, date)
const entries = [...packet.entries].sort((a, b) =>
  Number(a.change === 'RETAINED') - Number(b.change === 'RETAINED') || Number(a.priority) - Number(b.priority))
const outputPath = path.join(root, 'output/pdf', `Habeeb_Manager_Outreach_${date}.pdf`)
const colors = { navy: [21, 31, 51], muted: [92, 102, 117], accent: [190, 66, 28], link: [25, 92, 166] }
const margin = 48
const width = 516
const bottom = 736

function buildDocument() {
  const doc = new jsPDF({ unit: 'pt', format: 'letter', compress: true })
  doc.setProperties({ title: `Habeeb Manager Outreach ${date}`, author: 'Night Method Agency' })
  let y = 80
  let page = 0
  function newPage() {
    if (page) doc.addPage()
    page++
    y = 80
    doc.setFillColor(...colors.accent)
    doc.rect(0, 0, 612, 8, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...colors.muted)
    doc.setFontSize(9)
    doc.text('NIGHT METHOD AGENCY', margin, 40)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.text(`MANAGER OUTREACH PACKET | ${date}`, margin, 766)
    doc.text(String(page), 564, 766, { align: 'right' })
  }
  function text(value, { size = 10.5, bold = false, color = colors.navy, gap = 7, url } = {}) {
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setFontSize(size)
    const lines = doc.splitTextToSize(value, width)
    const leading = size * 1.35
    for (const line of lines) {
      if (y + leading > bottom) newPage()
      doc.setFont('helvetica', bold ? 'bold' : 'normal')
      doc.setFontSize(size)
      doc.setTextColor(...color)
      if (url) doc.textWithLink(line, margin, y, { url })
      else doc.text(line, margin, y)
      y += leading
    }
    y += gap
  }
  newPage()
  text('Habeeb | Festival Outreach', { size: 26, bold: true })
  text(`Generated ${date} | Prepared for Joanna Biehler`, { color: colors.muted })
  const fresh = entries.filter(e => e.change === 'NEW').length
  const updated = entries.filter(e => e.change === 'CONTACT UPDATED').length
  const retained = entries.length - fresh - updated
  text(`${fresh} new opportunities | ${updated} contact updates | ${retained} retained`, { size: 14, bold: true, color: colors.accent })
  text('Start with the new opportunities below. Retained entries appeared in earlier packets and have not been reported sent to festivals.')
  text('Manager action queue', { size: 16, bold: true })
  for (const entry of entries) {
    if (y > 605) newPage()
    text(`${entry.change} | ${entry.festival}`, { bold: true, size: 12 })
    text(entry.action)
    text(entry.fit, { size: 9, color: colors.muted })
  }
  text('Before sending: confirm availability and fee guidance, attach both riders, and check whether you already contacted this exact edition. Report sent editions so they can be removed from future packets.', { size: 9, color: colors.muted })

  for (const entry of entries) {
    newPage()
    text(`Festival: ${entry.festival}`, { size: 18, bold: true })
    text(`${entry.change} | ${entry.location}`, { size: 10, color: colors.muted })
    text(`Booking contact: ${entry.contact}`, { size: 10 })
    text(`Email: ${entry.email}`, { size: 10 })
    text(`Subject: ${entry.subject}`, { size: 10, bold: true })
    text('Email copy:', { size: 11, bold: true, color: colors.accent })
    for (const paragraph of entry.body.split('\n\n')) {
      // Keep the EPK as the only hyperlink within the outreach copy.
      const marker = '[Habeeb EPK](https://nightmethodagency.com/habeeb)'
      if (paragraph.includes(marker)) {
        const plain = paragraph.replace(marker, 'Habeeb EPK')
        if (doc.splitTextToSize(plain, width).length !== 1) throw new Error('EPK sentence must fit on one line.')
        if (y + 24 > bottom) newPage()
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10.5)
        doc.setTextColor(...colors.navy)
        const [prefix, suffix] = paragraph.split(marker)
        doc.text(prefix, margin, y)
        const linkX = margin + doc.getTextWidth(prefix)
        doc.setTextColor(...colors.link)
        const linkWidth = doc.textWithLink('Habeeb EPK', linkX, y, { url: 'https://nightmethodagency.com/habeeb' })
        doc.setTextColor(...colors.navy)
        doc.text(suffix, linkX + linkWidth, y)
        y += 21
      } else text(paragraph)
    }
    text('Attachments: Technical Rider; Hospitality & Accommodation Rider', { size: 9, bold: true })
  }

  newPage()
  text('Verification notes for the manager', { size: 18, bold: true })
  text('These notes are outside the email copy. General inboxes are routing requests, not verified personal inboxes. No public open call found means none was located on the reviewed pages and searches as of the run date; it is not proof that one cannot open later.', { size: 9, color: colors.muted })
  for (const entry of entries) {
    if (y > 510) newPage()
    text(entry.festival, { size: 13, bold: true })
    for (const [type, evidence] of Object.entries(entry.evidence)) {
      text(`${type[0].toUpperCase() + type.slice(1)}: ${evidence.finding}`, { size: 9, gap: 3 })
      evidence.urls.forEach((url, index) => text(`${type} source ${index + 1}: ${new URL(url).hostname}`, {
        size: 8, color: colors.link, url, gap: 3,
      }))
    }
    y += 8
  }
  return doc.output('arraybuffer')
}

await writeValidatedPdfAtomically({
  entries, outputPath,
  render: async tempPath => writeFile(tempPath, new Uint8Array(buildDocument())),
})
console.log(JSON.stringify({
  outputPath, date, entries: entries.map(({ id, change, email }) => ({ id, change, email })),
  deliveryEligible: true,
}, null, 2))
