const DISCORD_EPOCH = 1420070400000n

export function snowflakeFromTimestamp(timestamp: number): string {
  return String((BigInt(timestamp) - DISCORD_EPOCH) << 22n)
}

export function timestampFromSnowflake(snowflake: string): number {
  return Number((BigInt(snowflake) >> 22n) + DISCORD_EPOCH)
}
