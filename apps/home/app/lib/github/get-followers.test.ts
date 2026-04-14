import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

import { getFollowers } from './get-followers'

describe('getFollowers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches followers from GitHub API and returns them', async () => {
    const mockFollowers = [
      {
        login: 'user1',
        avatar_url: 'https://avatars.githubusercontent.com/u/1',
        html_url: 'https://github.com/user1',
      },
      {
        login: 'user2',
        avatar_url: 'https://avatars.githubusercontent.com/u/2',
        html_url: 'https://github.com/user2',
      },
    ]
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockFollowers),
    })

    const result = await getFollowers()

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/users/hamsurang/followers?per_page=100',
      expect.objectContaining({ next: { revalidate: 3600 } }),
    )
    expect(result).toEqual(mockFollowers)
  })

  it('returns empty array when fetch fails', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 })

    const result = await getFollowers()

    expect(result).toEqual([])
  })

  it('returns empty array when fetch throws', async () => {
    mockFetch.mockRejectedValueOnce(new Error('network error'))

    const result = await getFollowers()

    expect(result).toEqual([])
  })
})
