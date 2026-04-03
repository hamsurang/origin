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
