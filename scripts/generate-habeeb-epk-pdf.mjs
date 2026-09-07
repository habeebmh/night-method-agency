import { execFileSync } from 'node:child_process'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
  audienceStatItems,
  fallbackAudienceStats,
  isAudienceStatsStale,
  refreshAudienceStats,
} from '../src/audienceStats.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = resolve(root, 'public')
const tmpDir = resolve(root, '.tmp')
const htmlPath = resolve(tmpDir, 'habeeb-epk-pdf.html')
const pdfPath = resolve(outDir, 'habeeb-epk.pdf')
const fallbackPdfPath = resolve(outDir, 'habeeb-epk-build.pdf')
const audienceStatsCachePath = resolve(tmpDir, 'habeeb-audience-stats-cache.json')
const pdfStatsRefreshTimeoutMs = 2500

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const imageUrl = (relativePath) =>
  pathToFileURL(resolve(root, 'public', relativePath)).href

const links = {
  instagram: 'https://www.instagram.com/habeeeeeeeeeeeeeeeb/',
  soundcloud: 'https://soundcloud.com/habeeeeeeeeeeeeeeeb',
  spotify:
    'https://open.spotify.com/artist/6N3UeEjvxjQJBiky7YD2IF?si=pMSf1ELpQbOuu5G1CAbK8A',
  appleMusic: 'https://music.apple.com/pl/artist/habeeb/1807136020',
  youtube: 'https://www.youtube.com/@habeeeeeeeeeeeeeeb',
}

const bio = [
  'Habeeb is an independent electronic artist and DJ from Dallas, Texas whose music lives somewhere between underground club culture and emotional storytelling. While he originally gained traction through Tech House remixes and edits that spread across DJ communities online, his sound has gradually evolved into something less focused on fitting neatly into one genre and more focused on creating a feeling.',
  'A lot of Habeeb\'s music is built around contrast. Heavy basslines paired with emotional vocals. Fast club rhythms mixed with nostalgic melodies. High energy records that still feel personal underneath the surface. Whether he is making Tech House, UK Speed Garage, Bassline, or more melodic club records, the goal stays the same: create music that pulls people out of their head for a few minutes and makes them feel something real.',
  'Before releasing original music, Habeeb built an audience online through edits and remixes that earned thousands of downloads and support from DJs who connected with the balance of familiarity and club energy in his productions. Over time, that evolved into original releases that expanded beyond the style he initially became known for.',
  'As a DJ, Habeeb has performed throughout Dallas clubs and events while continuing to grow his audience as an independent artist, including a performance at Breakaway Dallas 2026. His sets are known for blending genres fluidly while maintaining a consistent emotional and energetic atmosphere from start to finish.',
  'At the center of everything Habeeb creates is a simple idea: dance music should feel human. Not just loud or trendy or functional for a playlist, but something immersive that people remember after the night ends.',
]

const audienceStatsCache = await getPdfAudienceStatsCache()
const audienceStats = audienceStatsCache.stats
const audienceStatsUpdatedLabel = formatAudienceDate(audienceStatsCache.updatedAt)

const html = String.raw`
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Habeeb EPK - Night Method Agency</title>
    <style>
      @page {
        size: letter;
        margin: 0;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        background: #0a0908;
        color: #f5f1e8;
        font-family: Inter, Arial, Helvetica, sans-serif;
        letter-spacing: 0;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      .page {
        position: relative;
        width: 8.5in;
        height: 11in;
        overflow: hidden;
        page-break-after: always;
        background: #0a0908;
      }

      .page:last-child {
        page-break-after: auto;
      }

      .bg {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cover .bg {
        filter: saturate(1.05) contrast(1.04);
      }

      .portrait img {
        filter: grayscale(1);
        object-fit: cover;
        object-position: center;
      }

      .shade {
        position: absolute;
        inset: 0;
      }

      .cover-shade {
        background:
          linear-gradient(90deg, rgba(36, 6, 19, .96), rgba(51, 10, 30, .74) 48%, rgba(67, 15, 42, .34)),
          linear-gradient(0deg, rgba(19, 5, 12, .96), rgba(70, 11, 39, .12) 48%);
      }

      .sound-shade {
        background:
          linear-gradient(90deg, rgba(36, 6, 19, .96), rgba(51, 10, 30, .74) 48%, rgba(67, 15, 42, .34)),
          linear-gradient(0deg, rgba(19, 5, 12, .96), rgba(70, 11, 39, .12) 48%);
      }

      .grid {
        position: absolute;
        inset: 0;
        opacity: .08;
        background-image:
          linear-gradient(rgba(245, 241, 232, .18) 1px, transparent 1px),
          linear-gradient(90deg, rgba(245, 241, 232, .14) 1px, transparent 1px);
        background-size: 44px 44px;
      }

      .brand {
        position: absolute;
        top: .45in;
        left: .55in;
        display: flex;
        align-items: center;
        gap: .16in;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .18em;
        text-transform: uppercase;
      }

      .mark {
        display: grid;
        width: .34in;
        height: .34in;
        place-items: center;
        border-radius: 50%;
        background: #c7ff5c;
        color: #11100e;
      }

      .mark svg {
        width: .2in;
        height: .2in;
        stroke: currentColor;
      }

      .cover-content {
        position: relative;
        z-index: 2;
        display: flex;
        height: 100%;
        flex-direction: column;
        justify-content: flex-end;
        padding: .82in .62in 1.08in;
      }

      .eyebrow {
        color: #c7ff5c;
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .36em;
        text-transform: uppercase;
      }

      h1 {
        margin: .24in 0 0;
        font-size: 1.18in;
        font-weight: 950;
        line-height: .78;
        text-transform: uppercase;
      }

      .lead {
        max-width: 6.7in;
        margin: .32in 0 0;
        color: rgba(245, 241, 232, .84);
        font-size: 17px;
        line-height: 1.45;
      }

      .light {
        background: #f5f1e8;
        color: #171310;
      }

      .dark {
        background: #10100e;
      }

      .content {
        position: relative;
        z-index: 2;
        height: 100%;
        padding: .62in;
      }

      h2 {
        max-width: 6.8in;
        margin: .18in 0 .32in;
        font-size: .56in;
        font-weight: 950;
        line-height: .88;
        text-transform: uppercase;
      }

      .snapshot {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        margin-top: .38in;
        border: 1px solid rgba(23, 19, 16, .16);
        background: rgba(23, 19, 16, .18);
      }

      .snapshot div {
        min-height: .86in;
        background: #f5f1e8;
        padding: .2in;
        font-size: 16px;
        font-weight: 950;
        line-height: 1.14;
        text-transform: uppercase;
      }

      .bio-layout {
        display: grid;
        grid-template-columns: 2.15in 1fr;
        gap: .36in;
        height: 8.8in;
        align-items: stretch;
      }

      .portrait {
        position: relative;
        min-height: 100%;
        overflow: hidden;
      }

      .portrait img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .bio-copy {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .bio-copy p {
        margin: 0 0 .16in;
        color: rgba(245, 241, 232, .8);
        font-size: 13px;
        line-height: 1.48;
      }

      .sound-grid {
        display: grid;
        grid-template-columns: 1.08fr .92fr;
        gap: .32in;
        margin-top: .25in;
      }

      .sound-list {
        display: grid;
        gap: .08in;
      }

      .sound-list div,
      .stat,
      .contact-card {
        border: 1px solid rgba(245, 241, 232, .18);
        background: rgba(5, 5, 4, .72);
        padding: .2in;
      }

      .sound-list div {
        font-size: 12px;
        font-weight: 900;
        line-height: 1.42;
        letter-spacing: .1em;
        text-transform: uppercase;
      }

      .sound-list span {
        display: block;
        max-width: 2.76in;
      }

      .stats {
        display: grid;
        gap: .075in;
      }

      .stat {
        min-height: .74in;
        padding: .15in .2in .13in;
      }

      .stat strong {
        display: block;
        color: #c7ff5c;
        font-size: .3in;
        font-weight: 950;
        line-height: 1;
        text-transform: uppercase;
      }

      .stat span {
        display: block;
        margin-top: .08in;
        color: rgba(245, 241, 232, .68);
        font-size: 10px;
        font-weight: 900;
        letter-spacing: .15em;
        text-transform: uppercase;
      }

      .stats-note {
        margin: 0;
        color: rgba(245, 241, 232, .5);
        font-size: 8.5px;
        font-weight: 900;
        letter-spacing: .13em;
        line-height: 1.4;
        text-transform: uppercase;
      }

      .links {
        display: grid;
        grid-template-columns: 1fr;
        gap: .07in;
        margin-top: .24in;
      }

      .link {
        display: block;
        border: 1px solid rgba(245, 241, 232, .24);
        background: #050504;
        min-height: .42in;
        padding: .1in .14in;
        color: #f5f1e8;
        font-weight: 950;
      }

      .link-name {
        display: block;
        color: #c7ff5c;
        font-size: 9px;
        letter-spacing: .16em;
        text-transform: uppercase;
      }

      .link-url {
        display: block;
        margin-top: .04in;
        color: rgba(245, 241, 232, .82);
        font-size: 8.5px;
        font-weight: 800;
        letter-spacing: 0;
        line-height: 1.25;
        overflow-wrap: normal;
        text-transform: none;
        white-space: nowrap;
      }

      .contact-card {
        margin-top: .28in;
        color: rgba(245, 241, 232, .8);
        font-size: 13px;
        line-height: 1.5;
      }

      .contact-card strong {
        display: block;
        margin-bottom: .08in;
        color: #f5f1e8;
        font-size: 18px;
        font-weight: 950;
        text-transform: uppercase;
      }

      .footer {
        position: absolute;
        right: .62in;
        bottom: .42in;
        left: .62in;
        display: flex;
        justify-content: space-between;
        color: rgba(245, 241, 232, .46);
        font-size: 9px;
        font-weight: 900;
        letter-spacing: .16em;
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <section class="page cover">
      <img class="bg" src="${imageUrl('images/pdf/booth.jpg')}" alt="" />
      <div class="shade cover-shade"></div>
      <div class="grid"></div>
      <div class="brand">
        <span class="mark">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9"></path>
            <path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5"></path>
            <circle cx="12" cy="9" r="2"></circle>
            <path d="M16.2 4.8c2 2 2.26 5.11.8 7.47"></path>
            <path d="M19.1 1.9a9.96 9.96 0 0 1 0 14.1"></path>
            <path d="M9.5 18h5"></path>
            <path d="m8 22 4-11 4 11"></path>
          </svg>
        </span>
        <span>Night Method</span>
      </div>
      <div class="cover-content">
        <div class="eyebrow">Electronic Press Kit</div>
        <h1>Habeeb</h1>
        <p class="lead">Independent electronic artist and DJ from Dallas, Texas building emotional club records across Tech House, UK Speed Garage, Bassline, and melodic dance music.</p>
      </div>
      <div class="footer"><span>Habeeb EPK</span><span>Night Method Agency</span></div>
    </section>

    <section class="page dark">
      <div class="content">
        <div class="bio-layout">
          <div class="portrait">
            <img src="${imageUrl('images/pdf/street-portrait.jpg')}" alt="" />
          </div>
          <div class="bio-copy">
            <div class="eyebrow">Biography</div>
            ${bio.map((paragraph) => `<p>${paragraph}</p>`).join('')}
          </div>
        </div>
      </div>
      <div class="footer"><span>Habeeb EPK</span><span>02</span></div>
    </section>

    <section class="page">
      <img class="bg" src="${imageUrl('images/pdf/stage.jpg')}" alt="" />
      <div class="shade sound-shade"></div>
      <div class="grid"></div>
      <div class="content">
        <div class="eyebrow">Sound</div>
        <h2>Bass pressure. Emotional release.</h2>
        <div class="sound-grid">
          <div class="sound-list">
            <div><span>Heavy basslines with emotional vocals</span></div>
            <div><span>Fast club rhythms with nostalgic melody</span></div>
            <div><span>Tech House, UK Speed Garage, Bassline, and melodic club records</span></div>
          </div>
          <div class="stats">
            ${audienceStatItems(audienceStats)
              .map((stat) => `<div class="stat"><strong>${stat.value}</strong><span>${stat.label}</span></div>`)
              .join('')}
            <p class="stats-note">Public profile data refreshed ${audienceStatsUpdatedLabel}.</p>
          </div>
        </div>
        <div class="links">
          <a class="link" href="${links.instagram}">
            <span class="link-name">Instagram</span>
            <span class="link-url">${links.instagram}</span>
          </a>
          <a class="link" href="${links.soundcloud}">
            <span class="link-name">SoundCloud</span>
            <span class="link-url">${links.soundcloud}</span>
          </a>
          <a class="link" href="${links.spotify}">
            <span class="link-name">Spotify</span>
            <span class="link-url">${links.spotify}</span>
          </a>
          <a class="link" href="${links.appleMusic}">
            <span class="link-name">Apple Music</span>
            <span class="link-url">${links.appleMusic}</span>
          </a>
          <a class="link" href="${links.youtube}">
            <span class="link-name">YouTube</span>
            <span class="link-url">${links.youtube}</span>
          </a>
        </div>
        <div class="contact-card">
          <strong>Bookings, press, and management inquiries.</strong>
          This EPK was prepared by Night Method Agency for Habeeb. For routing, press materials, performance context, or direct artist inquiries, contact bookings@nightmethodagency.com.
        </div>
      </div>
      <div class="footer"><span>bookings@nightmethodagency.com</span><span>03</span></div>
    </section>
  </body>
</html>
`

mkdirSync(outDir, { recursive: true })
mkdirSync(tmpDir, { recursive: true })
writeFileSync(htmlPath, html)

execFileSync(chromePath, [
  '--headless',
  '--disable-gpu',
  '--allow-file-access-from-files',
  '--no-pdf-header-footer',
  `--print-to-pdf=${pdfPath}`,
  pathToFileURL(htmlPath).href,
])

console.log(`Generated ${pdfPath}`)
copyFileSync(pdfPath, fallbackPdfPath)
console.log(`Generated fallback ${fallbackPdfPath}`)

function readAudienceStatsCache() {
  try {
    const cache = JSON.parse(readFileSync(audienceStatsCachePath, 'utf8'))
    if (!cache?.stats || typeof cache.updatedAt !== 'number') {
      return null
    }

    return cache
  } catch {
    return null
  }
}

function writeAudienceStatsCache(cache) {
  writeFileSync(audienceStatsCachePath, JSON.stringify(cache, null, 2))
}

async function refreshAndCacheAudienceStats(seedStats) {
  const cache = await refreshAudienceStats(seedStats)
  writeAudienceStatsCache(cache)
  return cache
}

async function getPdfAudienceStatsCache() {
  const cached = readAudienceStatsCache()
  if (cached && !isAudienceStatsStale(cached.updatedAt, cached.expiresAt)) {
    return cached
  }

  const fallbackCache = cached ?? {
    stats: fallbackAudienceStats,
    updatedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  }

  return Promise.race([
    refreshAndCacheAudienceStats(fallbackCache.stats).catch(() => fallbackCache),
    resolveAfter(pdfStatsRefreshTimeoutMs, fallbackCache),
  ])
}

function resolveAfter(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}

function formatAudienceDate(updatedAt) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(updatedAt))
}
