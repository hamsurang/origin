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
