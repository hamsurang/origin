'use client'

import { BarChart } from './BarChart'
import type { RankedContributor } from './DiscordActivity.types'
import { getAvatarUrl } from './DiscordActivity.utils'

type ContributorRowProps = {
  rank: number
  contributor: RankedContributor
  barHeight: number
  avatarSize: number
}

export const ContributorRow = ({
  rank,
  contributor,
  barHeight,
  avatarSize,
}: ContributorRowProps) => {
  const avatarUrl = getAvatarUrl(contributor.id, contributor.avatar)

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100 last:border-b-0">
      <span className="w-4 text-right text-xs font-semibold text-gray-500 shrink-0">#{rank}</span>
      <img
        src={avatarUrl}
        alt={contributor.username}
        className="rounded-full shrink-0"
        style={{ width: avatarSize, height: avatarSize }}
      />
      <div className="w-[90px] shrink-0">
        <div className="text-xs font-semibold truncate">{contributor.username}</div>
        <div className="text-[10px] text-gray-500">{contributor.totalMessages} msgs</div>
      </div>
      <BarChart data={contributor.dailyMessages} height={barHeight} className="flex-1" />
    </div>
  )
}
