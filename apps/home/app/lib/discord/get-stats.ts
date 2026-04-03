import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type {
  AggregatedStats,
  RankedContributor,
} from '../../_shared/components/DiscordActivity/DiscordActivity.types'
import { fetchChannelMessages, fetchGuildChannels } from './api'
import { snowflakeFromTimestamp } from './snowflake'
import type { DiscordMessage } from './types'

const REVALIDATE_INTERVAL = 86400 // 24 hours
const DAYS_TO_FETCH = 7

function emptyStats(): AggregatedStats {
  return { totalMessages: 0, totalContributors: 0, dailyTotals: [], rankedContributors: [] }
}

function groupMessagesByDate(
  messages: DiscordMessage[],
  dates: string[],
): Map<string, DiscordMessage[]> {
  const groups = new Map<string, DiscordMessage[]>()
  for (const date of dates) {
    groups.set(date, [])
  }

  for (const msg of messages) {
    if (msg.author.bot) {
      continue
    }
    const date = msg.timestamp.split('T')[0] as string
    const group = groups.get(date)
    if (group) {
      group.push(msg)
    }
  }

  return groups
}

function buildAggregatedStats(
  messagesByDate: Map<string, DiscordMessage[]>,
  dates: string[],
): AggregatedStats {
  const dailyTotals: { date: string; value: number }[] = []
  const contributorMap = new Map<
    string,
    { username: string; avatar: string | null; totalMessages: number; daily: Map<string, number> }
  >()

  for (const date of dates) {
    const messages = messagesByDate.get(date) ?? []
    dailyTotals.push({ date, value: messages.length })

    for (const msg of messages) {
      const { id, username, avatar } = msg.author
      const existing = contributorMap.get(id)
      if (existing) {
        existing.totalMessages += 1
        existing.daily.set(date, (existing.daily.get(date) ?? 0) + 1)
        existing.username = username
        existing.avatar = avatar
      } else {
        const daily = new Map<string, number>()
        daily.set(date, 1)
        contributorMap.set(id, { username, avatar, totalMessages: 1, daily })
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
    }))
    .sort((a, b) => b.totalMessages - a.totalMessages)

  return {
    totalMessages,
    totalContributors: contributorMap.size,
    dailyTotals,
    rankedContributors,
  }
}

async function fetchDiscordStats(): Promise<AggregatedStats> {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!token || !guildId) {
    console.warn('Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID')
    return emptyStats()
  }

  try {
    // Build date range for last 7 days
    const dates: string[] = []
    const now = new Date()
    for (let i = DAYS_TO_FETCH; i >= 1; i--) {
      const d = new Date(now)
      d.setUTCDate(d.getUTCDate() - i)
      dates.push(d.toISOString().split('T')[0] as string)
    }

    const startOfRange = new Date(`${dates[0]}T00:00:00Z`)
    const afterSnowflake = snowflakeFromTimestamp(startOfRange.getTime())

    console.log(`Fetching Discord stats for ${dates[0]} ~ ${dates[dates.length - 1]}...`)

    const textChannels = await fetchGuildChannels(guildId, token)
    console.log(`Found ${textChannels.length} text channels`)

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

    console.log(`Collected ${allMessages.length} messages`)

    const messagesByDate = groupMessagesByDate(allMessages, dates)
    return buildAggregatedStats(messagesByDate, dates)
  } catch (error) {
    console.error('Failed to fetch Discord stats:', error)
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
