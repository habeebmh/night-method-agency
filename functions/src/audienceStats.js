export const audienceStatsCacheKey = 'habeeb-audience-stats-v2'
export const audienceStatsCacheTtl = 24 * 60 * 60 * 1000
export const audienceStatsTimeZone = 'America/Chicago'

export const fallbackAudienceStats = {
  spotifyMonthlyListeners: 17619,
  spotifyFollowers: 907,
  instagramFollowers: 1547,
  soundCloudFollowers: 1898,
}

export const audienceStatItems = (stats) => [
  {
    value: formatAudienceNumber(stats.spotifyMonthlyListeners),
    label: 'Spotify monthly listeners',
  },
  {
    value: formatAudienceNumber(stats.spotifyFollowers),
    label: 'Spotify followers',
  },
  {
    value: formatAudienceNumber(stats.instagramFollowers),
    label: 'Instagram followers',
  },
  {
    value: formatAudienceNumber(stats.soundCloudFollowers),
    label: 'SoundCloud followers',
  },
]

export async function refreshAudienceStats(seedStats) {
  const [spotifyStats, instagramFollowers, soundCloudFollowers] = await Promise.all([
    fetchSpotifyStats(),
    fetchInstagramFollowers(),
    fetchSoundCloudFollowers(),
  ])

  const updatedAt = Date.now()

  return {
    stats: {
      spotifyMonthlyListeners: spotifyStats?.monthlyListeners ?? seedStats.spotifyMonthlyListeners,
      spotifyFollowers: spotifyStats?.followers ?? seedStats.spotifyFollowers,
      instagramFollowers: maxAudienceNumber(instagramFollowers, seedStats.instagramFollowers),
      soundCloudFollowers: soundCloudFollowers ?? seedStats.soundCloudFollowers,
    },
    updatedAt,
    expiresAt: getAudienceStatsExpiresAt(updatedAt),
  }
}

export function isAudienceStatsStale(updatedAt, expiresAt) {
  if (typeof expiresAt === 'number') {
    return Date.now() >= expiresAt
  }

  return Date.now() - updatedAt > audienceStatsCacheTtl
}

export function getAudienceStatsExpiresAt(now = Date.now()) {
  const centralParts = getTimeZoneParts(now)
  const targetDate =
    centralParts.hour >= 12
      ? addUtcDays(centralParts.year, centralParts.month, centralParts.day, 1)
      : {
          year: centralParts.year,
          month: centralParts.month,
          day: centralParts.day,
        }

  return findCentralNoonUtc(targetDate.year, targetDate.month, targetDate.day)
}

export function formatAudienceNumber(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatAudienceTimestamp(updatedAt) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(updatedAt))
}

async function fetchSpotifyStats() {
  const spotifyUrl = 'https://open.spotify.com/artist/6N3UeEjvxjQJBiky7YD2IF'
  const htmlCandidates = await fetchTextCandidates([
    {
      url: spotifyUrl,
      options: {
        headers: {
          'user-agent': 'Mozilla/5.0',
        },
      },
    },
    proxyUrl(spotifyUrl),
    jinaUrl(spotifyUrl),
  ])

  if (htmlCandidates.length === 0) {
    return null
  }

  const html = htmlCandidates.join('\n')
  const statsMatch = html.match(/"stats":\{"followers":(\d+),"monthlyListeners":(\d+)\}/)
  const followers =
    parseAudienceNumber(statsMatch?.[1]) ??
    parseBestAudienceNumber(
      [...html.matchAll(/>([\d,.]+[KkMm]?)<\/p><p[^>]*>\s*Followers\s*<\/p>/gi)].map((match) => match[1]),
    )
  const monthlyListeners =
    parseAudienceNumber(statsMatch?.[2]) ??
    parseBestAudienceNumber([...html.matchAll(/([\d,.]+[KkMm]?) monthly listeners/g)].map((match) => match[1]))

  return {
    followers,
    monthlyListeners,
  }
}

async function fetchInstagramFollowers() {
  const profileResponse = await fetch('https://www.instagram.com/habeeeeeeeeeeeeeeeb/', {
    headers: {
      'user-agent': 'Mozilla/5.0',
    },
  }).catch(() => null)
  const profileHtml = profileResponse?.ok ? await profileResponse.text().catch(() => null) : null
  const profileFollowers =
    parseAudienceNumber(
      decodeHtmlEntities(profileHtml?.match(/content="([\d,.]+[KkMm]?) Followers,/i)?.[1]),
    ) ??
    parseAudienceNumber(
      decodeHtmlEntities(profileHtml?.match(/<meta[^>]+name="description"[^>]+content="([\d,.]+[KkMm]?) Followers,/i)?.[1]),
    )

  if (Number.isFinite(profileFollowers)) {
    return profileFollowers
  }

  const response = await fetch(
    'https://www.instagram.com/api/v1/users/web_profile_info/?username=habeeeeeeeeeeeeeeeb',
    {
      headers: {
        referer: 'https://www.instagram.com/habeeeeeeeeeeeeeeeb/',
        'user-agent': 'Mozilla/5.0',
        'x-asbd-id': '129477',
        'x-ig-app-id': '936619743392459',
      },
    },
  ).catch(() => null)

  if (!response?.ok) {
    return null
  }

  const payload = await response.json().catch(() => null)
  return payload?.data?.user?.edge_followed_by?.count ?? null
}

async function fetchSoundCloudFollowers() {
  const htmlCandidates = await fetchTextCandidates([
    proxyUrl('https://m.soundcloud.com/habeeeeeeeeeeeeeeeb'),
    jinaUrl('https://m.soundcloud.com/habeeeeeeeeeeeeeeeb'),
  ])

  if (htmlCandidates.length === 0) {
    return null
  }

  const html = htmlCandidates.join('\n')
  return (
    parseAudienceNumber(html.match(/soundcloud:follower_count" content="(\d+)"/)?.[1]) ??
    parseAudienceNumber(html.match(/"name":"soundcloud:follower_count","content":"(\d+)"/)?.[1]) ??
    parseBestAudienceNumber([...html.matchAll(/([\d,.]+[KkMm]?)\s+followers/gi)].map((match) => match[1])) ??
    null
  )
}

async function fetchTextCandidates(urls) {
  const candidates = await Promise.all(
    urls.map(async (entry) => {
      const url = typeof entry === 'string' ? entry : entry.url
      const options = typeof entry === 'string' ? undefined : entry.options
      const response = await fetch(url, options).catch(() => null)

      if (response?.ok) {
        const text = await response.text().catch(() => null)
        if (text) {
          return text
        }
      }

      return null
    }),
  )

  return candidates.filter(Boolean)
}

function proxyUrl(url) {
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
}

function jinaUrl(url) {
  return `https://r.jina.ai/http://${url}`
}

function parseAudienceNumber(value) {
  if (!value) {
    return undefined
  }

  const trimmed = value.trim().replace(/,/g, '')
  const multiplier = trimmed.toLowerCase().endsWith('k')
    ? 1000
    : trimmed.toLowerCase().endsWith('m')
      ? 1000000
      : 1
  const numeric = Number.parseFloat(trimmed.replace(/[km]/i, ''))

  if (!Number.isFinite(numeric)) {
    return undefined
  }

  return Math.round(numeric * multiplier)
}

function parseBestAudienceNumber(values) {
  const parsed = values
    .map((value) => ({
      parsed: parseAudienceNumber(value),
      isRounded: /[km]$/i.test(value.trim()),
    }))
    .filter((value) => Number.isFinite(value.parsed))
    .sort((a, b) => Number(a.isRounded) - Number(b.isRounded))

  return parsed[0]?.parsed
}

function maxAudienceNumber(value, fallback) {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.max(value, fallback)
}

function decodeHtmlEntities(value) {
  if (!value) {
    return value
  }

  return value
    .replace(/&amp;/g, '&')
    .replace(/&#x2F;/g, '/')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
}

function getTimeZoneParts(timestamp) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: audienceStatsTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    hour12: false,
  }).formatToParts(new Date(timestamp))
  const value = (type) => Number(parts.find((part) => part.type === type)?.value)

  return {
    year: value('year'),
    month: value('month'),
    day: value('day'),
    hour: value('hour'),
  }
}

function addUtcDays(year, month, day, days) {
  const date = new Date(Date.UTC(year, month - 1, day + days))

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

function findCentralNoonUtc(year, month, day) {
  for (let hour = 16; hour <= 19; hour += 1) {
    const candidate = Date.UTC(year, month - 1, day, hour)
    const parts = getTimeZoneParts(candidate)

    if (parts.year === year && parts.month === month && parts.day === day && parts.hour === 12) {
      return candidate
    }
  }

  return Date.now() + audienceStatsCacheTtl
}
