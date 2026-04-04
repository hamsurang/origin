import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { type NextRequest, NextResponse } from 'next/server'
import type { CachedDayStats } from '../../_shared/components/DiscordActivity/DiscordActivity.types'
import { aggregateMessagesToDay } from '../../lib/discord/aggregate'
import { fetchChannelMessages, fetchGuildChannels } from '../../lib/discord/api'
import { getDateRange, getRedis } from '../../lib/discord/get-stats'
import { snowflakeFromTimestamp } from '../../lib/discord/snowflake'
import type { DiscordMessage } from '../../lib/discord/types'

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const MAX_DATES = 30

function getRatelimit() {
  const url = process.env.KV_REST_API_URL
  const token = process.env.KV_REST_API_TOKEN
  if (!url || !token) {
    return null
  }
  return new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, '1 m'),
  })
}

export async function GET(request: NextRequest) {
  // Rate limiting
  const limiter = getRatelimit()
  if (limiter) {
    const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
    const { success } = await limiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
  }

  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!token || !guildId) {
    return NextResponse.json({ error: 'Server not configured' }, { status: 500 })
  }

  const datesParam = request.nextUrl.searchParams.get('dates')
  if (!datesParam) {
    return NextResponse.json({ error: 'Missing dates parameter' }, { status: 400 })
  }

  const requestedDates = datesParam.split(',')

  // Validate dates
  const validRange = new Set(getDateRange())
  const validDates = requestedDates.filter((d) => DATE_REGEX.test(d) && validRange.has(d))

  if (validDates.length === 0) {
    return NextResponse.json({ error: 'No valid dates' }, { status: 400 })
  }
  if (validDates.length > MAX_DATES) {
    return NextResponse.json({ error: 'Too many dates' }, { status: 400 })
  }

  try {
    const redisClient = await getRedis()

    // Check KV first — another request may have already populated these
    const alreadyCached: CachedDayStats[] = []
    const stillMissing: string[] = []

    if (redisClient) {
      const keys = validDates.map((d) => `discord-stats:${d}`)
      const results = await redisClient.mget<(CachedDayStats | null)[]>(...keys)

      for (let i = 0; i < validDates.length; i++) {
        const data = results[i]
        if (data) {
          alreadyCached.push(data)
        } else {
          stillMissing.push(validDates[i] as string)
        }
      }
    } else {
      stillMissing.push(...validDates)
    }

    const fetchedDays: CachedDayStats[] = [...alreadyCached]

    // Fetch only truly missing dates from Discord
    if (stillMissing.length > 0) {
      const startDate = stillMissing[0] as string
      const startOfRange = new Date(`${startDate}T00:00:00Z`)
      const afterSnowflake = snowflakeFromTimestamp(startOfRange.getTime())

      const textChannels = await fetchGuildChannels(guildId, token)
      const allMessages: DiscordMessage[] = []

      for (const channel of textChannels) {
        try {
          const messages = await fetchChannelMessages(channel.id, afterSnowflake, token)
          allMessages.push(...messages)
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          console.warn(`[api/discord-stats] Skipping channel ${channel.name}: ${message}`)
        }
      }

      const today = new Date().toISOString().split('T')[0] as string

      // Aggregate and cache
      if (redisClient) {
        const pipeline = redisClient.pipeline()
        for (const date of stillMissing) {
          const stats = aggregateMessagesToDay(allMessages, date)
          fetchedDays.push(stats)

          if (date === today) {
            pipeline.set(`discord-stats:${date}`, JSON.stringify(stats), { ex: 3600 })
          } else {
            pipeline.set(`discord-stats:${date}`, JSON.stringify(stats))
          }
        }
        await pipeline.exec()
      } else {
        for (const date of stillMissing) {
          fetchedDays.push(aggregateMessagesToDay(allMessages, date))
        }
      }
    }

    return NextResponse.json(fetchedDays, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  } catch (error) {
    console.error('[api/discord-stats] Error:', error)
    return NextResponse.json({ error: 'Failed to fetch Discord stats' }, { status: 500 })
  }
}
