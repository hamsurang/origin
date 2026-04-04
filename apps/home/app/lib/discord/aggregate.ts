import type { CachedDayStats } from '../../_shared/components/DiscordActivity/DiscordActivity.types'
import type { DiscordMessage } from './types'

export function aggregateMessagesToDay(messages: DiscordMessage[], date: string): CachedDayStats {
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

export function aggregateAllDays(messages: DiscordMessage[], dates: string[]): CachedDayStats[] {
  const dateSet = new Set(dates)
  const grouped = new Map<string, DiscordMessage[]>()

  for (const msg of messages) {
    if (msg.author.bot) {
      continue
    }
    const msgDate = msg.timestamp.split('T')[0]
    if (!msgDate || !dateSet.has(msgDate)) {
      continue
    }
    const arr = grouped.get(msgDate) ?? []
    arr.push(msg)
    grouped.set(msgDate, arr)
  }

  return dates.map((date) => aggregateMessagesToDay(grouped.get(date) ?? [], date))
}
