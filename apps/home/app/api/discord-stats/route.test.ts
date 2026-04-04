import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

const mockLimit = vi.fn().mockResolvedValue({ success: true })

vi.mock('@upstash/redis', () => ({
  Redis: class MockRedis {
    mget = vi.fn()
    pipeline = vi.fn().mockReturnValue({ set: vi.fn(), exec: vi.fn().mockResolvedValue([]) })
  },
}))

vi.mock('@upstash/ratelimit', () => {
  return {
    Ratelimit: class MockRatelimit {
      limit = mockLimit
      static slidingWindow = vi.fn().mockReturnValue({})
    },
  }
})

vi.mock('../../lib/discord/api', () => ({
  fetchGuildChannels: vi.fn(),
  fetchChannelMessages: vi.fn(),
}))

vi.mock('../../lib/discord/get-stats', () => ({
  getDateRange: vi.fn(() => ['2026-04-01', '2026-04-02', '2026-04-03']),
  getRedis: vi.fn(() => null),
  kvKey: vi.fn((date: string) => `discord-stats:dev:${date}`),
}))

import { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { fetchChannelMessages, fetchGuildChannels } from '../../lib/discord/api'
import { getRedis } from '../../lib/discord/get-stats'
import { GET } from './route'

const MockedRatelimit = vi.mocked(Ratelimit)
const mockedFetchGuildChannels = vi.mocked(fetchGuildChannels)
const mockedFetchChannelMessages = vi.mocked(fetchChannelMessages)
const mockedGetRedis = vi.mocked(getRedis)

function makeRequest(searchParams: string) {
  return new NextRequest(`http://localhost/api/discord-stats?${searchParams}`)
}

describe('GET /api/discord-stats', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.DISCORD_BOT_TOKEN = 'test-bot-token'
    process.env.DISCORD_GUILD_ID = 'test-guild-id'
    // No KV vars by default so getRatelimit() returns null
    process.env.KV_REST_API_URL = undefined
    process.env.KV_REST_API_TOKEN = undefined
    mockedGetRedis.mockResolvedValue(null)
    mockedFetchGuildChannels.mockResolvedValue([])
    mockedFetchChannelMessages.mockResolvedValue([])
  })

  afterEach(() => {
    process.env = { ...originalEnv }
  })

  describe('request validation', () => {
    it('returns 400 when dates param is missing', async () => {
      const req = new NextRequest('http://localhost/api/discord-stats')
      const res = await GET(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toBe('Missing dates parameter')
    })

    it('returns 400 when date format is invalid', async () => {
      const req = makeRequest('dates=not-a-date,also-bad')
      const res = await GET(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toBe('No valid dates')
    })

    it('returns 400 when valid-format dates are not in the allowed range', async () => {
      // getDateRange returns ['2026-04-01', '2026-04-02', '2026-04-03']
      // so a date outside that set should be filtered out
      const req = makeRequest('dates=2020-01-01')
      const res = await GET(req)

      expect(res.status).toBe(400)
      const body = await res.json()
      expect(body.error).toBe('No valid dates')
    })

    it('returns 400 when empty string is passed as dates', async () => {
      const req = makeRequest('dates=')
      const res = await GET(req)

      expect(res.status).toBe(400)
    })
  })

  describe('env var checks', () => {
    it('returns 500 when DISCORD_BOT_TOKEN is missing', async () => {
      process.env.DISCORD_BOT_TOKEN = undefined
      const req = makeRequest('dates=2026-04-01')
      const res = await GET(req)

      expect(res.status).toBe(500)
      const body = await res.json()
      expect(body.error).toBe('Server not configured')
    })

    it('returns 500 when DISCORD_GUILD_ID is missing', async () => {
      process.env.DISCORD_GUILD_ID = undefined
      const req = makeRequest('dates=2026-04-01')
      const res = await GET(req)

      expect(res.status).toBe(500)
      const body = await res.json()
      expect(body.error).toBe('Server not configured')
    })
  })

  describe('rate limiting', () => {
    it('returns 429 when rate limit is exceeded', async () => {
      process.env.KV_REST_API_URL = 'https://test.upstash.io'
      process.env.KV_REST_API_TOKEN = 'test-token'

      mockLimit.mockResolvedValueOnce({ success: false })

      const req = makeRequest('dates=2026-04-01')
      const res = await GET(req)

      expect(res.status).toBe(429)
      const body = await res.json()
      expect(body.error).toBe('Too many requests')
    })
  })

  describe('successful request', () => {
    it('returns 200 with CachedDayStats array when no Redis and channels return messages', async () => {
      mockedGetRedis.mockResolvedValue(null)
      mockedFetchGuildChannels.mockResolvedValue([{ id: 'ch1', name: 'chat', type: 0 }])
      mockedFetchChannelMessages.mockResolvedValue([
        {
          id: 'msg1',
          timestamp: '2026-04-01T10:00:00.000Z',
          author: { id: 'u1', username: 'Alice', avatar: null },
        },
      ])

      const req = makeRequest('dates=2026-04-01')
      const res = await GET(req)

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(Array.isArray(body)).toBe(true)
      const day = body.find((d: { date: string }) => d.date === '2026-04-01')
      expect(day).toBeDefined()
      expect(day.messages).toBe(1)
    })

    it('returns 200 with empty stats array when no messages found', async () => {
      mockedGetRedis.mockResolvedValue(null)
      mockedFetchGuildChannels.mockResolvedValue([])

      const req = makeRequest('dates=2026-04-01')
      const res = await GET(req)

      expect(res.status).toBe(200)
      const body = await res.json()
      expect(Array.isArray(body)).toBe(true)
      // aggregateAllDays returns one entry per date even if no messages
      expect(body[0].date).toBe('2026-04-01')
      expect(body[0].messages).toBe(0)
    })

    it('includes Cache-Control header on 200 response', async () => {
      mockedGetRedis.mockResolvedValue(null)
      mockedFetchGuildChannels.mockResolvedValue([])

      const req = makeRequest('dates=2026-04-01')
      const res = await GET(req)

      expect(res.status).toBe(200)
      expect(res.headers.get('Cache-Control')).toContain('s-maxage=300')
    })
  })
})
