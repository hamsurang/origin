export type DiscordChannel = {
  id: string
  name: string
  type: number
}

export type DiscordAuthor = {
  id: string
  username: string
  avatar: string | null
  bot?: boolean
}

export type DiscordMessage = {
  id: string
  timestamp: string
  author: DiscordAuthor
}

export type ContributorStats = {
  id: string
  username: string
  avatar: string | null
  messages: number
}

export type DailyStats = {
  date: string
  messages: number
  participants: number
  contributors: ContributorStats[]
}

export type StatsData = {
  guildId: string
  lastUpdated: string
  daily: DailyStats[]
}
