import { getFollowers } from '../../../lib/github/get-followers'
import type { GitHubFollower } from '../../../lib/github/types'
import { FEATURED_FOLLOWERS } from '../Followers/Followers.constants'
import { FollowersTab } from './FollowersTab'
import { PeopleFollowersTabs } from './PeopleFollowersTabs'
import { PeopleTab } from './PeopleTab'

function sortWithFeatured(
  followers: GitHubFollower[],
  featuredUsernames: readonly string[],
): { sorted: GitHubFollower[]; featuredCount: number } {
  const featured: GitHubFollower[] = []
  const rest: GitHubFollower[] = []

  const featuredSet = new Set(featuredUsernames.map((u) => u.toLowerCase()))
  for (const f of followers) {
    if (featuredSet.has(f.login.toLowerCase())) {
      featured.push(f)
      featuredSet.delete(f.login.toLowerCase())
    } else {
      rest.push(f)
    }
  }

  const missing = featuredUsernames.length - featured.length
  for (let i = 0; i < missing && rest.length > 0; i++) {
    const randomIdx = Math.floor(Math.random() * rest.length)
    featured.push(rest.splice(randomIdx, 1)[0] as GitHubFollower)
  }

  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[rest[i], rest[j]] = [rest[j] as GitHubFollower, rest[i] as GitHubFollower]
  }

  return { sorted: [...featured, ...rest], featuredCount: featured.length }
}

export const PeopleFollowersSection = async () => {
  const followers = await getFollowers()
  const { sorted, featuredCount } = sortWithFeatured(followers, FEATURED_FOLLOWERS)

  return (
    <PeopleFollowersTabs
      peopleSlot={<PeopleTab />}
      followersSlot={<FollowersTab followers={sorted} featuredCount={featuredCount} />}
      followersCount={sorted.length}
    />
  )
}
