import 'server-only'

import { cache } from 'react'
import type {
  CachedDayStats,
  DiscordStatsResult,
} from '../../_shared/components/DiscordActivity/DiscordActivity.types'
import { buildFromDayStats } from '../../_shared/components/DiscordActivity/DiscordActivity.utils'
import { fetchChannelMessages, fetchGuildChannels } from './api'
import { snowflakeFromTimestamp } from './snowflake'
import type { DiscordMessage } from './types'

const DAYS_TO_FETCH = 14

function emptyResult(): DiscordStatsResult {
  return {
    stats: { totalMessages: 0, totalContributors: 0, dailyTotals: [], rankedContributors: [] },
    missingDates: [],
  }
}

function getDateRange(): string[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = DAYS_TO_FETCH; i >= 1; i--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    dates.push(d.toISOString().split('T')[0] as string)
  }
  return dates
}

async function getRedis() {
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({
      url: process.env.KV_REST_API_URL ?? '',
      token: process.env.KV_REST_API_TOKEN ?? '',
    })
    await redis.ping()
    return redis
  } catch {
    return null
  }
}

async function fetchDiscordStatsResult(): Promise<DiscordStatsResult> {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!token || !guildId) {
    console.warn('[discord-stats] Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID')
    return emptyResult()
  }

  try {
    const dates = getDateRange()
    const redisClient = await getRedis()

    const dayStats: CachedDayStats[] = []
    const missingDates: string[] = []

    if (redisClient) {
      // Single mget round-trip for all dates
      const keys = dates.map((date) => `discord-stats:${date}`)
      const results = await redisClient.mget<(CachedDayStats | null)[]>(...keys)

      for (let i = 0; i < dates.length; i++) {
        const date = dates[i] as string
        const data = results[i]
        if (data) {
          dayStats.push(data)
        } else {
          missingDates.push(date)
        }
      }
      console.log(
        `[discord-stats] KV cache: ${dates.length - missingDates.length} hit, ${
          missingDates.length
        } miss`,
      )
    } else {
      missingDates.push(...dates)
      console.log('[discord-stats] KV not available, fetching all dates from Discord')
    }

    // Build stats from cached data only — missing dates show as 0
    const stats = buildFromDayStats(dayStats, dates)

    return { stats, missingDates }
  } catch (error) {
    console.error('[discord-stats] Failed to fetch Discord stats:', error)
    return emptyResult()
  }
}

// Request-level deduplication (no unstable_cache — KV per-day cache is sufficient)
export const getDiscordStats = cache(fetchDiscordStatsResult)

// Exported for Route Handler reuse
export { getDateRange, getRedis }
