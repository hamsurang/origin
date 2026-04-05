const DISCORD_EPOCH = 1420070400000n

export function snowflakeFromTimestamp(timestamp: number): string {
  return String((BigInt(timestamp) - DISCORD_EPOCH) << 22n)
}
