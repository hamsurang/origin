import type { GitHubFollower } from './types'

export async function getFollowers(): Promise<GitHubFollower[]> {
  try {
    const res = await fetch('https://api.github.com/users/hamsurang/followers?per_page=100', {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.warn(`[github] Failed to fetch followers: ${res.status}`)
      return []
    }

    return (await res.json()) as GitHubFollower[]
  } catch (error) {
    console.error('[github] Error fetching followers:', error)
    return []
  }
}
