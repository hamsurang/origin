import type { AggregatedStats, DiscordStats, RankedContributor } from './DiscordActivity.types'

const DISCORD_CDN = 'https://cdn.discordapp.com'

export function getAvatarUrl(userId: string, avatarHash: string | null): string {
  if (!avatarHash) {
    try {
      const index = Number(BigInt(userId) >> 22n) % 6
      return `${DISCORD_CDN}/embed/avatars/${index}.png`
    } catch {
      return `${DISCORD_CDN}/embed/avatars/0.png`
    }
  }
  return `${DISCORD_CDN}/avatars/${userId}/${avatarHash}.png`
}

export function aggregateStats(stats: DiscordStats): AggregatedStats {
  const dailyTotals = stats.daily.map((d) => ({
    date: d.date,
    value: d.messages,
  }))

  const totalMessages = stats.daily.reduce((sum, d) => sum + d.messages, 0)

  // Aggregate per-contributor totals across all days
  const contributorMap = new Map<
    string,
    { username: string; avatar: string | null; totalMessages: number; daily: Map<string, number> }
  >()

  for (const day of stats.daily) {
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

  // Build ranked list sorted by totalMessages desc
  const allDates = stats.daily.map((d) => d.date)
  const rankedContributors: RankedContributor[] = Array.from(contributorMap.entries())
    .map(([id, data]) => ({
      id,
      username: data.username,
      avatar: data.avatar,
      totalMessages: data.totalMessages,
      dailyMessages: allDates.map((date) => ({
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
