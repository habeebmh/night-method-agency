import { Suspense, useEffect, useState, type CSSProperties, type MouseEvent } from 'react'
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Camera,
  Disc3,
  Download,
  ExternalLink,
  Images,
  Mail,
  Megaphone,
  Music2,
  Play,
  RadioTower,
  Sparkles,
  Volume2,
} from 'lucide-react'
import { clsx } from 'clsx'
import {
  audienceStatItems,
  audienceStatsCacheKey,
  fallbackAudienceStats,
  formatAudienceTimestamp,
  isAudienceStatsStale,
  type AudienceStats,
  type CachedAudienceStats,
} from './audienceStats.js'

const domain = 'nightmethodagency.com'
const email = `bookings@${domain}`
const habeebEmail = email
const habeebPdfHref = '/api/habeeb/epk-pdf'
const habeebFallbackPdfHref = '/habeeb-epk-build.pdf'
const audienceStatsApiHref = '/api/habeeb/audience-stats'

const habeebLinks = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/habeeeeeeeeeeeeeeeb/',
    icon: Camera,
  },
  {
    label: 'SoundCloud',
    href: 'https://soundcloud.com/habeeeeeeeeeeeeeeeb',
    icon: Volume2,
  },
  {
    label: 'Spotify',
    href: 'https://open.spotify.com/artist/6N3UeEjvxjQJBiky7YD2IF?si=pMSf1ELpQbOuu5G1CAbK8A',
    icon: Music2,
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@habeeeeeeeeeeeeeeb',
    icon: Play,
  },
  {
    label: 'Media Photos',
    href: 'https://www.dropbox.com/scl/fo/w9zi2bpj6bmju437i6o9f/ABbZlK82duliRSiwDjpLbpU?rlkey=1xtwl2anlcdf1xr5rtsztf0nd&dl=0',
    icon: Images,
  },
]

const habeebHighlights = [
  'Dallas, Texas',
  'Electronic artist and DJ',
  'Tech House / UK Speed Garage / Bassline',
  'Breakaway Dallas 2026',
]

const habeebSounds = [
  'Heavy basslines with emotional vocals',
  'Fast club rhythms with nostalgic melody',
  'Tech House, UK Speed Garage, Bassline, and melodic club records',
]

const habeebBio = [
  'Habeeb is an independent electronic artist and DJ from Dallas, Texas whose music lives somewhere between underground club culture and emotional storytelling. While he originally gained traction through Tech House remixes and edits that spread across DJ communities online, his sound has gradually evolved into something less focused on fitting neatly into one genre and more focused on creating a feeling.',
  'A lot of Habeeb’s music is built around contrast. Heavy basslines paired with emotional vocals. Fast club rhythms mixed with nostalgic melodies. High energy records that still feel personal underneath the surface. Whether he’s making Tech House, UK Speed Garage, Bassline, or more melodic club records, the goal stays the same: create music that pulls people out of their head for a few minutes and makes them feel something real.',
  'Before releasing original music, Habeeb built an audience online through edits and remixes that earned thousands of downloads and support from DJs who connected with the balance of familiarity and club energy in his productions. Over time, that evolved into original releases that expanded beyond the style he initially became known for.',
  'As a DJ, Habeeb has performed throughout Dallas clubs and events while continuing to grow his audience as an independent artist, including a performance at Breakaway Dallas 2026. His sets are known for blending genres fluidly while maintaining a consistent emotional and energetic atmosphere from start to finish.',
  'At the center of everything Habeeb creates is a simple idea: dance music should feel human. Not just loud or trendy or functional for a playlist, but something immersive that people remember after the night ends.',
]

const imagePanels = [
  {
    src: '/images/stage.webp',
    alt: 'Wide club room with crowd and blue lights',
    eyebrow: 'Artist management',
    title: 'Build the run, protect the signal.',
    copy: 'Night Method is a boutique management office for artists, producers, and culture-facing projects moving between clubs, campaigns, and long-format career work.',
    meta: ['Strategy', 'Shows', 'Partnerships'],
  },
  {
    src: '/images/city-portrait.webp',
    alt: 'FO room and crowd seen from the booth',
    eyebrow: 'Development',
    title: 'A small room for serious momentum.',
    copy: 'We shape release plans, identity systems, collaborators, and decision rhythm around the artist first. The work is practical, quiet, and built to travel.',
    meta: ['A&R', 'Creative direction', 'Release planning'],
  },
  {
    src: '/images/street-portrait.webp',
    alt: 'NY Vice crowd seen from behind a booth',
    eyebrow: 'Live',
    title: 'From first hold to final advance.',
    copy: 'Booking strategy, touring support, festival positioning, private-event handling, and venue relationships are coordinated with the right partners when the timing is right.',
    meta: ['Touring', 'Festivals', 'Special projects'],
  },
]

const services = [
  {
    icon: BadgeCheck,
    label: 'Management',
    text: 'Day-to-day coordination, priorities, deal flow, scheduling, and the steady operational layer behind a public-facing career.',
  },
  {
    icon: Disc3,
    label: 'Artist development',
    text: 'Sound, story, visuals, collaborators, audience patterns, and the decisions that turn loose attention into a durable project.',
  },
  {
    icon: Megaphone,
    label: 'Campaigns',
    text: 'Release strategy, digital PR, creator relationships, brand language, content pacing, and clean rollout documents for teams.',
  },
  {
    icon: CalendarDays,
    label: 'Live strategy',
    text: 'Routing, holds, buyer communication, support slots, festival windows, private bookings, and post-show follow-through.',
  },
]

function openHabeebPdf(
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

function App() {
  useScrollReveals()

  if (window.location.pathname === '/habeeb') {
    return <HabeebEpk />
  }

  return (
    <main className="site-shell min-h-screen bg-[#0a0908] text-[#f5f1e8]">
      <Header />
      <section className="relative min-h-[100svh] overflow-hidden" data-reveal-root>
        <img
          className="absolute inset-0 h-full w-full object-cover"
          data-image-motion
          src="/images/stage.webp"
          alt="Wide club room with crowd and blue lights"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,6,5,.92),rgba(7,6,5,.58)_42%,rgba(7,6,5,.2)),linear-gradient(0deg,rgba(7,6,5,.92),rgba(7,6,5,0)_36%)]" />
        <div className="absolute left-5 top-24 z-10 hidden h-[45svh] w-px origin-top bg-[#c7ff5c]/60 sm:block lg:left-12" data-line-reveal />
        <div className="absolute right-5 top-24 z-10 hidden max-w-[18rem] border border-[#f5f1e8]/18 bg-[#050504]/60 p-4 text-xs font-bold uppercase leading-5 tracking-[0.18em] text-[#f5f1e8]/70 backdrop-blur-md lg:block" data-reveal style={{ '--reveal-delay': '180ms' } as CSSProperties}>
          No public roster. No inflated deck. Just the work between the room
          and the record.
        </div>
        <div className="relative z-10 flex min-h-[100svh] items-end px-5 pb-14 pt-28 sm:px-8 lg:px-12">
          <div className="flex w-full flex-col gap-8">
            <div className="max-w-7xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.38em] text-[#c7ff5c]" data-reveal>
                Night Method
              </p>
              <h1 className="text-balance text-[clamp(3.2rem,9vw,8.6rem)] font-black uppercase leading-[.84] tracking-normal" data-reveal style={{ '--reveal-delay': '90ms' } as CSSProperties}>
                Artist management after dark.
              </h1>
            </div>
            <div className="mb-2 max-w-2xl border-l border-[#f5f1e8]/25 pl-5 lg:ml-auto" data-reveal style={{ '--reveal-delay': '220ms' } as CSSProperties}>
              <p className="text-lg leading-7 text-[#f5f1e8]/82">
                A discreet management and strategy office for select artists,
                producers, and culture projects. Built for release plans, rooms,
                tours, partnerships, and the decisions between them.
              </p>
              <a className="brand-cta mt-6 inline-flex max-w-full min-w-0 items-center gap-2 border border-[#f5f1e8]/30 bg-[#050504] px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] text-[#f5f1e8] transition sm:text-sm sm:tracking-[0.18em]" href={`mailto:${email}`}>
                <Mail className="shrink-0" size={17} />
                <span className="min-w-0 text-left">Contact us</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {imagePanels.slice(1).map((panel, index) => (
        <ImageSegment
          key={panel.title}
          panel={panel}
          number={index + 1}
          reverse={index % 2 === 0}
        />
      ))}

      <section id="services" className="bg-[#f5f1e8] px-5 py-20 text-[#171310] sm:px-8 lg:px-12" data-reveal-root>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-[minmax(0,.95fr)_minmax(0,1.35fr)] xl:gap-16">
          <div data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d94b2b]">
              Services
            </p>
            <h2 className="mt-4 max-w-[34rem] text-[clamp(1.85rem,3.35vw,3rem)] font-black uppercase leading-[.94] tracking-normal">
              <span className="block">Quiet</span>
              <span className="block">Infrastructure</span>
              <span className="block">for visible</span>
              <span className="block">work.</span>
            </h2>
            <div className="mt-10 grid grid-cols-3 border-y border-[#171310]/20 py-4 text-center text-[10px] font-black uppercase tracking-[0.14em] text-[#171310]/62">
              <span>Private</span>
              <span>Fast</span>
              <span>Selective</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden border border-[#171310]/15 bg-[#171310]/15 md:grid-cols-2" data-reveal style={{ '--reveal-delay': '120ms' } as CSSProperties}>
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <article className="bg-[#f5f1e8] p-6 sm:p-8" data-reveal style={{ '--reveal-delay': `${180 + index * 70}ms` } as CSSProperties} key={service.label}>
                  <div className="mb-10 flex h-11 w-11 items-center justify-center rounded-full bg-[#171310] text-[#c7ff5c]">
                    <Icon size={21} />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-normal">
                    {service.label}
                  </h3>
                  <p className="mt-4 text-base leading-7 text-[#423a32]">
                    {service.text}
                  </p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="roster" className="grid min-h-[100svh] grid-cols-1 bg-[#10100e] lg:grid-cols-2" data-reveal-root>
        <div className="relative min-h-[62svh] overflow-hidden lg:min-h-[100svh] lg:[clip-path:polygon(0_0,96%_0,86%_100%,0_100%)]">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            data-image-motion
            src="/images/duo.webp"
            alt="Coco event crowd under club lighting"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,16,14,.85),rgba(16,16,14,.1)_50%,rgba(16,16,14,.62))]" />
        </div>
        <div className="flex min-h-[82svh] flex-col justify-between px-5 py-16 sm:px-8 lg:min-h-[100svh] lg:px-12">
          <div data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c7ff5c]">
              Roster
            </p>
            <p className="mt-8 text-[clamp(4rem,18vw,11rem)] font-black uppercase leading-none text-[#f5f1e8]/[0.045] lg:-ml-2">
              Private
            </p>
            <h2 className="mt-4 max-w-xl text-[clamp(2.4rem,11vw,4.5rem)] font-black uppercase leading-[.94] tracking-normal sm:text-7xl">
              Select artists. Limited disclosure.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#f5f1e8]/74">
              We work quietly with developing and established projects across
              electronic, hip-hop, left-pop, and multidisciplinary nightlife.
              Public credits are shared case by case.
            </p>
          </div>
          <div className="mt-16 grid gap-3 sm:grid-cols-3">
            {['Private bookings', 'Label-side projects', 'Brand rooms'].map((item, index) => (
              <div
                className="flex min-h-16 items-center justify-center border border-[#f5f1e8]/15 px-6 text-center text-sm font-bold uppercase tracking-[0.16em] text-[#f5f1e8]/82"
                data-reveal
                style={{ '--reveal-delay': `${160 + index * 80}ms` } as CSSProperties}
                key={item}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="relative min-h-[92svh] overflow-hidden bg-[#0a0908]" data-reveal-root>
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          data-image-motion
          src="/images/booth.webp"
          alt="Sunset Sessions crowd under rooftop signage"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,.95),rgba(10,9,8,.72),rgba(10,9,8,.35)),linear-gradient(0deg,rgba(10,9,8,.94),rgba(10,9,8,0)_48%)]" />
        <div className="relative z-10 flex min-h-[92svh] flex-col justify-between px-5 py-16 sm:px-8 lg:px-12">
          <div className="max-w-5xl" data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d94b2b]">
              Inquiries
            </p>
            <h2 className="mt-5 text-balance text-[clamp(2.35rem,10.5vw,4.5rem)] font-black uppercase leading-[.94] tracking-normal sm:text-7xl lg:text-8xl">
              Send the music, context, and what needs managing.
            </h2>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end" data-reveal style={{ '--reveal-delay': '160ms' } as CSSProperties}>
            <p className="max-w-2xl text-lg leading-8 text-[#f5f1e8]/74">
              Include links, timeline, city, and the practical ask. We read
              everything, reply when there is a fit, and keep details off the
              public site.
            </p>
            <a
              className="brand-cta inline-flex max-w-full min-w-0 items-center gap-3 bg-[#050504] px-5 py-4 text-xs font-black uppercase tracking-[0.1em] text-[#f5f1e8] transition sm:w-fit sm:text-base sm:tracking-[0.18em]"
              href={`mailto:${email}`}
            >
              <span className="min-w-0 text-left">Contact us</span>
              <ArrowUpRight className="shrink-0" size={20} />
            </a>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-[#f5f1e8]/12 bg-[#0a0908] px-5 py-8 text-xs font-bold uppercase tracking-[0.18em] text-[#f5f1e8]/55 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>Night Method Agency</span>
        <span>{domain}</span>
      </footer>
    </main>
  )
}

function HabeebEpk() {
  const [isPdfLoading, setIsPdfLoading] = useState(false)
  const handleHabeebPdfClick = (event: MouseEvent<HTMLAnchorElement>) => {
    openHabeebPdf(event, setIsPdfLoading)
  }

  return (
    <main className="epk-shell min-h-screen bg-[#0a0908] text-[#f5f1e8]">
      <header className="fixed inset-x-0 top-0 z-30 border-b border-[#f5f1e8]/12 bg-[#0a0908]/70 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-12">
        <nav className="flex items-center justify-between gap-4">
          <a className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em]" href="/">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7ff5c] text-[#11100e]">
              <RadioTower size={17} />
            </span>
            Night Method
          </a>
          <a
            className="brand-cta inline-flex min-w-0 items-center gap-2 border border-[#f5f1e8]/30 bg-[#050504] px-4 py-3 text-[11px] font-black uppercase tracking-[0.14em] text-[#f5f1e8] transition"
            href={habeebPdfHref}
            onClick={handleHabeebPdfClick}
            target="_blank"
            rel="noreferrer"
          >
            {isPdfLoading ? <ApiSpinner /> : <Download className="shrink-0" size={16} />}
            <span className="min-w-0">PDF</span>
          </a>
        </nav>
      </header>

      <section className="relative min-h-[100svh] overflow-hidden pt-24" data-reveal-root>
        <img
          className="absolute inset-0 h-full w-full object-cover"
          data-image-motion
          src="/images/booth.webp"
          alt="DJ booth facing a lit crowd"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,6,5,.96),rgba(7,6,5,.7)_44%,rgba(7,6,5,.22)),linear-gradient(0deg,rgba(7,6,5,.94),rgba(7,6,5,0)_42%)]" />
        <div className="relative z-10 flex min-h-[calc(100svh-6rem)] items-center px-5 py-12 sm:px-8 lg:px-12">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,.55fr)] lg:items-end">
            <div>
              <p className="mb-5 text-xs font-bold uppercase tracking-[0.38em] text-[#c7ff5c]" data-reveal>
                Electronic Press Kit
              </p>
              <h1 className="text-[clamp(4.2rem,17vw,13rem)] font-black uppercase leading-[.78] tracking-normal" data-reveal style={{ '--reveal-delay': '90ms' } as CSSProperties}>
                Habeeb
              </h1>
              <p className="mt-7 max-w-3xl text-balance text-xl leading-8 text-[#f5f1e8]/82" data-reveal style={{ '--reveal-delay': '170ms' } as CSSProperties}>
                Independent electronic artist and DJ from Dallas, Texas building emotional club records across Tech House, UK Speed Garage, Bassline, and melodic dance music.
              </p>
            </div>
            <aside className="border border-[#f5f1e8]/18 bg-[#050504]/72 p-5 backdrop-blur-md" data-reveal style={{ '--reveal-delay': '240ms' } as CSSProperties}>
              <div className="grid gap-3">
                {habeebLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <a
                      className="brand-cta inline-flex min-w-0 items-center justify-between gap-3 border border-[#f5f1e8]/22 px-4 py-3 text-xs font-black uppercase tracking-[0.16em] transition"
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      key={link.label}
                    >
                      <span className="inline-flex min-w-0 items-center gap-3">
                        <Icon className="shrink-0" size={17} />
                        <span className="min-w-0">{link.label}</span>
                      </span>
                      <ExternalLink className="shrink-0" size={15} />
                    </a>
                  )
                })}
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1e8] px-5 py-16 text-[#171310] sm:px-8 lg:px-12" data-reveal-root>
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[minmax(0,.8fr)_minmax(0,1.45fr)]">
          <div data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d94b2b]">
              Snapshot
            </p>
            <h2 className="mt-4 text-[clamp(2.2rem,6vw,4.7rem)] font-black uppercase leading-[.88] tracking-normal">
              Club music with a human center.
            </h2>
          </div>
          <div className="grid gap-px overflow-hidden border border-[#171310]/15 bg-[#171310]/15 md:grid-cols-2" data-reveal style={{ '--reveal-delay': '110ms' } as CSSProperties}>
            {habeebHighlights.map((item, index) => (
              <div className="bg-[#f5f1e8] p-6 text-lg font-black uppercase leading-6 tracking-normal" key={item} data-reveal style={{ '--reveal-delay': `${160 + index * 60}ms` } as CSSProperties}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid bg-[#10100e] lg:grid-cols-[.9fr_1.1fr]" data-reveal-root>
        <div className="relative min-h-[58svh] overflow-hidden lg:min-h-[100svh] lg:[clip-path:polygon(0_0,96%_0,86%_100%,0_100%)]">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            data-image-motion
            src="/images/street-portrait.webp"
            alt="Artist portrait in nightlife setting"
          />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(16,16,14,.85),rgba(16,16,14,.16)_52%,rgba(16,16,14,.55))]" />
        </div>
        <div className="px-5 py-16 sm:px-8 lg:px-12">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c7ff5c]" data-reveal>
            Biography
          </p>
          <div className="mt-8 max-w-3xl space-y-6 text-base leading-7 text-[#f5f1e8]/78 sm:text-lg sm:leading-8" data-reveal style={{ '--reveal-delay': '100ms' } as CSSProperties}>
            {habeebBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a0908] px-5 py-16 sm:px-8 lg:px-12" data-reveal-root>
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d94b2b]">
              Sound
            </p>
            <h2 className="mt-4 text-[clamp(2.2rem,6vw,4.7rem)] font-black uppercase leading-[.88] tracking-normal">
              Bass pressure. Emotional release.
            </h2>
            <div className="mt-10 grid gap-3">
              {habeebSounds.map((sound, index) => (
                <div className="border border-[#f5f1e8]/16 p-5 text-sm font-bold uppercase leading-6 tracking-[0.12em] text-[#f5f1e8]/82" data-reveal style={{ '--reveal-delay': `${150 + index * 70}ms` } as CSSProperties} key={sound}>
                  {sound}
                </div>
              ))}
            </div>
          </div>
          <Suspense fallback={<AudienceStatsLoading />}>
            <LiveAudienceStats />
          </Suspense>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0a0908] px-5 py-16 sm:px-8 lg:px-12" data-reveal-root>
        <img
          className="absolute inset-0 h-full w-full object-cover opacity-45"
          data-image-motion
          src="/images/stage.webp"
          alt="Wide club room with crowd and blue lights"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,9,8,.98),rgba(10,9,8,.76),rgba(10,9,8,.46))]" />
        <div className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div data-reveal>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c7ff5c]">
              Contact
            </p>
            <h2 className="mt-4 max-w-5xl text-[clamp(2.4rem,8vw,6rem)] font-black uppercase leading-[.86] tracking-normal">
              Bookings, press, and management inquiries.
            </h2>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#f5f1e8]/76">
              This EPK was prepared by Night Method Agency for Habeeb. For routing, press materials, performance context, or direct artist inquiries, use the links below.
            </p>
          </div>
          <div className="grid min-w-[min(100%,22rem)] gap-3" data-reveal style={{ '--reveal-delay': '150ms' } as CSSProperties}>
            <a className="brand-cta inline-flex min-w-0 items-center justify-between gap-3 bg-[#050504] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] transition" href={`mailto:${habeebEmail}`}>
              <span className="min-w-0">Contact us</span>
              <ArrowUpRight className="shrink-0" size={19} />
            </a>
            <a
              className="brand-cta inline-flex min-w-0 items-center justify-between gap-3 border border-[#f5f1e8]/24 bg-[#050504] px-5 py-4 text-sm font-black uppercase tracking-[0.14em] transition"
              href={habeebPdfHref}
              onClick={handleHabeebPdfClick}
              target="_blank"
              rel="noreferrer"
            >
              <span className="min-w-0">Download PDF</span>
              {isPdfLoading ? <ApiSpinner /> : <Download className="shrink-0" size={19} />}
            </a>
          </div>
        </div>
      </section>

      <footer className="flex flex-col gap-4 border-t border-[#f5f1e8]/12 bg-[#0a0908] px-5 py-8 text-xs font-bold uppercase tracking-[0.18em] text-[#f5f1e8]/55 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
        <span>Habeeb EPK</span>
        <span>Night Method Agency</span>
      </footer>
    </main>
  )
}

function LiveAudienceStats() {
  const initialCache = getAudienceStatsSnapshot()
  const [cache, setCache] = useState<CachedAudienceStats>(initialCache)
  const [isRefreshing, setIsRefreshing] = useState(() =>
    isAudienceStatsStale(initialCache.updatedAt, initialCache.expiresAt),
  )

  useEffect(() => {
    if (!isAudienceStatsStale(cache.updatedAt, cache.expiresAt)) {
      return
    }

    let isMounted = true

    refreshAndCacheAudienceStats(cache.stats)
      .then((freshCache) => {
        if (isMounted) {
          setCache(freshCache)
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsRefreshing(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [cache.updatedAt, cache.expiresAt, cache.stats])

  return (
    <AudienceStatsGrid
      stats={cache.stats}
      status={isRefreshing ? 'Updating...' : `Last updated on ${formatAudienceTimestamp(cache.updatedAt)}`}
      showSpinner={isRefreshing}
    />
  )
}

function AudienceStatsLoading() {
  return (
    <AudienceStatsGrid
      stats={fallbackAudienceStats}
      status="Updating..."
      showSpinner
    />
  )
}

function AudienceStatsGrid({
  stats,
  status,
  showSpinner = false,
}: {
  stats: AudienceStats
  status: string
  showSpinner?: boolean
}) {
  return (
    <div className="grid gap-px overflow-hidden border border-[#f5f1e8]/14 bg-[#f5f1e8]/14 sm:grid-cols-2" data-reveal style={{ '--reveal-delay': '120ms' } as CSSProperties}>
      {audienceStatItems(stats).map((stat) => (
        <article className="bg-[#0a0908] p-7" key={stat.label}>
          <p className="text-[clamp(2.35rem,6vw,4.5rem)] font-black uppercase leading-none text-[#c7ff5c]">
            {stat.value}
          </p>
          <p className="mt-3 text-xs font-black uppercase tracking-[0.18em] text-[#f5f1e8]/62">
            {stat.label}
          </p>
        </article>
      ))}
      <div className="flex items-center gap-3 bg-[#0a0908] p-7 sm:col-span-2">
        {showSpinner && <ApiSpinner />}
        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#f5f1e8]/48">
          {status}
        </p>
      </div>
    </div>
  )
}

function ApiSpinner() {
  return (
    <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[#c7ff5c]/25 border-t-[#c7ff5c]" />
  )
}

let audienceStatsPromise: Promise<CachedAudienceStats> | null = null

function getAudienceStatsSnapshot(): CachedAudienceStats {
  const cached = readAudienceStatsCache()

  if (cached) {
    return cached
  }

  if (!audienceStatsPromise) {
    audienceStatsPromise = refreshAndCacheAudienceStats(fallbackAudienceStats)
  }

  throw audienceStatsPromise
}

async function refreshAndCacheAudienceStats(seedStats: AudienceStats): Promise<CachedAudienceStats> {
  const cache = await fetchAudienceStatsCache(seedStats)
  writeAudienceStatsCache(cache)
  return cache
}

async function fetchAudienceStatsCache(seedStats: AudienceStats): Promise<CachedAudienceStats> {
  const response = await fetch(audienceStatsApiHref)
  if (!response.ok) {
    throw new Error('Audience stats API failed.')
  }

  const cache = (await response.json()) as CachedAudienceStats
  if (!cache?.stats || typeof cache.updatedAt !== 'number') {
    throw new Error('Audience stats API returned an invalid cache.')
  }

  return {
    stats: {
      spotifyMonthlyListeners: cache.stats.spotifyMonthlyListeners ?? seedStats.spotifyMonthlyListeners,
      spotifyFollowers: cache.stats.spotifyFollowers ?? seedStats.spotifyFollowers,
      instagramFollowers: cache.stats.instagramFollowers ?? seedStats.instagramFollowers,
      soundCloudFollowers: cache.stats.soundCloudFollowers ?? seedStats.soundCloudFollowers,
    },
    updatedAt: cache.updatedAt,
    expiresAt: cache.expiresAt,
  }
}

function readAudienceStatsCache(): CachedAudienceStats | null {
  try {
    const rawCache = window.localStorage.getItem(audienceStatsCacheKey)
    if (!rawCache) {
      return null
    }

    const cache = JSON.parse(rawCache) as CachedAudienceStats
    if (!cache?.stats || typeof cache.updatedAt !== 'number') {
      return null
    }

    return cache
  } catch {
    return null
  }
}

function writeAudienceStatsCache(cache: CachedAudienceStats) {
  try {
    window.localStorage.setItem(audienceStatsCacheKey, JSON.stringify(cache))
  } catch {
    // Ignore storage failures; the page can still render the fetched values.
  }
}

function useScrollReveals() {
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

type ImageSegmentProps = {
  panel: (typeof imagePanels)[number]
  number: number
  reverse?: boolean
}

function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-[#f5f1e8]/12 bg-[#0a0908]/60 px-5 py-4 backdrop-blur-xl sm:px-8 lg:px-12">
      <nav className="flex items-center justify-between gap-4">
        <a className="flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em]" href="#">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c7ff5c] text-[#11100e]">
            <RadioTower size={17} />
          </span>
          Night Method
        </a>
        <div className="hidden items-center gap-6 text-xs font-bold uppercase tracking-[0.18em] text-[#f5f1e8]/70 sm:flex">
          <a className="transition hover:text-[#c7ff5c]" href="#services">Services</a>
          <a className="transition hover:text-[#c7ff5c]" href="#roster">Roster</a>
          <a className="transition hover:text-[#c7ff5c]" href="#contact">Contact</a>
        </div>
      </nav>
    </header>
  )
}

function ImageSegment({ panel, number, reverse = false }: ImageSegmentProps) {
  return (
    <section className="grid min-h-[100svh] grid-cols-1 bg-[#0a0908] lg:grid-cols-2" data-reveal-root>
      <div
        className={clsx(
          'relative min-h-[62svh] overflow-hidden lg:min-h-[100svh]',
          reverse
            ? 'lg:[clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]'
            : 'lg:[clip-path:polygon(0_0,100%_0,92%_100%,0_100%)]',
          reverse && 'lg:order-2',
        )}
      >
        <img className="absolute inset-0 h-full w-full object-cover" data-image-motion src={panel.src} alt={panel.alt} />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(10,9,8,.82),rgba(10,9,8,.08)_54%,rgba(10,9,8,.45))]" />
      </div>
      <div className="relative flex min-h-[82svh] flex-col justify-between overflow-hidden px-5 py-16 sm:px-8 lg:min-h-[100svh] lg:px-12">
        <span className="absolute right-4 top-8 text-[9rem] font-black leading-none text-[#f5f1e8]/[0.035] sm:text-[13rem] lg:right-8 lg:top-12" data-drift-number>
          0{number}
        </span>
        <div data-reveal style={{ '--reveal-delay': '80ms' } as CSSProperties}>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#c7ff5c]">
            {panel.eyebrow}
          </p>
          <h2 className="mt-5 max-w-2xl text-[clamp(2.35rem,10.5vw,4.5rem)] font-black uppercase leading-[.94] tracking-normal sm:text-7xl">
            {panel.title}
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#f5f1e8]/74">
            {panel.copy}
          </p>
        </div>
        <div className="mt-14 flex flex-wrap gap-3">
          {panel.meta.map((item, index) => (
            <span
              className="inline-flex items-center gap-2 border border-[#f5f1e8]/16 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[#f5f1e8]/78"
              data-reveal
              style={{ '--reveal-delay': `${190 + index * 70}ms` } as CSSProperties}
              key={item}
            >
              <Sparkles size={14} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default App
