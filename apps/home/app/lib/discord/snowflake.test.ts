import { describe, it, expect } from 'vitest'
import { snowflakeFromTimestamp } from './snowflake'

const DISCORD_EPOCH = 1420070400000

describe('snowflakeFromTimestamp', () => {
  it('returns "0" for the Discord epoch timestamp', () => {
    expect(snowflakeFromTimestamp(DISCORD_EPOCH)).toBe('0')
  })

  it('produces a monotonically increasing snowflake for later timestamps', () => {
    const earlier = BigInt(snowflakeFromTimestamp(1600000000000))
    const later = BigInt(snowflakeFromTimestamp(1700000000000))
    expect(earlier < later).toBe(true)
  })

  it('returns a non-zero positive snowflake for a timestamp after the Discord epoch', () => {
    const result = BigInt(snowflakeFromTimestamp(1600000000000))
    expect(result > 0n).toBe(true)
  })
})
