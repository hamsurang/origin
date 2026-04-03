import type { DiscordChannel, DiscordMessage } from './types.js'

const DISCORD_API = 'https://discord.com/api/v10'

export const TEXT_CHANNEL_TYPES = new Set([0, 5, 15])

export async function discordFetch<T>(path: string, token: string, retries = 5): Promise<T> {
  const url = `${DISCORD_API}${path}`
  const res = await fetch(url, {
    headers: { Authorization: `Bot ${token}` },
  })

  if (res.status === 429) {
    if (retries <= 0) {
      throw new Error(`Rate limit exceeded after max retries for ${path}`)
    }
    const retryAfter = Number(res.headers.get('retry-after') || '5')
    console.warn(`Rate limited, waiting ${retryAfter}s...`)
    await new Promise((r) => setTimeout(r, retryAfter * 1000))
    return discordFetch(path, token, retries - 1)
  }

  if (!res.ok) {
    throw new Error(`Discord API error: ${res.status} ${res.statusText} for ${path}`)
  }

  return res.json() as Promise<T>
}

export async function fetchGuildChannels(
  guildId: string,
  token: string,
): Promise<DiscordChannel[]> {
  const channels = await discordFetch<DiscordChannel[]>(`/guilds/${guildId}/channels`, token)
  return channels.filter((c) => TEXT_CHANNEL_TYPES.has(c.type))
}

export async function fetchChannelMessages(
  channelId: string,
  afterSnowflake: string,
  token: string,
): Promise<DiscordMessage[]> {
  const messages: DiscordMessage[] = []
  let beforeId: string | null = null

  for (;;) {
    const endpoint: string = beforeId
      ? `/channels/${channelId}/messages?after=${afterSnowflake}&before=${beforeId}&limit=100`
      : `/channels/${channelId}/messages?after=${afterSnowflake}&limit=100`

    const batch: DiscordMessage[] = await discordFetch<DiscordMessage[]>(endpoint, token)
    if (batch.length === 0) {
      break
    }

    messages.push(...batch)
    if (batch.length < 100) {
      break
    }

    const last = batch[batch.length - 1]
    if (!last) {
      break
    }
    beforeId = last.id
  }

  return messages
}
