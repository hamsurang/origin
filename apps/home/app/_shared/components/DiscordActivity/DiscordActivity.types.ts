export type DailyContributor = {
  id: string
  username: string
  avatar: string | null
  messages: number
}

export type DailyStats = {
  date: string
  messages: number
  participants: number
  contributors: DailyContributor[]
}

export type DiscordStats = {
  guildId: string
  lastUpdated: string
  daily: DailyStats[]
}

export type RankedContributor = {
  id: string
  username: string
  avatar: string | null
  totalMessages: number
  dailyMessages: { date: string; value: number }[]
  displayName?: string
}

export type AggregatedStats = {
  totalMessages: number
  totalContributors: number
  dailyTotals: { date: string; value: number }[]
  rankedContributors: RankedContributor[]
}

export type CachedDayStats = {
  date: string
  messages: number
  contributors: { id: string; username: string; avatar: string | null; messages: number }[]
}

export type DiscordStatsResult = {
  stats: AggregatedStats
  missingDates: string[]
}
