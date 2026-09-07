import {
  audienceStatsCacheKey,
  fallbackAudienceStats,
  type AudienceStats,
  type CachedAudienceStats,
} from '../audienceStats.js'
import { audienceStatsApiHref } from '../config'

let audienceStatsPromise: Promise<CachedAudienceStats> | null = null

export function getAudienceStatsSnapshot(): CachedAudienceStats {
  const cached = readAudienceStatsCache()

  if (cached) {
    return cached
  }

  if (!audienceStatsPromise) {
    audienceStatsPromise = refreshAndCacheAudienceStats(fallbackAudienceStats)
  }

  throw audienceStatsPromise
}

export async function refreshAndCacheAudienceStats(seedStats: AudienceStats): Promise<CachedAudienceStats> {
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
