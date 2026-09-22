import { mkdir, rename, rm, stat } from 'node:fs/promises'
import path from 'node:path'

export function validatePacket(packet, history, runDate) {
  if (packet.date !== runDate) throw new Error('Packet must use the current America/Chicago run date.')
  if (!Array.isArray(history.deliveries) || !Array.isArray(history.sentFestivalIds)) {
    throw new Error('A valid delivery and user-confirmed sent ledger is required.')
  }
  if (history.deliveries.some(delivery => delivery.date === runDate)) {
    throw new Error('A packet was already delivered for this run date. Verify the existing email; do not resend.')
  }
  if (!Array.isArray(packet.research) || packet.research.length === 0) throw new Error('Current research record is required.')
  if (!Array.isArray(packet.entries) || packet.entries.length === 0) throw new Error('At least one send-ready festival entry is required.')
  const previous = new Map(history.deliveries.flatMap(d => d.entries).map(e => [e.id, e]))
  const ids = new Set()
  const entries = packet.entries.map(entry => {
    for (const field of ['id', 'festival', 'location', 'contact', 'email', 'subject', 'body', 'priority', 'action', 'fit']) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) throw new Error(`Missing ${field} for ${entry.id || 'entry'}.`)
    }
    if (ids.has(entry.id)) throw new Error(`Duplicate target: ${entry.id}`)
    ids.add(entry.id)
    if (history.sentFestivalIds.includes(entry.id)) throw new Error(`Festival outreach already sent: ${entry.id}`)
    if (!packet.research.some(r => r.id === entry.id && r.outcome === 'qualified' && r.reason && r.urls?.length)) {
      throw new Error(`Qualified research record missing for ${entry.id}.`)
    }
    for (const type of ['edition', 'applications', 'contact', 'programming']) {
      const evidence = entry.evidence?.[type]
      if (evidence?.checkedAt !== runDate || !evidence.finding?.trim() || !evidence.urls?.length ||
          evidence.urls.some(url => !/^https:\/\//.test(url))) {
        throw new Error(`Current-run evidence required: ${entry.id} / ${type}`)
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entry.email)) throw new Error(`Invalid email for ${entry.id}.`)
    const plain = entry.body.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    const words = plain.trim().split(/\s+/).length
    if (words < 120 || words > 180) throw new Error(`${entry.id}: email must be 120-180 words; found ${words}.`)
    const links = entry.body.match(/https?:\/\/[^)\s]+/g) || []
    if (links.length !== 1 || links[0] !== 'https://nightmethodagency.com/habeeb') throw new Error(`${entry.id}: only the EPK link is allowed.`)
    if (/Silo Dallas|genre-fluid/i.test(entry.body)) throw new Error(`${entry.id}: prohibited positioning.`)
    const old = previous.get(entry.id)
    // A changed label at the same inbox is not a new professional route.
    const contactChanged = old && old.email.toLowerCase() !== entry.email.toLowerCase()
    if (contactChanged && !entry.contactChange?.trim()) throw new Error(`${entry.id}: contact change explanation required.`)
    return { ...entry, change: !old ? 'NEW' : contactChanged ? 'CONTACT UPDATED' : 'RETAINED' }
  })
  if (entries.every(entry => entry.change === 'RETAINED')) {
    throw new Error('No new opportunity or verified contact change. Save research; do not regenerate or email a repeat-only packet.')
  }
  return { ...packet, entries }
}

export async function writeValidatedPdfAtomically({ entries, outputPath, render }) {
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error('The packet must contain at least one send-ready festival entry.')
  }

  await mkdir(path.dirname(outputPath), { recursive: true })
  const tempPath = `${outputPath}.${process.pid}.tmp`

  try {
    await render(tempPath)
    const rendered = await stat(tempPath)
    if (rendered.size === 0) throw new Error('The rendered PDF is empty.')
    await rename(tempPath, outputPath)
  } catch (error) {
    await rm(tempPath, { force: true })
    throw error
  }
}
