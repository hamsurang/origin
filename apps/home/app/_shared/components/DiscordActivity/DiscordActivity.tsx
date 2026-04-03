'use client'

import Link from 'next/link'
import { memo, useMemo } from 'react'
import { BarChart } from './BarChart'
import { ContributorRow } from './ContributorRow'
import type { DiscordStats } from './DiscordActivity.types'
import { aggregateStats } from './DiscordActivity.utils'

type DiscordActivityProps = {
  stats: DiscordStats
}

export const DiscordActivity = memo(({ stats }: DiscordActivityProps) => {
  const aggregated = useMemo(() => aggregateStats(stats), [stats])
  const top3 = aggregated.rankedContributors.slice(0, 3)

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      {/* Header + Chart */}
      <div className="px-3.5 pt-3.5">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-sm font-semibold">Discord Activity</span>
          <Link href="/insights" className="text-xs text-blue-600 hover:underline">
            Insights →
          </Link>
        </div>

        <BarChart data={aggregated.dailyTotals} height={48} className="mb-1.5" />

        <div className="flex gap-4 text-xs text-gray-500 mb-3">
          <span>
            💬{' '}
            <strong className="text-gray-900">{aggregated.totalMessages.toLocaleString()}</strong>{' '}
            messages
          </span>
          <span>
            👥 <strong className="text-gray-900">{aggregated.totalContributors}</strong>{' '}
            contributors
          </span>
        </div>
      </div>

      {/* Top 3 contributors */}
      <div className="border-t border-gray-200">
        {top3.map((contributor, i) => (
          <ContributorRow
            key={contributor.id}
            rank={i + 1}
            contributor={contributor}
            barHeight={28}
            avatarSize={24}
          />
        ))}

        <div className="py-2 text-center bg-gray-50">
          <Link href="/insights" className="text-xs text-blue-600 hover:underline">
            View all {aggregated.totalContributors} contributors →
          </Link>
        </div>
      </div>
    </div>
  )
})
