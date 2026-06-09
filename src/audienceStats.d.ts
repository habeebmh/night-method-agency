export type AudienceStats = {
  spotifyMonthlyListeners: number
  spotifyFollowers: number
  instagramFollowers: number
  soundCloudFollowers: number
}

export type CachedAudienceStats = {
  stats: AudienceStats
  updatedAt: number
  expiresAt?: number
}

export const audienceStatsCacheKey: string
export const audienceStatsCacheTtl: number
export const audienceStatsTimeZone: string
export const fallbackAudienceStats: AudienceStats
export const audienceStatItems: (stats: AudienceStats) => Array<{
  value: string
  label: string
}>
export function refreshAudienceStats(seedStats: AudienceStats): Promise<CachedAudienceStats>
export function isAudienceStatsStale(updatedAt: number, expiresAt?: number): boolean
export function getAudienceStatsExpiresAt(now?: number): number
export function formatAudienceNumber(value: number): string
export function formatAudienceTimestamp(updatedAt: number): string
