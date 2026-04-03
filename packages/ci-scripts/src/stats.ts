import type { ContributorStats, DailyStats, DiscordMessage, StatsData } from './types.js'

export function aggregateContributors(messages: DiscordMessage[]): ContributorStats[] {
  const map = new Map<string, ContributorStats>()

  for (const msg of messages) {
    if (msg.author.bot) {
      continue
    }

    const existing = map.get(msg.author.id)
    if (existing) {
      existing.messages += 1
      existing.username = msg.author.username
      existing.avatar = msg.author.avatar
    } else {
      map.set(msg.author.id, {
        id: msg.author.id,
        username: msg.author.username,
        avatar: msg.author.avatar,
        messages: 1,
      })
    }
  }

  return Array.from(map.values()).sort((a, b) => b.messages - a.messages)
}

export function upsertDailyStats(
  existing: StatsData,
  newDay: DailyStats,
  maxDays = 365,
): StatsData {
  const daily = [...existing.daily]

  const existingIndex = daily.findIndex((d) => d.date === newDay.date)
  if (existingIndex >= 0) {
    daily[existingIndex] = newDay
  } else {
    daily.push(newDay)
  }

  daily.sort((a, b) => a.date.localeCompare(b.date))

  return {
    ...existing,
    daily: daily.length > maxDays ? daily.slice(-maxDays) : daily,
    lastUpdated: new Date().toISOString(),
  }
}
