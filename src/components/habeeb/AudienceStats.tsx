import { useEffect, useState, type CSSProperties } from 'react'
import {
  audienceStatItems,
  fallbackAudienceStats,
  formatAudienceTimestamp,
  isAudienceStatsStale,
  type AudienceStats,
  type CachedAudienceStats,
} from '../../audienceStats.js'
import {
  getAudienceStatsSnapshot,
  refreshAndCacheAudienceStats,
} from '../../services/audienceStatsClient'
import { ApiSpinner } from '../shared/ApiSpinner'

export function LiveAudienceStats() {
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

export function AudienceStatsLoading() {
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
