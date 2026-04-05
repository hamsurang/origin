import 'server-only'

import { cache } from 'react'
import type {
  CachedDayStats,
  DiscordStatsResult,
} from '../../_shared/components/DiscordActivity/DiscordActivity.types'
import { buildFromDayStats } from '../../_shared/components/DiscordActivity/DiscordActivity.utils'
import { HAMSURANG_PEOPLE } from '../../_shared/components/People/People.constants'

const DAYS_TO_FETCH = 14

const discordIdToName = new Map(
  HAMSURANG_PEOPLE.filter((p): p is typeof p & { discordId: string } => 'discordId' in p).map(
    (p) => [p.discordId, p.name],
  ),
)

function emptyResult(dates?: string[]): DiscordStatsResult {
  return {
    stats: { totalMessages: 0, totalContributors: 0, dailyTotals: [], rankedContributors: [] },
    missingDates: dates ?? getDateRange(),
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

let redisClient: Awaited<ReturnType<typeof createRedis>> | null = null

async function createRedis() {
  const { Redis } = await import('@upstash/redis')
  return new Redis({
    url: process.env.KV_REST_API_URL ?? '',
    token: process.env.KV_REST_API_TOKEN ?? '',
  })
}

async function getRedis() {
  if (redisClient) {
    return redisClient
  }
  try {
    redisClient = await createRedis()
    return redisClient
  } catch {
    return null
  }
}

function kvKey(date: string): string {
  return `discord-stats:${date}`
}

async function fetchDiscordStatsResult(): Promise<DiscordStatsResult> {
  if (!process.env.DISCORD_BOT_TOKEN || !process.env.DISCORD_GUILD_ID) {
    console.warn('[discord-stats] Missing required configuration')
    return emptyResult()
  }

  try {
    const dates = getDateRange()
    const redis = await getRedis()

    const dayStats: CachedDayStats[] = []
    const missingDates: string[] = []

    if (redis) {
      const keys = dates.map(kvKey)
      const results = await redis.mget<(CachedDayStats | null)[]>(...keys)

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

    const stats = buildFromDayStats(dayStats, dates, discordIdToName)

    return { stats, missingDates }
  } catch (error) {
    console.error('[discord-stats] Failed to fetch Discord stats:', error)
    return emptyResult()
  }
}

export const getDiscordStats = cache(fetchDiscordStatsResult)

export { getDateRange, getRedis, kvKey }
