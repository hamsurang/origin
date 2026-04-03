import { describe, expect, it } from 'vitest'
import { aggregateContributors, upsertDailyStats } from './stats.js'
import type { DailyStats, DiscordMessage, StatsData } from './types.js'

describe('aggregateContributors', () => {
  it('aggregates messages by author', () => {
    const messages: DiscordMessage[] = [
      {
        id: '1',
        timestamp: '2026-03-01T10:00:00Z',
        author: { id: '100', username: 'alice', avatar: 'abc', bot: false },
      },
      {
        id: '2',
        timestamp: '2026-03-01T11:00:00Z',
        author: { id: '100', username: 'alice', avatar: 'abc', bot: false },
      },
      {
        id: '3',
        timestamp: '2026-03-01T12:00:00Z',
        author: { id: '200', username: 'bob', avatar: null, bot: false },
      },
    ]

    const result = aggregateContributors(messages)

    expect(result).toHaveLength(2)
    expect(result.at(0)).toEqual({ id: '100', username: 'alice', avatar: 'abc', messages: 2 })
    expect(result.at(1)).toEqual({ id: '200', username: 'bob', avatar: null, messages: 1 })
  })

  it('filters out bot messages', () => {
    const messages: DiscordMessage[] = [
      {
        id: '1',
        timestamp: '2026-03-01T10:00:00Z',
        author: { id: '100', username: 'alice', avatar: null, bot: false },
      },
      {
        id: '2',
        timestamp: '2026-03-01T11:00:00Z',
        author: { id: '999', username: 'bot', avatar: null, bot: true },
      },
    ]

    const result = aggregateContributors(messages)

    expect(result).toHaveLength(1)
    expect(result.at(0)?.username).toBe('alice')
  })

  it('returns empty array for no messages', () => {
    expect(aggregateContributors([])).toEqual([])
  })

  it('sorts by message count descending', () => {
    const messages: DiscordMessage[] = [
      {
        id: '1',
        timestamp: '2026-03-01T10:00:00Z',
        author: { id: '100', username: 'alice', avatar: null },
      },
      {
        id: '2',
        timestamp: '2026-03-01T11:00:00Z',
        author: { id: '200', username: 'bob', avatar: null },
      },
      {
        id: '3',
        timestamp: '2026-03-01T12:00:00Z',
        author: { id: '200', username: 'bob', avatar: null },
      },
      {
        id: '4',
        timestamp: '2026-03-01T13:00:00Z',
        author: { id: '200', username: 'bob', avatar: null },
      },
    ]

    const result = aggregateContributors(messages)

    expect(result.at(0)?.username).toBe('bob')
    expect(result.at(0)?.messages).toBe(3)
    expect(result.at(1)?.username).toBe('alice')
    expect(result.at(1)?.messages).toBe(1)
  })
})

describe('upsertDailyStats', () => {
  const baseData: StatsData = {
    guildId: '123',
    lastUpdated: '2026-03-01T00:00:00Z',
    daily: [
      { date: '2026-03-01', messages: 10, participants: 3, contributors: [] },
      { date: '2026-03-02', messages: 15, participants: 5, contributors: [] },
    ],
  }

  it('appends a new day', () => {
    const newDay: DailyStats = {
      date: '2026-03-03',
      messages: 20,
      participants: 7,
      contributors: [],
    }
    const result = upsertDailyStats(baseData, newDay)

    expect(result.daily).toHaveLength(3)
    expect(result.daily.at(2)?.date).toBe('2026-03-03')
  })

  it('replaces an existing day', () => {
    const updatedDay: DailyStats = {
      date: '2026-03-01',
      messages: 99,
      participants: 10,
      contributors: [],
    }
    const result = upsertDailyStats(baseData, updatedDay)

    expect(result.daily).toHaveLength(2)
    expect(result.daily.at(0)?.messages).toBe(99)
  })

  it('sorts daily entries by date', () => {
    const earlyDay: DailyStats = {
      date: '2026-02-28',
      messages: 5,
      participants: 2,
      contributors: [],
    }
    const result = upsertDailyStats(baseData, earlyDay)

    expect(result.daily.at(0)?.date).toBe('2026-02-28')
    expect(result.daily.at(1)?.date).toBe('2026-03-01')
  })

  it('caps at maxDays', () => {
    const data: StatsData = {
      guildId: '123',
      lastUpdated: '',
      daily: Array.from({ length: 365 }, (_, i) => ({
        date: `2026-01-${String(i + 1).padStart(2, '0')}`,
        messages: 1,
        participants: 1,
        contributors: [],
      })),
    }

    const newDay: DailyStats = {
      date: '2026-12-31',
      messages: 10,
      participants: 5,
      contributors: [],
    }
    const result = upsertDailyStats(data, newDay, 365)

    expect(result.daily).toHaveLength(365)
    expect(result.daily.at(-1)?.date).toBe('2026-12-31')
  })

  it('does not mutate the original data', () => {
    const newDay: DailyStats = {
      date: '2026-03-03',
      messages: 20,
      participants: 7,
      contributors: [],
    }
    const originalLength = baseData.daily.length
    upsertDailyStats(baseData, newDay)

    expect(baseData.daily).toHaveLength(originalLength)
  })

  it('updates lastUpdated timestamp', () => {
    const newDay: DailyStats = {
      date: '2026-03-03',
      messages: 1,
      participants: 1,
      contributors: [],
    }
    const result = upsertDailyStats(baseData, newDay)

    expect(result.lastUpdated).not.toBe(baseData.lastUpdated)
  })
})
