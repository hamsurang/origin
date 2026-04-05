import { describe, it, expect } from 'vitest'
import { aggregateMessagesToDay, aggregateAllDays } from './aggregate'
import type { DiscordMessage } from './types'

function makeMessage(
  id: string,
  userId: string,
  username: string,
  timestamp: string,
  avatar: string | null = null,
  bot = false,
): DiscordMessage {
  return { id, timestamp, author: { id: userId, username, avatar, bot } }
}

describe('aggregateMessagesToDay', () => {
  it('aggregates messages by author', () => {
    const messages: DiscordMessage[] = [
      makeMessage('1', 'u1', 'alice', '2024-01-01T10:00:00Z'),
      makeMessage('2', 'u1', 'alice', '2024-01-01T11:00:00Z'),
      makeMessage('3', 'u2', 'bob', '2024-01-01T12:00:00Z'),
    ]
    const result = aggregateMessagesToDay(messages, '2024-01-01')
    expect(result.messages).toBe(3)
    const alice = result.contributors.find((c) => c.id === 'u1')
    const bob = result.contributors.find((c) => c.id === 'u2')
    expect(alice?.messages).toBe(2)
    expect(bob?.messages).toBe(1)
  })

  it('filters out bot messages', () => {
    const messages: DiscordMessage[] = [
      makeMessage('1', 'u1', 'alice', '2024-01-01T10:00:00Z'),
      makeMessage('2', 'bot1', 'BotUser', '2024-01-01T10:00:00Z', null, true),
    ]
    const result = aggregateMessagesToDay(messages, '2024-01-01')
    expect(result.messages).toBe(1)
    expect(result.contributors.every((c) => c.id !== 'bot1')).toBe(true)
  })

  it('ignores messages from different dates', () => {
    const messages: DiscordMessage[] = [
      makeMessage('1', 'u1', 'alice', '2024-01-01T10:00:00Z'),
      makeMessage('2', 'u2', 'bob', '2024-01-02T10:00:00Z'),
    ]
    const result = aggregateMessagesToDay(messages, '2024-01-01')
    expect(result.messages).toBe(1)
    expect(result.contributors).toHaveLength(1)
    expect(result.contributors[0].id).toBe('u1')
  })

  it('returns empty stats when there are no messages', () => {
    const result = aggregateMessagesToDay([], '2024-01-01')
    expect(result.date).toBe('2024-01-01')
    expect(result.messages).toBe(0)
    expect(result.contributors).toHaveLength(0)
  })

  it('sorts contributors by message count descending', () => {
    const messages: DiscordMessage[] = [
      makeMessage('1', 'u1', 'alice', '2024-01-01T09:00:00Z'),
      makeMessage('2', 'u2', 'bob', '2024-01-01T10:00:00Z'),
      makeMessage('3', 'u2', 'bob', '2024-01-01T11:00:00Z'),
      makeMessage('4', 'u2', 'bob', '2024-01-01T12:00:00Z'),
    ]
    const result = aggregateMessagesToDay(messages, '2024-01-01')
    expect(result.contributors[0].id).toBe('u2')
    expect(result.contributors[1].id).toBe('u1')
  })
})

describe('aggregateAllDays', () => {
  it('groups messages across multiple dates in a single pass', () => {
    const messages: DiscordMessage[] = [
      makeMessage('1', 'u1', 'alice', '2024-01-01T10:00:00Z'),
      makeMessage('2', 'u1', 'alice', '2024-01-02T10:00:00Z'),
      makeMessage('3', 'u2', 'bob', '2024-01-02T11:00:00Z'),
    ]
    const result = aggregateAllDays(messages, ['2024-01-01', '2024-01-02'])
    expect(result).toHaveLength(2)
    const day1 = result.find((d) => d.date === '2024-01-01')
    const day2 = result.find((d) => d.date === '2024-01-02')
    expect(day1?.messages).toBe(1)
    expect(day2?.messages).toBe(2)
  })

  it('returns correct stats per date', () => {
    const messages: DiscordMessage[] = [
      makeMessage('1', 'u1', 'alice', '2024-01-01T10:00:00Z'),
      makeMessage('2', 'u1', 'alice', '2024-01-01T11:00:00Z'),
    ]
    const result = aggregateAllDays(messages, ['2024-01-01'])
    expect(result[0].date).toBe('2024-01-01')
    expect(result[0].messages).toBe(2)
    expect(result[0].contributors[0].id).toBe('u1')
  })

  it('filters bot messages across all days', () => {
    const messages: DiscordMessage[] = [
      makeMessage('1', 'u1', 'alice', '2024-01-01T10:00:00Z'),
      makeMessage('2', 'bot1', 'Bot', '2024-01-01T10:00:00Z', null, true),
      makeMessage('3', 'bot1', 'Bot', '2024-01-02T10:00:00Z', null, true),
    ]
    const result = aggregateAllDays(messages, ['2024-01-01', '2024-01-02'])
    expect(result.every((d) => d.contributors.every((c) => c.id !== 'bot1'))).toBe(true)
  })

  it('returns empty stats for dates with no matching messages', () => {
    const messages: DiscordMessage[] = [makeMessage('1', 'u1', 'alice', '2024-01-01T10:00:00Z')]
    const result = aggregateAllDays(messages, ['2024-01-01', '2024-01-03'])
    const day3 = result.find((d) => d.date === '2024-01-03')
    expect(day3?.messages).toBe(0)
    expect(day3?.contributors).toHaveLength(0)
  })
})
