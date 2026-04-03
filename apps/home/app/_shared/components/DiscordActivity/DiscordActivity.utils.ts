const DISCORD_CDN = 'https://cdn.discordapp.com'

export function getAvatarUrl(userId: string, avatarHash: string | null): string {
  if (!avatarHash) {
    try {
      const index = Number(BigInt(userId) >> 22n) % 6
      return `${DISCORD_CDN}/embed/avatars/${index}.png`
    } catch {
      return `${DISCORD_CDN}/embed/avatars/0.png`
    }
  }
  return `${DISCORD_CDN}/avatars/${userId}/${avatarHash}.png`
}
