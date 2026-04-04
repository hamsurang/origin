'use client'

import { memo } from 'react'
import { BarChart } from './BarChart'
import { ContributorRow } from './ContributorRow'
import type { AggregatedStats } from './DiscordActivity.types'
import { useDiscordStats } from './useDiscordStats'

type DiscordInsightsProps = {
  initialStats: AggregatedStats
  missingDates: string[]
}

export const DiscordInsights = memo(({ initialStats, missingDates }: DiscordInsightsProps) => {
  const { stats, isUpdating } = useDiscordStats(initialStats, missingDates)

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold">Discord Insights</span>
          {isUpdating && (
            <span className="text-[10px] text-gray-400 animate-pulse">updating...</span>
          )}
        </div>
        <div className="text-xs text-gray-500">
          💬 <strong className="text-gray-900">{stats.totalMessages.toLocaleString()}</strong>
          {' · '}👥 <strong className="text-gray-900">{stats.totalContributors}</strong>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-3.5 mb-4">
        <BarChart data={stats.dailyTotals} height={80} />
      </div>

      <span className="text-sm font-semibold mb-2 block">Contributors</span>
      <div className="border border-gray-200 rounded-md overflow-hidden">
        {stats.rankedContributors.map((contributor, i) => (
          <ContributorRow key={contributor.id} rank={i + 1} contributor={contributor} size="md" />
        ))}
      </div>
    </div>
  )
})
