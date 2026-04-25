import { Github } from '@hamsurang/icon'
import type { GitHubFollower } from '../../../lib/github/types'
import { FollowersBubble } from '../Followers/FollowersBubble'

type Props = {
  followers: GitHubFollower[]
  featuredCount: number
}

export const FollowersTab = ({ followers, featuredCount }: Props) => {
  if (followers.length === 0) {
    return <div className="h-[200px] animate-pulse bg-gray-50 rounded-md" />
  }

  return (
    <div>
      <FollowersBubble
        followers={followers.slice(0, featuredCount + 28)}
        featuredCount={featuredCount}
      />
      <div className="mt-3 text-center">
        <a
          href="https://github.com/hamsurang"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-md hover:bg-gray-700 transition-colors"
        >
          <Github width={16} height={16} className="fill-current" aria-label="GitHub" />
          Follow Us
        </a>
      </div>
    </div>
  )
}
