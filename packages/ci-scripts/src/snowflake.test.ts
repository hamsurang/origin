import { describe, expect, it } from 'vitest'
import { snowflakeFromTimestamp, timestampFromSnowflake } from './snowflake.js'

describe('snowflakeFromTimestamp', () => {
  it('converts Unix timestamp to Discord snowflake', () => {
    const snowflake = snowflakeFromTimestamp(1772006400000)
    expect(typeof snowflake).toBe('string')
    expect(BigInt(snowflake)).toBeGreaterThan(0n)
  })

  it('produces snowflakes that increase with time', () => {
    const earlier = snowflakeFromTimestamp(1772006400000)
    const later = snowflakeFromTimestamp(1772006400000 + 86400000)
    expect(BigInt(later)).toBeGreaterThan(BigInt(earlier))
  })

  it('produces the correct snowflake for Discord epoch', () => {
    // At Discord epoch (2015-01-01), snowflake should be 0
    const snowflake = snowflakeFromTimestamp(1420070400000)
    expect(snowflake).toBe('0')
  })
})

describe('timestampFromSnowflake', () => {
  it('roundtrips with snowflakeFromTimestamp', () => {
    const original = 1772006400000
    const snowflake = snowflakeFromTimestamp(original)
    const recovered = timestampFromSnowflake(snowflake)
    expect(recovered).toBe(original)
  })

  it('extracts timestamp from a known Discord snowflake', () => {
    // Snowflake 0 = Discord epoch
    const ts = timestampFromSnowflake('0')
    expect(ts).toBe(1420070400000)
  })
})
