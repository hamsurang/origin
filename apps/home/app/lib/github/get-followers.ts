import type { GitHubFollower } from './types'

function isGitHubFollower(value: unknown): value is GitHubFollower {
  if (value === null || typeof value !== 'object') {
    return false
  }
  const v = value as Record<string, unknown>
  return (
    typeof v.login === 'string' &&
    typeof v.avatar_url === 'string' &&
    typeof v.html_url === 'string'
  )
}

export async function getFollowers(): Promise<GitHubFollower[]> {
  try {
    const res = await fetch('https://api.github.com/users/hamsurang/followers?per_page=100', {
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.warn(`[github] Failed to fetch followers: ${res.status}`)
      return []
    }

    const data: unknown = await res.json()
    if (!Array.isArray(data)) {
      console.warn('[github] Unexpected followers response shape: not an array')
      return []
    }

    return data.filter(isGitHubFollower)
  } catch (error) {
    console.error('[github] Error fetching followers:', error)
    return []
  }
}
