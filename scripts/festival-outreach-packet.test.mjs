import assert from 'node:assert/strict'
import test from 'node:test'
import * as packetModule from './festival-outreach-output.mjs'

const date = '2026-09-22'
const evidence = Object.fromEntries(['edition', 'applications', 'contact', 'programming'].map(key => [key, {
  checkedAt: date, finding: `Verified ${key}`, urls: ['https://festival.example/evidence'],
}]))
function fixture() {
  return {
    date, research: [{ id: 'new-2027', outcome: 'qualified', reason: 'All checks passed', urls: ['https://festival.example'] }],
    entries: [{ id: 'new-2027', festival: 'New Festival 2027', location: 'City | 2027', contact: 'Music team',
      email: 'music@festival.example', subject: 'Habeeb for 2027', priority: '1', action: 'Send booking request this week.',
      fit: 'House stage fit', evidence, body: `${'Specific outreach sentence. '.repeat(42)}[Habeeb EPK](https://nightmethodagency.com/habeeb)` }],
  }
}
const history = { deliveries: [{ date: '2026-09-21', entries: [{ id: 'new-2027', contact: 'Music team', email: 'music@festival.example' }] }], sentFestivalIds: [] }
function validate(packet, ledger = history) {
  assert.equal(typeof packetModule.validatePacket, 'function', 'packet eligibility validator must exist')
  return packetModule.validatePacket(packet, ledger, date)
}
test('a date or copy change cannot make previously delivered leads new', () => {
  assert.throws(() => validate(fixture()), /no new opportunity or verified contact change/i)
})
test('a genuinely new edition is allowed and classified from delivery history', () => {
  const packet = fixture(); packet.entries[0].id = 'new-2028'
  packet.research[0].id = 'new-2028'
  assert.equal(validate(packet).entries[0].change, 'NEW')
})
test('retained targets remain when a new qualified target is added', () => {
  const packet = fixture(); packet.entries.push({ ...packet.entries[0], id: 'other-2027' })
  packet.research.push({ ...packet.research[0], id: 'other-2027' })
  assert.deepEqual(validate(packet).entries.map(e => e.change), ['RETAINED', 'NEW'])
})
test('new contact routes need an explicit explanation and current evidence', () => {
  const packet = fixture(); packet.entries[0].email = 'booking@festival.example'
  assert.throws(() => validate(packet), /contact change explanation/i)
  packet.entries[0].contactChange = 'Official team page now publishes a dedicated talent inbox.'
  assert.equal(validate(packet).entries[0].change, 'CONTACT UPDATED')
})
test('stale evidence is rejected', () => {
  const packet = structuredClone(fixture()); packet.entries[0].evidence.contact.checkedAt = '2026-09-21'
  assert.throws(() => validate(packet, { deliveries: [], sentFestivalIds: [] }), /current-run evidence/i)
})
test('user-confirmed sent editions cannot reappear', () => {
  assert.throws(() => validate(fixture(), { deliveries: [], sentFestivalIds: ['new-2027'] }), /already sent/i)
})
test('duplicate target IDs cannot inflate the packet', () => {
  const packet = fixture(); packet.entries.push(packet.entries[0])
  assert.throws(() => validate(packet, { deliveries: [], sentFestivalIds: [] }), /duplicate/i)
})
test('a stale packet date cannot be regenerated as current', () => {
  const packet = fixture(); packet.date = '2026-09-21'
  assert.throws(() => validate(packet), /run date/i)
})
test('missing research evidence is rejected', () => {
  const packet = fixture(); packet.research = []
  assert.throws(() => validate(packet), /research record/i)
})
test('contact title rewording cannot manufacture novelty even with an explanation', () => {
  const packet = fixture(); packet.entries[0].contact = 'The music programming team'
  packet.entries[0].contactChange = 'Reformatted title, same recipient.'
  assert.throws(() => validate(packet), /no new opportunity/i)
})
test('a recorded same-day delivery cannot be sent again', () => {
  const ledger = { deliveries: [{ date, entries: [] }], sentFestivalIds: [] }
  assert.throws(() => validate(fixture(), ledger), /already delivered/i)
})
