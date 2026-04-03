// scripts/collect-discord-stats.mjs

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DISCORD_API = 'https://discord.com/api/v10'
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = process.env.DISCORD_GUILD_ID
const DATA_PATH = join(import.meta.dirname, '..', 'apps', 'home', 'app', '_data', 'discord-stats.json')

const TEXT_CHANNEL_TYPES = new Set([0, 5, 11, 12, 15])

if (!BOT_TOKEN || !GUILD_ID) {
  console.error('Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID environment variables')
  process.exit(1)
}

async function discordFetch(path) {
  const url = `${DISCORD_API}${path}`
  const res = await fetch(url, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  })

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('retry-after') || '5')
    console.warn(`Rate limited, waiting ${retryAfter}s...`)
    await new Promise((r) => setTimeout(r, retryAfter * 1000))
    return discordFetch(path)
  }

  if (!res.ok) {
    throw new Error(`Discord API error: ${res.status} ${res.statusText} for ${path}`)
  }

  return res.json()
}

function snowflakeFromTimestamp(timestamp) {
  return String((BigInt(timestamp) - 1420070400000n) << 22n)
}

async function fetchChannelMessages(channelId, afterSnowflake) {
  const messages = []
  let lastId = afterSnowflake

  while (true) {
    const batch = await discordFetch(
      `/channels/${channelId}/messages?after=${lastId}&limit=100`
    )

    if (batch.length === 0) break

    messages.push(...batch)

    if (batch.length < 100) break

    // Messages are returned newest-first, so the smallest ID is last
    lastId = batch[batch.length - 1].id
  }

  return messages
}

async function collectDailyStats() {
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const dateStr = yesterday.toISOString().split('T')[0]

  const startOfDay = new Date(`${dateStr}T00:00:00Z`)
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`)
  const afterSnowflake = snowflakeFromTimestamp(startOfDay.getTime())

  console.log(`Collecting stats for ${dateStr}...`)

  const channels = await discordFetch(`/guilds/${GUILD_ID}/channels`)
  const textChannels = channels.filter((c) => TEXT_CHANNEL_TYPES.has(c.type))
  console.log(`Found ${textChannels.length} text channels`)

  const contributorMap = new Map()
  let totalMessages = 0

  for (const channel of textChannels) {
    try {
      const messages = await fetchChannelMessages(channel.id, afterSnowflake)

      const dayMessages = messages.filter((m) => {
        const ts = new Date(m.timestamp)
        return ts >= startOfDay && ts <= endOfDay && !m.author.bot
      })

      totalMessages += dayMessages.length

      for (const msg of dayMessages) {
        const { id, username, avatar } = msg.author
        const existing = contributorMap.get(id)
        if (existing) {
          existing.messages += 1
          existing.username = username
          existing.avatar = avatar
        } else {
          contributorMap.set(id, { id, username, avatar, messages: 1 })
        }
      }
    } catch (err) {
      console.warn(`Skipping channel ${channel.name} (${channel.id}): ${err.message}`)
    }
  }

  const contributors = Array.from(contributorMap.values()).sort(
    (a, b) => b.messages - a.messages
  )

  console.log(`${dateStr}: ${totalMessages} messages from ${contributors.length} contributors`)

  return {
    date: dateStr,
    messages: totalMessages,
    participants: contributors.length,
    contributors,
  }
}

async function main() {
  let data
  try {
    const raw = await readFile(DATA_PATH, 'utf-8')
    data = JSON.parse(raw)
  } catch {
    data = { guildId: GUILD_ID, lastUpdated: '', daily: [] }
  }

  const todayStats = await collectDailyStats()

  const existingIndex = data.daily.findIndex((d) => d.date === todayStats.date)
  if (existingIndex >= 0) {
    data.daily[existingIndex] = todayStats
  } else {
    data.daily.push(todayStats)
  }

  data.daily.sort((a, b) => a.date.localeCompare(b.date))

  if (data.daily.length > 365) {
    data.daily = data.daily.slice(-365)
  }

  data.guildId = GUILD_ID
  data.lastUpdated = new Date().toISOString()

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n')
  console.log(`Saved to ${DATA_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
