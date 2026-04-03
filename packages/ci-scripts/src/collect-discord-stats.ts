import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fetchChannelMessages, fetchGuildChannels } from './discord-api.js'
import { snowflakeFromTimestamp } from './snowflake.js'
import { aggregateContributors, upsertDailyStats } from './stats.js'
import type { StatsData } from './types.js'

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = process.env.DISCORD_GUILD_ID
const DATA_PATH = join(
  import.meta.dirname,
  '..',
  '..',
  '..',
  'apps',
  'home',
  'app',
  '_data',
  'discord-stats.json',
)

if (!BOT_TOKEN || !GUILD_ID) {
  console.error('Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID environment variables')
  process.exit(1)
}

const token: string = BOT_TOKEN
const guildId: string = GUILD_ID

async function main() {
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const dateStr = yesterday.toISOString().split('T')[0] as string

  const startOfDay = new Date(`${dateStr}T00:00:00Z`)
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`)
  const afterSnowflake = snowflakeFromTimestamp(startOfDay.getTime())

  console.log(`Collecting stats for ${dateStr}...`)

  const textChannels = await fetchGuildChannels(guildId, token)
  console.log(`Found ${textChannels.length} text channels`)

  const allMessages: import('./types.js').DiscordMessage[] = []

  for (const channel of textChannels) {
    try {
      const messages = await fetchChannelMessages(channel.id, afterSnowflake, token)
      const dayMessages = messages.filter((m) => {
        const ts = new Date(m.timestamp)
        return ts >= startOfDay && ts <= endOfDay
      })
      allMessages.push(...dayMessages)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.warn(`Skipping channel ${channel.name} (${channel.id}): ${message}`)
    }
  }

  const contributors = aggregateContributors(allMessages)

  console.log(`${dateStr}: ${allMessages.length} messages from ${contributors.length} contributors`)

  const dailyStats = {
    date: dateStr,
    messages: allMessages.length,
    participants: contributors.length,
    contributors,
  }

  let data: StatsData
  try {
    const raw = await readFile(DATA_PATH, 'utf-8')
    data = JSON.parse(raw) as StatsData
  } catch {
    data = { guildId: guildId, lastUpdated: '', daily: [] }
  }

  data = upsertDailyStats(data, dailyStats)
  data.guildId = guildId

  await writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`)
  console.log(`Saved to ${DATA_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
