'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@hamsurang/ui'
import { BarChart } from './BarChart'
import type { RankedContributor } from './DiscordActivity.types'
import { getAvatarUrl } from './DiscordActivity.utils'

const SIZES = {
  sm: { barHeight: 28, avatarSize: 24 },
  md: { barHeight: 32, avatarSize: 28 },
} as const

type ContributorRowProps = {
  rank: number
  contributor: RankedContributor
  size?: keyof typeof SIZES
}

export const ContributorRow = ({ rank, contributor, size = 'sm' }: ContributorRowProps) => {
  const avatarUrl = getAvatarUrl(contributor.id, contributor.avatar)
  const { barHeight, avatarSize } = SIZES[size]

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100 last:border-b-0">
      <span className="w-4 text-right text-xs font-semibold text-gray-500 shrink-0">#{rank}</span>
      <Avatar style={{ width: avatarSize, height: avatarSize }}>
        <AvatarImage src={avatarUrl} alt={contributor.displayName ?? contributor.username} />
        <AvatarFallback>{(contributor.displayName ?? contributor.username)[0]}</AvatarFallback>
      </Avatar>
      <div className="w-[90px] shrink-0">
        <div className="text-xs font-semibold truncate">
          {contributor.displayName ?? contributor.username}
        </div>
        <div className="text-[10px] text-gray-500">{contributor.totalMessages} msgs</div>
      </div>
      <BarChart data={contributor.dailyMessages} height={barHeight} className="flex-1" />
    </div>
  )
}
