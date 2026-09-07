import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { jsPDF } from 'jspdf'
import { writeValidatedPdfAtomically } from './festival-outreach-output.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const date = process.env.FESTIVAL_OUTREACH_DATE || new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Chicago',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date())
const outputPath = path.join(root, 'output', 'pdf', `Habeeb_Manager_Outreach_${date}.pdf`)

const entries = [
  {
    festival: 'Marvellous Island Festival 2027',
    location: 'Grand Paris / Plage de Torcy, France | May 15-16, 2027',
    contact: 'Laurent Kemler, Artistic Director and music programmer',
    email: 'laurent@nuit-sauvage.com',
    subject: 'Habeeb for Marvellous Island 2027',
    body: `Hi Laurent,

I'm writing on behalf of Habeeb, a Dallas-based House and Tech House artist, for Marvellous Island's 2027 edition.

La Kasbah's House and Tech House direction is a natural match for a set built around heavy low end, UK Garage and Bassline accents, and an experimental edge. Seeing Dennis Cruz and Nic Fanciulli in the 2026 program also makes the fit clear: Habeeb can bring a dynamic performance that stays grounded in the groove while adding a sharper garage pulse.

He performed at Breakaway Dallas in 2026 and is booked for the upcoming Breakaway Houston. He has also signed two records to Animarum, scheduled for release on September 18.

Current music and materials are in the [Habeeb EPK](https://nightmethodagency.com/habeeb).

Would you consider Habeeb for Marvellous Island 2027, particularly La Kasbah or another House-focused stage? I'm happy to share availability and fee guidance.

Best,
Joanna Biehler
Night Method Agency`,
  },
  {
    festival: 'Horst Arts & Music Festival 2027',
    location: 'Asiat Park, Vilvoorde, Belgium | May 6-8, 2027',
    contact: 'Simon Nowak, Head of Music and co-organizer',
    email: 'info@horstartsandmusic.com',
    subject: 'Habeeb for Horst Festival 2027',
    body: `Hi Simon,

I'm reaching out on behalf of Habeeb, a Dallas-based House and Tech House artist, for Horst Festival 2027.

Horst's pairing of experimental electronic programming with stages shaped around architecture and space suits how Habeeb approaches a set: as a dynamic performance, not a fixed run of tracks. Todd Edwards and Daphni in the 2026 program are useful reference points for the groove, swing, and left-turn energy he brings, with UK Garage and Bassline threaded through his House foundation.

Habeeb performed at Breakaway Dallas in 2026, and he's booked for the upcoming Breakaway Houston. He also has an upcoming Animarum label showcase in Berlin in spring 2027, which makes a European festival date timely.

Current music and materials are in the [Habeeb EPK](https://nightmethodagency.com/habeeb).

Would you consider Habeeb for the 2027 music program? I'd be glad to send availability, fee guidance, and any additional materials.

Best,
Joanna Biehler
Night Method Agency`,
  },
]

const colors = {
  navy: [21, 31, 51],
  muted: [102, 112, 127],
  accent: [219, 89, 46],
  light: [241, 243, 245],
  link: [25, 92, 166],
}
const margin = 48
const pageWidth = 612
const pageHeight = 792
const contentWidth = pageWidth - margin * 2

function plainText(markdown) {
  return markdown.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
}

function validateEntry(entry) {
  for (const field of ['festival', 'contact', 'email', 'subject', 'body']) {
    if (!entry[field]?.trim()) throw new Error(`${entry.festival || 'Festival'} is missing ${field}.`)
  }

  const wordCount = plainText(entry.body).trim().split(/\s+/).length
  if (wordCount < 120 || wordCount > 180) {
    throw new Error(`${entry.festival} email must be 120-180 words; found ${wordCount}.`)
  }

  const links = entry.body.match(/https?:\/\/[^)\s]+/g) || []
  if (links.length !== 1 || links[0] !== 'https://nightmethodagency.com/habeeb') {
    throw new Error(`${entry.festival} email must contain only the Habeeb EPK link.`)
  }

  if (/Silo Dallas|genre-fluid/i.test(entry.body)) {
    throw new Error(`${entry.festival} email contains prohibited positioning.`)
  }
}

function addHeaderFooter(doc, pageNumber) {
  doc.setFillColor(...colors.accent)
  doc.rect(0, 0, pageWidth, 10, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(...colors.muted)
  doc.text('NIGHT METHOD AGENCY', margin, 48)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.text(`MANAGER OUTREACH PACKET  |  ${date}`, margin, pageHeight - 26)
  doc.text(String(pageNumber), pageWidth - margin, pageHeight - 26, { align: 'right' })
}

function drawWrapped(doc, text, x, y, width, options = {}) {
  const fontSize = options.fontSize || 10.5
  const leading = options.leading || 14.2
  doc.setFont('helvetica', options.bold ? 'bold' : 'normal')
  doc.setFontSize(fontSize)
  doc.setTextColor(...(options.color || colors.navy))
  const lines = doc.splitTextToSize(text, width)
  doc.text(lines, x, y, { lineHeightFactor: leading / fontSize })
  return y + lines.length * leading
}

function drawEmailBody(doc, body, x, y, width) {
  const paragraphs = body.split('\n\n')
  let cursor = y

  for (const paragraph of paragraphs) {
    const linkMatch = paragraph.match(/^(.+?)\[Habeeb EPK\]\((https:\/\/nightmethodagency\.com\/habeeb)\)(.*)$/)
    if (linkMatch) {
      const [, prefix, url, suffix] = linkMatch
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10.5)
      doc.setTextColor(...colors.navy)
      doc.text(prefix, x, cursor)
      const linkX = x + doc.getTextWidth(prefix)
      doc.setTextColor(...colors.link)
      const linkWidth = doc.textWithLink('Habeeb EPK', linkX, cursor, { url })
      doc.setDrawColor(...colors.link)
      doc.setLineWidth(0.5)
      doc.line(linkX, cursor + 1.5, linkX + linkWidth, cursor + 1.5)
      doc.setTextColor(...colors.navy)
      doc.text(suffix, linkX + linkWidth, cursor)
      cursor += 18
      continue
    }

    cursor = drawWrapped(doc, paragraph, x, cursor, width)
    cursor += 5
  }

  return cursor
}

function buildDocument() {
  const doc = new jsPDF({ unit: 'pt', format: 'letter', compress: true })
  doc.setProperties({
    title: `Habeeb Manager Outreach ${date}`,
    author: 'Night Method Agency',
    subject: 'Send-ready festival booking outreach',
  })

  addHeaderFooter(doc, 1)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...colors.navy)
  doc.setFontSize(42)
  doc.text('Habeeb', margin, 190)
  doc.setTextColor(...colors.accent)
  doc.setFontSize(24)
  doc.text('Festival Booking Outreach', margin, 232)
  doc.setTextColor(...colors.muted)
  doc.setFontSize(11)
  doc.text('MANAGER OUTREACH PACKET', margin, 270)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...colors.navy)
  doc.setFontSize(12)
  const generatedDate = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${date}T12:00:00-05:00`))
  doc.text(`Generated ${generatedDate}`, margin, 300)
  doc.setDrawColor(...colors.accent)
  doc.line(margin, 330, pageWidth - margin, 330)
  drawWrapped(
    doc,
    `Two current, send-ready festival opportunities for Habeeb, selected for electronic programming fit and verified booking routes.`,
    margin,
    372,
    contentWidth,
    { fontSize: 15, leading: 22 },
  )
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Prepared for Joanna Biehler', margin, 590)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...colors.muted)
  doc.setFontSize(11)
  doc.text('Night Method Agency', margin, 610)

  entries.forEach((entry, index) => {
    doc.addPage('letter', 'portrait')
    addHeaderFooter(doc, index + 2)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(...colors.navy)
    doc.text(`Festival: ${entry.festival}`, margin, 82)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(...colors.muted)
    doc.text(entry.location, margin, 105)
    doc.setDrawColor(...colors.accent)
    doc.line(margin, 120, pageWidth - margin, 120)

    let y = 146
    for (const [label, value] of [
      ['Booking contact:', entry.contact],
      ['Email:', entry.email],
      ['Subject:', entry.subject],
    ]) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(...colors.navy)
      doc.text(label, margin, y)
      doc.setFont('helvetica', 'normal')
      doc.text(value, margin + 102, y)
      y += 19
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(...colors.accent)
    doc.text('Email copy:', margin, y + 8)
    y = drawEmailBody(doc, entry.body, margin, y + 30, contentWidth)

    doc.setFillColor(...colors.light)
    doc.rect(margin, y + 3, contentWidth, 30, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9.5)
    doc.setTextColor(...colors.navy)
    doc.text('Attachments: Technical Rider; Hospitality & Accommodation Rider', margin + 10, y + 22)
  })

  return doc.output('arraybuffer')
}

entries.forEach(validateEntry)

await writeValidatedPdfAtomically({
  entries,
  outputPath,
  render: async (tempPath) => writeFile(tempPath, new Uint8Array(buildDocument())),
})

console.log(outputPath)
