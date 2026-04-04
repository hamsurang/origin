'use client'

import Link from 'next/link'
import { memo, useCallback, useEffect, useRef, useState, useTransition } from 'react'
import { BarChart } from './BarChart'
import { ContributorRow } from './ContributorRow'
import type { AggregatedStats, CachedDayStats } from './DiscordActivity.types'
import { buildFromDayStats } from './DiscordActivity.utils'

type DiscordActivityProps = {
  initialStats: AggregatedStats
  missingDates: string[]
  allDates: string[]
}

export const DiscordActivity = memo(
  ({ initialStats, missingDates, allDates }: DiscordActivityProps) => {
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
          // Merge: extract cached days from initial stats, add new days
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

          const allDays = [...cachedDays, ...newDays]

          startTransition(() => {
            setStats(buildFromDayStats(allDays, allDates))
            setIsUpdating(false)
          })
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return
        }
        console.error('[discord-activity] Fetch failed:', err)
        setIsUpdating(false)
      }
    }, [missingDates, allDates, stats])

    useEffect(() => {
      fetchMissing()
      return () => abortRef.current?.abort()
    }, [fetchMissing])

    const top3 = stats.rankedContributors.slice(0, 3)

    return (
      <div className="border border-gray-200 rounded-md overflow-hidden">
        <div className="px-3.5 pt-3.5">
          <div className="flex justify-between items-center mb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Discord Activity</span>
              {isUpdating && (
                <span className="text-[10px] text-gray-400 animate-pulse">updating...</span>
              )}
            </div>
            <Link href="/insights" className="text-xs text-blue-600 hover:underline">
              Insights →
            </Link>
          </div>

          <BarChart data={stats.dailyTotals} height={48} className="mb-1.5" />

          <div className="flex gap-4 text-xs text-gray-500 mb-3">
            <span>
              💬 <strong className="text-gray-900">{stats.totalMessages.toLocaleString()}</strong>{' '}
              messages
            </span>
            <span>
              👥 <strong className="text-gray-900">{stats.totalContributors}</strong> contributors
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200">
          {top3.map((contributor, i) => (
            <ContributorRow key={contributor.id} rank={i + 1} contributor={contributor} />
          ))}

          <div className="py-2 text-center bg-gray-50">
            <Link href="/insights" className="text-xs text-blue-600 hover:underline">
              View all {stats.totalContributors} contributors →
            </Link>
          </div>
        </div>
      </div>
    )
  },
)
