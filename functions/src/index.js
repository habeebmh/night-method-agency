import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Firestore } from '@google-cloud/firestore'
import { onRequest } from 'firebase-functions/v2/https'
import { GState, jsPDF } from 'jspdf'
import {
  audienceStatItems,
  fallbackAudienceStats,
  formatAudienceTimestamp,
  getAudienceStatsExpiresAt,
  isAudienceStatsStale,
  refreshAudienceStats,
} from './audienceStats.js'

const firestore = new Firestore({ databaseId: 'audience-cache' })
const cacheRef = firestore.collection('audienceStats').doc('habeeb')
const functionOptions = {
  region: 'us-central1',
  memory: '512MiB',
}
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = resolve(root, 'assets/pdf')

const links = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/habeeeeeeeeeeeeeeeb/',
  },
  {
    label: 'SoundCloud',
    href: 'https://soundcloud.com/habeeeeeeeeeeeeeeeb',
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/artist/6N3UeEjvxjQJBiky7YD2IF?si=pMSf1ELpQbOuu5G1CAbK8A',
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@habeeeeeeeeeeeeeeb',
  },
]

const bio = [
  'Habeeb is an independent electronic artist and DJ from Dallas, Texas whose music lives somewhere between underground club culture and emotional storytelling. While he originally gained traction through Tech House remixes and edits that spread across DJ communities online, his sound has gradually evolved into something less focused on fitting neatly into one genre and more focused on creating a feeling.',
  'A lot of Habeeb\'s music is built around contrast. Heavy basslines paired with emotional vocals. Fast club rhythms mixed with nostalgic melodies. High energy records that still feel personal underneath the surface. Whether he is making Tech House, UK Speed Garage, Bassline, or more melodic club records, the goal stays the same: create music that pulls people out of their head for a few minutes and makes them feel something real.',
  'Before releasing original music, Habeeb built an audience online through edits and remixes that earned thousands of downloads and support from DJs who connected with the balance of familiarity and club energy in his productions. Over time, that evolved into original releases that expanded beyond the style he initially became known for.',
  'As a DJ, Habeeb has performed throughout Dallas clubs and events while continuing to grow his audience as an independent artist, including a performance at Breakaway Dallas 2026. His sets are known for blending genres fluidly while maintaining a consistent emotional and energetic atmosphere from start to finish.',
  'At the center of everything Habeeb creates is a simple idea: dance music should feel human. Not just loud or trendy or functional for a playlist, but something immersive that people remember after the night ends.',
]

export const getHabeebAudienceStats = onRequest(functionOptions, async (request, response) => {
  if (!handleCors(request, response)) {
    return
  }

  try {
    const cache = await refreshAudienceStatsCache()
    response.set('Cache-Control', 'no-store')
    response.json(cache)
  } catch (error) {
    console.error('Audience stats API failed.', error)
    response.status(500).json({
      stats: fallbackAudienceStats,
      updatedAt: Date.now(),
      expiresAt: getAudienceStatsExpiresAt(),
    })
  }
})

export const getHabeebEpkPdf = onRequest(functionOptions, async (request, response) => {
  if (!handleCors(request, response)) {
    return
  }

  try {
    const cache = await getAudienceStatsCache()
    const pdf = generateHabeebPdf(cache)
    const pdfBuffer = Buffer.from(pdf.output('arraybuffer'))

    response.set('Cache-Control', 'public, max-age=300')
    response.set('Content-Type', 'application/pdf')
    response.set('Content-Disposition', `inline; filename="${formatPdfFilename(cache.updatedAt)}"`)
    response.status(200).send(pdfBuffer)
  } catch (error) {
    console.error('EPK PDF generation failed.', error)
    response.status(500).json({ error: 'EPK PDF generation failed.' })
  }
})

async function getAudienceStatsCache() {
  const snapshot = await cacheRef.get()
  const cached = snapshot.exists ? normalizeCache(snapshot.data()) : null

  if (cached && !isAudienceStatsStale(cached.updatedAt, cached.expiresAt)) {
    return cached
  }

  const seedStats = cached?.stats ?? fallbackAudienceStats
  const freshCache = await refreshAudienceStats(seedStats)
  await cacheRef.set(freshCache)

  return freshCache
}

async function refreshAudienceStatsCache() {
  const snapshot = await cacheRef.get()
  const cached = snapshot.exists ? normalizeCache(snapshot.data()) : null
  const seedStats = cached?.stats ?? fallbackAudienceStats
  const freshCache = await refreshAudienceStats(seedStats)
  await cacheRef.set(freshCache)

  return freshCache
}

function normalizeCache(cache) {
  if (!cache?.stats || typeof cache.updatedAt !== 'number') {
    return null
  }

  return {
    stats: {
      spotifyMonthlyListeners: numericOrFallback(
        cache.stats.spotifyMonthlyListeners,
        fallbackAudienceStats.spotifyMonthlyListeners,
      ),
      spotifyFollowers: numericOrFallback(cache.stats.spotifyFollowers, fallbackAudienceStats.spotifyFollowers),
      instagramFollowers: Math.max(
        numericOrFallback(cache.stats.instagramFollowers, fallbackAudienceStats.instagramFollowers),
        fallbackAudienceStats.instagramFollowers,
      ),
      soundCloudFollowers: numericOrFallback(cache.stats.soundCloudFollowers, fallbackAudienceStats.soundCloudFollowers),
    },
    updatedAt: cache.updatedAt,
    expiresAt: typeof cache.expiresAt === 'number' ? cache.expiresAt : getAudienceStatsExpiresAt(cache.updatedAt),
  }
}

function numericOrFallback(value, fallback) {
  return Number.isFinite(value) ? value : fallback
}

function formatPdfFilename(updatedAt) {
  const date = new Date(updatedAt)
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')

  return `habeeb-epk-${year}-${month}-${day}.pdf`
}

function handleCors(request, response) {
  response.set('Access-Control-Allow-Origin', '*')
  response.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  response.set('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    response.status(204).send('')
    return false
  }

  if (request.method !== 'GET') {
    response.status(405).json({ error: 'Method not allowed.' })
    return false
  }

  return true
}

function generateHabeebPdf(cache) {
  const pdf = new jsPDF({
    compress: true,
    format: 'letter',
    orientation: 'portrait',
    unit: 'pt',
  })
  const coverImage = readImageData('booth.jpg')
  const bioImage = readImageData('street-portrait.jpg')
  const soundImage = readImageData('stage.jpg')

  drawCoverPage(pdf, coverImage)
  pdf.addPage('letter', 'portrait')
  drawBioPage(pdf, bioImage)
  pdf.addPage('letter', 'portrait')
  drawSoundPage(pdf, soundImage, cache)

  return pdf
}

function readImageData(filename) {
  const image = readFileSync(resolve(assetsDir, filename)).toString('base64')
  return `data:image/jpeg;base64,${image}`
}

function drawCoverPage(pdf, backgroundImage) {
  drawImage(pdf, backgroundImage, 0, 0, 612, 792)
  drawTint(pdf)
  drawBrand(pdf)

  pdf.setTextColor(199, 255, 92)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.text('E L E C T R O N I C  P R E S S  K I T', 45, 569)

  pdf.setTextColor(245, 241, 232)
  pdf.setFontSize(82)
  pdf.text('HABEEB', 45, 648)

  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(17)
  pdf.setTextColor(230, 226, 217)
  const lead = 'Independent electronic artist and DJ from Dallas, Texas building emotional club records across Tech House, UK Speed Garage, Bassline, and melodic dance music.'
  pdf.text(pdf.splitTextToSize(lead, 505), 45, 695, { lineHeightFactor: 1.35 })

  drawFooter(pdf, 'HABEEB EPK', 'NIGHT METHOD AGENCY')
}

function drawBioPage(pdf, bioImage) {
  pdf.setFillColor(16, 16, 14)
  pdf.rect(0, 0, 612, 792, 'F')
  drawImage(pdf, bioImage, 45, 45, 155, 634)

  pdf.setTextColor(199, 255, 92)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.text('B I O G R A P H Y', 226, 175)

  pdf.setTextColor(214, 210, 202)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  let y = 212
  for (const paragraph of bio) {
    const lines = pdf.splitTextToSize(paragraph, 320)
    pdf.text(lines, 226, y, { lineHeightFactor: 1.4 })
    y += lines.length * 15.5 + 12
  }

  drawFooter(pdf, 'HABEEB EPK', '02')
}

function drawSoundPage(pdf, backgroundImage, cache) {
  drawImage(pdf, backgroundImage, 0, 0, 612, 792)
  drawTint(pdf)

  pdf.setTextColor(199, 255, 92)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(10)
  pdf.text('S O U N D', 45, 50)

  pdf.setTextColor(245, 241, 232)
  pdf.setFontSize(42)
  pdf.text(['BASS PRESSURE.', 'EMOTIONAL RELEASE.'], 45, 98, { lineHeightFactor: 0.95 })

  const soundBoxes = [
    { text: 'HEAVY BASSLINES WITH EMOTIONAL VOCALS', y: 150 },
    { text: 'FAST CLUB RHYTHMS WITH NOSTALGIC MELODY', y: 254 },
    { text: 'TECH HOUSE, UK SPEED GARAGE, BASSLINE, AND MELODIC CLUB RECORDS', y: 358 },
  ]
  const soundBoxPadding = 18
  for (const box of soundBoxes) {
    drawDarkPanel(pdf, 45, box.y, 268, 96)
    pdf.setTextColor(245, 241, 232)
    pdf.setFontSize(12)
    pdf.text(
      pdf.splitTextToSize(box.text, 268 - soundBoxPadding * 2),
      45 + soundBoxPadding,
      box.y + soundBoxPadding + 12,
      { lineHeightFactor: 1.35 },
    )
  }

  const stats = audienceStatItems(cache.stats)
  stats.forEach((stat, index) => {
    const y = 150 + index * 70
    drawDarkPanel(pdf, 340, y, 227, 60)
    pdf.setTextColor(199, 255, 92)
    pdf.setFontSize(28)
    pdf.text(stat.value, 354, y + 32)
    pdf.setTextColor(188, 183, 178)
    pdf.setFontSize(10)
    pdf.text(stat.label.toUpperCase(), 354, y + 50)
  })

  pdf.setTextColor(160, 150, 153)
  pdf.setFontSize(8)
  pdf.text(`PUBLIC PROFILE DATA REFRESHED ${formatAudienceTimestamp(cache.updatedAt).toUpperCase()}.`, 340, 445)

  links.forEach((link, index) => {
    const y = 492 + index * 37
    drawDarkPanel(pdf, 45, y, 522, 33)
    pdf.setTextColor(199, 255, 92)
    pdf.setFontSize(8)
    pdf.text(link.label.toUpperCase(), 55, y + 13)
    pdf.setTextColor(245, 241, 232)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(7)
    pdf.text(link.href, 55, y + 24)
    pdf.setFont('helvetica', 'bold')
  })

  drawDarkPanel(pdf, 45, 672, 522, 78)
  pdf.setTextColor(245, 241, 232)
  pdf.setFontSize(16)
  pdf.text('BOOKINGS, PRESS, AND MANAGEMENT INQUIRIES.', 60, 700)
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(11)
  pdf.setTextColor(214, 210, 202)
  const contact = 'This EPK was prepared by Night Method Agency for Habeeb. For routing, press materials, performance context, or direct artist inquiries, contact bookings@nightmethodagency.com.'
  pdf.text(pdf.splitTextToSize(contact, 480), 60, 725, { lineHeightFactor: 1.35 })

  drawFooter(pdf, 'bookings@nightmethodagency.com', '03')
}

function drawBrand(pdf) {
  pdf.setFillColor(199, 255, 92)
  pdf.circle(52, 45, 13, 'F')
  pdf.setTextColor(17, 16, 14)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(9)
  pdf.text('N', 48.5, 49)
  pdf.setTextColor(245, 241, 232)
  pdf.setFontSize(10)
  pdf.text('N I G H T  M E T H O D', 76, 48)
}

function drawFooter(pdf, left, right) {
  pdf.setTextColor(139, 132, 130)
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(8)
  pdf.text(left, 45, 763)
  pdf.text(right, 567, 763, { align: 'right' })
}

function drawTint(pdf) {
  pdf.saveGraphicsState()
  pdf.setGState(new GState({ opacity: 0.72 }))
  pdf.setFillColor(11, 8, 8)
  pdf.rect(0, 0, 612, 792, 'F')
  pdf.restoreGraphicsState()
}

function drawDarkPanel(pdf, x, y, width, height) {
  pdf.setFillColor(5, 5, 4)
  pdf.setDrawColor(82, 73, 73)
  pdf.rect(x, y, width, height, 'FD')
}

function drawImage(pdf, imageData, x, y, width, height) {
  pdf.addImage(imageData, 'JPEG', x, y, width, height, undefined, 'FAST')
}
