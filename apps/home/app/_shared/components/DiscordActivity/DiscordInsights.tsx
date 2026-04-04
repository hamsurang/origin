'use client'

import { memo, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { BarChart } from './BarChart'
import { ContributorRow } from './ContributorRow'
import type { AggregatedStats, CachedDayStats } from './DiscordActivity.types'
import { buildFromDayStats } from './DiscordActivity.utils'

type DiscordInsightsProps = {
  initialStats: AggregatedStats
  missingDates: string[]
  allDates: string[]
}

export const DiscordInsights = memo(
  ({ initialStats, missingDates, allDates }: DiscordInsightsProps) => {
    const [stats, setStats] = useState(initialStats)
    const [isUpdating, setIsUpdating] = useState(missingDates.length > 0)
    const [, startTransition] = useTransition()
    const abortRef = useRef<AbortController | null>(null)

    const fetchMissing = useCallback(async () => {
      if (missingDates.length === 0) {
        return
      }

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const res = await fetch(`/api/discord-stats?dates=${missingDates.join(',')}`, {
          signal: controller.signal,
        })
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const newDays: CachedDayStats[] = await res.json()

        if (!controller.signal.aborted) {
          const cachedDays: CachedDayStats[] = stats.dailyTotals
            .filter((d) => !missingDates.includes(d.date))
            .map((d) => {
              const contributors = stats.rankedContributors
                .map((c) => ({
                  id: c.id,
                  username: c.username,
                  avatar: c.avatar,
                  messages: c.dailyMessages.find((dm) => dm.date === d.date)?.value ?? 0,
                }))
                .filter((c) => c.messages > 0)
              return { date: d.date, messages: d.value, contributors }
            })

          startTransition(() => {
            setStats(buildFromDayStats([...cachedDays, ...newDays], allDates))
            setIsUpdating(false)
          })
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        console.error('[discord-insights] Fetch failed:', err)
        setIsUpdating(false)
      }
    }, [missingDates, allDates, stats])

    useEffect(() => {
      fetchMissing()
      return () => abortRef.current?.abort()
    }, [fetchMissing])

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
  },
)
