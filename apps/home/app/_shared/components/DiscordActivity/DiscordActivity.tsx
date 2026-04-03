'use client'

import Link from 'next/link'
import { memo } from 'react'
import { BarChart } from './BarChart'
import { ContributorRow } from './ContributorRow'
import type { AggregatedStats } from './DiscordActivity.types'

type DiscordActivityProps = {
  aggregatedStats: AggregatedStats
}

export const DiscordActivity = memo(({ aggregatedStats }: DiscordActivityProps) => {
  const top3 = aggregatedStats.rankedContributors.slice(0, 3)

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <div className="px-3.5 pt-3.5">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-sm font-semibold">Discord Activity</span>
          <Link href="/insights" className="text-xs text-blue-600 hover:underline">
            Insights →
          </Link>
        </div>

        <BarChart data={aggregatedStats.dailyTotals} height={48} className="mb-1.5" />

        <div className="flex gap-4 text-xs text-gray-500 mb-3">
          <span>
            💬{' '}
            <strong className="text-gray-900">
              {aggregatedStats.totalMessages.toLocaleString()}
            </strong>{' '}
            messages
          </span>
          <span>
            👥 <strong className="text-gray-900">{aggregatedStats.totalContributors}</strong>{' '}
            contributors
          </span>
        </div>
      </div>

      <div className="border-t border-gray-200">
        {top3.map((contributor, i) => (
          <ContributorRow key={contributor.id} rank={i + 1} contributor={contributor} />
        ))}

        <div className="py-2 text-center bg-gray-50">
          <Link href="/insights" className="text-xs text-blue-600 hover:underline">
            View all {aggregatedStats.totalContributors} contributors →
          </Link>
        </div>
      </div>
    </div>
  )
})
