import 'server-only'

import type { DiscordChannel, DiscordMessage } from './types'

const DISCORD_API = 'https://discord.com/api/v10'
const TEXT_CHANNEL_TYPES = new Set([0, 5, 15])

// 활성 커뮤니티 채널만 조회 (운영진, webhook, moderator 등 제외)
const CHANNEL_WHITELIST = new Set([
  '1464184293625561135', // 함수랑-잡담해
  '1464476958938103859', // 함수랑-공유해
])

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 1200

async function discordFetch<T>(path: string, token: string, retries = 5): Promise<T> {
  const now = Date.now()
  const elapsed = now - lastRequestTime
  if (elapsed < MIN_REQUEST_INTERVAL) {
    await sleep(MIN_REQUEST_INTERVAL - elapsed)
  }
  lastRequestTime = Date.now()

  const url = `${DISCORD_API}${path}`
  const res = await fetch(url, {
    headers: { Authorization: `Bot ${token}` },
    cache: 'no-store',
  })

  // Read body as text first to avoid "Body has already been consumed" in Next.js
  const text = await res.text()

  if (res.status === 429) {
    if (retries <= 0) {
      throw new Error(`Rate limit exceeded after max retries for ${path}`)
    }
    const retryAfter = Math.ceil(Number(res.headers.get('retry-after') || '5'))
    console.warn(
      `[discord-api] Rate limited on ${path}, waiting ${retryAfter}s (${retries} retries left)`,
    )
    await sleep(retryAfter * 1000)
    lastRequestTime = Date.now()
    return discordFetch(path, token, retries - 1)
  }

  if (!res.ok) {
    throw new Error(`Discord API error: ${res.status} for ${path}`)
  }

  return JSON.parse(text) as T
}

export async function fetchGuildChannels(
  guildId: string,
  token: string,
): Promise<DiscordChannel[]> {
  const channels = await discordFetch<DiscordChannel[]>(`/guilds/${guildId}/channels`, token)
  return channels.filter((c) => TEXT_CHANNEL_TYPES.has(c.type) && CHANNEL_WHITELIST.has(c.id))
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
