import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

// Mock react cache to be a passthrough
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>()
  return { ...actual, cache: (fn: unknown) => fn }
})

const mockMget = vi.fn()
const mockPing = vi.fn()

vi.mock('@upstash/redis', () => ({
  Redis: class MockRedis {
    mget = mockMget
    ping = mockPing
  },
}))

import { getDateRange, getDiscordStats, kvKey } from './get-stats'

describe('kvKey', () => {
  it('includes environment prefix in the key', () => {
    const key = kvKey('2026-04-01')
    expect(key).toMatch(/^discord-stats:/)
    expect(key).toContain('2026-04-01')
  })
})

describe('getDiscordStats', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    mockMget.mockReset()
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  it('returns emptyResult when env vars are missing', async () => {
    process.env.DISCORD_BOT_TOKEN = undefined
    process.env.DISCORD_GUILD_ID = undefined

    const result = await getDiscordStats()

    expect(result.stats.totalMessages).toBe(0)
    expect(result.missingDates).toEqual([])
  })

  it('with Redis returning all hits, missingDates is empty', async () => {
    process.env.DISCORD_BOT_TOKEN = 'test-token'
    process.env.DISCORD_GUILD_ID = 'test-guild'
    process.env.KV_REST_API_URL = 'https://test.upstash.io'
    process.env.KV_REST_API_TOKEN = 'test-redis-token'

    const dates = getDateRange()
    const cachedStats = dates.map((date) => ({
      date,
      messages: 5,
      contributors: [{ id: 'u1', username: 'Alice', avatar: null, messages: 5 }],
    }))

    mockMget.mockResolvedValue(cachedStats)

    const result = await getDiscordStats()

    expect(result.missingDates).toHaveLength(0)
    expect(result.stats.totalMessages).toBeGreaterThan(0)
  })

  it('with Redis returning some nulls, missingDates contains those dates', async () => {
    process.env.DISCORD_BOT_TOKEN = 'test-token'
    process.env.DISCORD_GUILD_ID = 'test-guild'
    process.env.KV_REST_API_URL = 'https://test.upstash.io'
    process.env.KV_REST_API_TOKEN = 'test-redis-token'

    const dates = getDateRange()
    const mgetResults = dates.map((date, i) =>
      i < 3 ? null : { date, messages: 3, contributors: [] },
    )

    mockMget.mockResolvedValue(mgetResults)

    const result = await getDiscordStats()

    expect(result.missingDates).toHaveLength(3)
    expect(result.missingDates).toEqual(dates.slice(0, 3))
  })

  it('with Redis returning all nulls, all dates are missing', async () => {
    process.env.DISCORD_BOT_TOKEN = 'test-token'
    process.env.DISCORD_GUILD_ID = 'test-guild'
    process.env.KV_REST_API_URL = 'https://test.upstash.io'
    process.env.KV_REST_API_TOKEN = 'test-redis-token'

    const dates = getDateRange()
    mockMget.mockResolvedValue(dates.map(() => null))

    const result = await getDiscordStats()

    expect(result.missingDates).toHaveLength(dates.length)
    expect(result.missingDates).toEqual(dates)
  })
})
