import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('server-only', () => ({}))

import { fetchChannelMessages, fetchGuildChannels } from './api'

const WHITELISTED_CHANNEL_ID = '1464184293625561135' // 함수랑-잡담해
const NON_WHITELISTED_CHANNEL_ID = '9999999999999999999'

function makeFetchResponse(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    }),
  )
}

describe('fetchGuildChannels', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(global, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('filters channels by whitelist AND type, returning only whitelisted text channels', async () => {
    const channels = [
      { id: WHITELISTED_CHANNEL_ID, name: 'whitelisted-text', type: 0 },
      { id: NON_WHITELISTED_CHANNEL_ID, name: 'non-whitelisted-text', type: 0 },
      { id: '1464476958938103859', name: 'whitelisted-forum', type: 15 },
      { id: '1464477161921712249', name: 'whitelisted-voice', type: 2 }, // type 2 = voice, not in TEXT_CHANNEL_TYPES
    ]
    vi.mocked(fetch).mockReturnValueOnce(makeFetchResponse(channels))

    const promise = fetchGuildChannels('guild123', 'token123')
    await vi.runAllTimersAsync()
    const result = await promise

    // Whitelisted text channel (type 0) and whitelisted forum (type 15) should pass
    // Non-whitelisted text channel and whitelisted voice should be excluded
    expect(result).toHaveLength(2)
    expect(result.map((c) => c.id)).toContain(WHITELISTED_CHANNEL_ID)
    expect(result.map((c) => c.id)).toContain('1464476958938103859')
    expect(result.map((c) => c.id)).not.toContain(NON_WHITELISTED_CHANNEL_ID)
    expect(result.map((c) => c.id)).not.toContain('1464477161921712249')
  })

  it('returns only whitelisted text channels from a mixed list', async () => {
    const channels = [
      { id: WHITELISTED_CHANNEL_ID, name: 'chat', type: 0 },
      { id: '1464476958938103859', name: 'share', type: 0 },
      { id: NON_WHITELISTED_CHANNEL_ID, name: 'admin', type: 0 },
    ]
    vi.mocked(fetch).mockReturnValueOnce(makeFetchResponse(channels))

    const promise = fetchGuildChannels('guild123', 'token123')
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result).toHaveLength(2)
    expect(result.every((c) => c.type === 0)).toBe(true)
  })

  it('throws on API error', async () => {
    vi.mocked(fetch).mockReturnValueOnce(makeFetchResponse({ message: 'Unauthorized' }, 401))

    const promise = fetchGuildChannels('guild123', 'bad-token')
    vi.runAllTimersAsync()

    await expect(promise).rejects.toThrow('Discord API error: 401')
  })
})

describe('fetchChannelMessages', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(global, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('returns messages from a single batch (fewer than 100)', async () => {
    const messages = [
      {
        id: '1',
        timestamp: '2026-04-01T10:00:00Z',
        author: { id: 'u1', username: 'Alice', avatar: null },
      },
      {
        id: '2',
        timestamp: '2026-04-01T11:00:00Z',
        author: { id: 'u2', username: 'Bob', avatar: null },
      },
    ]
    vi.mocked(fetch).mockReturnValueOnce(makeFetchResponse(messages))

    const promise = fetchChannelMessages(WHITELISTED_CHANNEL_ID, '0', 'token123')
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result).toHaveLength(2)
    expect(result[0]?.id).toBe('1')
    expect(result[1]?.id).toBe('2')
  })

  it('returns empty array when no messages exist', async () => {
    vi.mocked(fetch).mockReturnValueOnce(makeFetchResponse([]))

    const promise = fetchChannelMessages(WHITELISTED_CHANNEL_ID, '0', 'token123')
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result).toHaveLength(0)
  })

  it('handles pagination by fetching until batch has fewer than 100 messages', async () => {
    const firstBatch = Array.from({ length: 100 }, (_, i) => ({
      id: String(i + 1),
      timestamp: '2026-04-01T10:00:00Z',
      author: { id: 'u1', username: 'Alice', avatar: null },
    }))
    const secondBatch = [
      {
        id: '101',
        timestamp: '2026-04-01T11:00:00Z',
        author: { id: 'u1', username: 'Alice', avatar: null },
      },
    ]

    vi.mocked(fetch)
      .mockReturnValueOnce(makeFetchResponse(firstBatch))
      .mockReturnValueOnce(makeFetchResponse(secondBatch))

    const promise = fetchChannelMessages(WHITELISTED_CHANNEL_ID, '0', 'token123')
    await vi.runAllTimersAsync()
    const result = await promise

    expect(result).toHaveLength(101)
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2)
    // Second call should use beforeId from last message of first batch
    const secondCallUrl = vi.mocked(fetch).mock.calls[1]?.[0] as string
    expect(secondCallUrl).toContain('before=100')
  })
})
