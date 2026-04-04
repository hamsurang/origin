import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type {
  AggregatedStats,
  RankedContributor,
} from '../../_shared/components/DiscordActivity/DiscordActivity.types'
import { HAMSURANG_PEOPLE } from '../../_shared/components/People/People.constants'
import { fetchChannelMessages, fetchGuildChannels } from './api'
import { snowflakeFromTimestamp } from './snowflake'
import type { DiscordMessage } from './types'

const discordIdToName = new Map(
  HAMSURANG_PEOPLE.filter((p): p is typeof p & { discordId: string } => 'discordId' in p).map(
    (p) => [p.discordId, p.name],
  ),
)

const REVALIDATE_INTERVAL = 86400
const DAYS_TO_FETCH = 7

type CachedDayStats = {
  date: string
  messages: number
  contributors: { id: string; username: string; avatar: string | null; messages: number }[]
}

function emptyStats(): AggregatedStats {
  return { totalMessages: 0, totalContributors: 0, dailyTotals: [], rankedContributors: [] }
}

function getLast7Days(): string[] {
  const dates: string[] = []
  const now = new Date()
  for (let i = DAYS_TO_FETCH; i >= 1; i--) {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - i)
    dates.push(d.toISOString().split('T')[0] as string)
  }
  return dates
}

function aggregateMessagesToDay(messages: DiscordMessage[], date: string): CachedDayStats {
  const contributorMap = new Map<
    string,
    { username: string; avatar: string | null; messages: number }
  >()

  for (const msg of messages) {
    if (msg.author.bot) {
      continue
    }
    const msgDate = msg.timestamp.split('T')[0]
    if (msgDate !== date) {
      continue
    }

    const existing = contributorMap.get(msg.author.id)
    if (existing) {
      existing.messages += 1
      existing.username = msg.author.username
      existing.avatar = msg.author.avatar
    } else {
      contributorMap.set(msg.author.id, {
        username: msg.author.username,
        avatar: msg.author.avatar,
        messages: 1,
      })
    }
  }

  const contributors = Array.from(contributorMap.entries())
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => b.messages - a.messages)

  return {
    date,
    messages: contributors.reduce((sum, c) => sum + c.messages, 0),
    contributors,
  }
}

function buildFromDayStats(days: CachedDayStats[], dates: string[]): AggregatedStats {
  const dayMap = new Map(days.map((d) => [d.date, d]))

  const dailyTotals = dates.map((date) => ({
    date,
    value: dayMap.get(date)?.messages ?? 0,
  }))

  const contributorMap = new Map<
    string,
    { username: string; avatar: string | null; totalMessages: number; daily: Map<string, number> }
  >()

  for (const day of days) {
    for (const c of day.contributors) {
      const existing = contributorMap.get(c.id)
      if (existing) {
        existing.totalMessages += c.messages
        existing.daily.set(day.date, c.messages)
        existing.username = c.username
        existing.avatar = c.avatar
      } else {
        const daily = new Map<string, number>()
        daily.set(day.date, c.messages)
        contributorMap.set(c.id, {
          username: c.username,
          avatar: c.avatar,
          totalMessages: c.messages,
          daily,
        })
      }
    }
  }

  const totalMessages = dailyTotals.reduce((sum, d) => sum + d.value, 0)

  const rankedContributors: RankedContributor[] = Array.from(contributorMap.entries())
    .map(([id, data]) => ({
      id,
      username: data.username,
      avatar: data.avatar,
      totalMessages: data.totalMessages,
      dailyMessages: dates.map((date) => ({
        date,
        value: data.daily.get(date) ?? 0,
      })),
      displayName: discordIdToName.get(id),
    }))
    .sort((a, b) => b.totalMessages - a.totalMessages)

  return {
    totalMessages,
    totalContributors: contributorMap.size,
    dailyTotals,
    rankedContributors,
  }
}

async function getRedis() {
  try {
    const { Redis } = await import('@upstash/redis')
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL ?? '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
    })
    await redis.ping()
    return redis
  } catch {
    return null
  }
}

async function fetchDiscordStats(): Promise<AggregatedStats> {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!token || !guildId) {
    console.warn('[discord-stats] Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID')
    return emptyStats()
  }

  try {
    const dates = getLast7Days()
    const today = dates[dates.length - 1] as string
    const redisClient = await getRedis()

    // Try loading each date from KV
    const dayStats: CachedDayStats[] = []
    const missingDates: string[] = []

    if (redisClient) {
      const cached = await Promise.all(
        dates.map(async (date) => {
          const data = await redisClient.get<CachedDayStats>(`discord-stats:${date}`)
          return { date, data }
        }),
      )

      for (const { date, data } of cached) {
        if (data && date !== today) {
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

    // Fetch missing dates from Discord
    if (missingDates.length > 0) {
      const startDate = missingDates[0] as string
      const startOfRange = new Date(`${startDate}T00:00:00Z`)
      const afterSnowflake = snowflakeFromTimestamp(startOfRange.getTime())

      console.log(`[discord-stats] Fetching ${missingDates.length} days from Discord...`)

      const textChannels = await fetchGuildChannels(guildId, token)
      const allMessages: DiscordMessage[] = []

      for (const channel of textChannels) {
        try {
          const messages = await fetchChannelMessages(channel.id, afterSnowflake, token)
          allMessages.push(...messages)
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          console.warn(`Skipping channel ${channel.name}: ${message}`)
        }
      }

      console.log(`[discord-stats] Collected ${allMessages.length} messages`)

      // Aggregate per missing date and save to KV
      for (const date of missingDates) {
        const stats = aggregateMessagesToDay(allMessages, date)
        dayStats.push(stats)

        // Cache past days in KV (not today — still accumulating)
        if (redisClient && date !== today) {
          await redisClient.set(`discord-stats:${date}`, stats)
        }
      }
    }

    return buildFromDayStats(dayStats, dates)
  } catch (error) {
    console.error('[discord-stats] Failed to fetch Discord stats:', error)
    return emptyStats()
  }
}

// Layer 1: ISR-style persistent cache (24h)
const getCachedStats = unstable_cache(fetchDiscordStats, ['discord-stats'], {
  revalidate: REVALIDATE_INTERVAL,
  tags: ['discord-stats'],
})

// Layer 2: Request-level deduplication
export const getDiscordStats = cache(getCachedStats)
