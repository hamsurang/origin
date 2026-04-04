import { describe, it, expect } from 'vitest'
import { getAvatarUrl, buildFromDayStats } from './DiscordActivity.utils'
import type { CachedDayStats } from './DiscordActivity.types'

const CDN = 'https://cdn.discordapp.com'

describe('getAvatarUrl', () => {
  it('returns a CDN URL with the hash when a custom avatar hash is provided', () => {
    const url = getAvatarUrl('123456789', 'abc123hash')
    expect(url).toBe(`${CDN}/avatars/123456789/abc123hash.png`)
  })

  it('returns a default avatar URL when avatar hash is null', () => {
    // userId 0 → BigInt(0) >> 22n = 0 → index 0 % 6 = 0
    const url = getAvatarUrl('0', null)
    expect(url).toMatch(/\/embed\/avatars\/\d\.png$/)
  })

  it('falls back to avatar/0.png when the user ID is non-numeric', () => {
    const url = getAvatarUrl('not-a-number', null)
    expect(url).toBe(`${CDN}/embed/avatars/0.png`)
  })
})

describe('buildFromDayStats', () => {
  const day1: CachedDayStats = {
    date: '2024-01-01',
    messages: 3,
    contributors: [
      { id: 'u1', username: 'alice', avatar: null, messages: 2 },
      { id: 'u2', username: 'bob', avatar: null, messages: 1 },
    ],
  }
  const day2: CachedDayStats = {
    date: '2024-01-02',
    messages: 4,
    contributors: [
      { id: 'u1', username: 'alice', avatar: null, messages: 3 },
      { id: 'u3', username: 'carol', avatar: null, messages: 1 },
    ],
  }

  it('aggregates daily contributors into a ranked list', () => {
    const result = buildFromDayStats([day1, day2], ['2024-01-01', '2024-01-02'])
    expect(result.totalContributors).toBe(3)
    expect(result.rankedContributors).toHaveLength(3)
  })

  it('sorts ranked contributors by totalMessages descending', () => {
    const result = buildFromDayStats([day1, day2], ['2024-01-01', '2024-01-02'])
    const totals = result.rankedContributors.map((c) => c.totalMessages)
    expect(totals).toEqual([...totals].sort((a, b) => b - a))
    // alice has 2+3=5, bob has 1, carol has 1
    expect(result.rankedContributors[0].id).toBe('u1')
  })

  it('returns correct dailyTotals values', () => {
    const result = buildFromDayStats([day1, day2], ['2024-01-01', '2024-01-02'])
    expect(result.dailyTotals).toEqual([
      { date: '2024-01-01', value: 3 },
      { date: '2024-01-02', value: 4 },
    ])
  })

  it('returns empty stats when no days are provided', () => {
    const result = buildFromDayStats([], ['2024-01-01', '2024-01-02'])
    expect(result.totalMessages).toBe(0)
    expect(result.totalContributors).toBe(0)
    expect(result.rankedContributors).toHaveLength(0)
    expect(result.dailyTotals).toEqual([
      { date: '2024-01-01', value: 0 },
      { date: '2024-01-02', value: 0 },
    ])
  })

  it('applies nameMap displayName when provided', () => {
    const nameMap = new Map([['u1', 'Alice Wonderland']])
    const result = buildFromDayStats([day1], ['2024-01-01'], nameMap)
    const alice = result.rankedContributors.find((c) => c.id === 'u1')
    expect(alice?.displayName).toBe('Alice Wonderland')
  })

  it('leaves displayName undefined when no nameMap is provided', () => {
    const result = buildFromDayStats([day1], ['2024-01-01'])
    for (const c of result.rankedContributors) {
      expect(c.displayName).toBeUndefined()
    }
  })
})
