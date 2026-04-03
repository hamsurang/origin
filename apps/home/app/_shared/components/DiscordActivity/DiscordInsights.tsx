'use client'

import { memo, useMemo } from 'react'
import { BarChart } from './BarChart'
import { ContributorRow } from './ContributorRow'
import type { DiscordStats } from './DiscordActivity.types'
import { aggregateStats } from './DiscordActivity.utils'

type DiscordInsightsProps = {
  stats: DiscordStats
}

export const DiscordInsights = memo(({ stats }: DiscordInsightsProps) => {
  const aggregated = useMemo(() => aggregateStats(stats), [stats])

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-base font-semibold">Discord Insights</span>
        <div className="text-xs text-gray-500">
          💬 <strong className="text-gray-900">{aggregated.totalMessages.toLocaleString()}</strong>
          {' · '}👥 <strong className="text-gray-900">{aggregated.totalContributors}</strong>
        </div>
      </div>

      <div className="border border-gray-200 rounded-md p-3.5 mb-4">
        <BarChart data={aggregated.dailyTotals} height={80} />
      </div>

      <span className="text-sm font-semibold mb-2 block">Contributors</span>
      <div className="border border-gray-200 rounded-md overflow-hidden">
        {aggregated.rankedContributors.map((contributor, i) => (
          <ContributorRow key={contributor.id} rank={i + 1} contributor={contributor} size="md" />
        ))}
      </div>
    </div>
  )
})
