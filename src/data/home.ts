import {
  BadgeCheck,
  CalendarDays,
  Disc3,
  Megaphone,
  type LucideIcon,
} from 'lucide-react'

export const imagePanels = [
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
] as const

export type ImagePanel = (typeof imagePanels)[number]

export const services: Array<{
  icon: LucideIcon
  label: string
  text: string
}> = [
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

export const rosterTags = ['Private bookings', 'Label-side projects', 'Brand rooms']
