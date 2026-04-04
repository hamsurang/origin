'use client'

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react'
import type { AggregatedStats, CachedDayStats } from './DiscordActivity.types'
import { buildFromDayStats } from './DiscordActivity.utils'

export function useDiscordStats(initialStats: AggregatedStats, missingDates: string[]) {
  const [stats, setStats] = useState(initialStats)
  const [isUpdating, setIsUpdating] = useState(missingDates.length > 0)
  const [, startTransition] = useTransition()
  const abortRef = useRef<AbortController | null>(null)

  const allDates = useMemo(
    () => initialStats.dailyTotals.map((d) => d.date),
    [initialStats.dailyTotals],
  )

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
        startTransition(() => {
          setStats((prev) => {
            const cachedDays: CachedDayStats[] = prev.dailyTotals
              .filter((d) => !missingDates.includes(d.date))
              .map((d) => {
                const contributors = prev.rankedContributors
                  .map((c) => ({
                    id: c.id,
                    username: c.username,
                    avatar: c.avatar,
                    messages: c.dailyMessages.find((dm) => dm.date === d.date)?.value ?? 0,
                  }))
                  .filter((c) => c.messages > 0)
                return { date: d.date, messages: d.value, contributors }
              })
            return buildFromDayStats([...cachedDays, ...newDays], allDates)
          })
          setIsUpdating(false)
        })
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return
      }
      console.error('[discord-stats] Fetch failed:', err)
      setIsUpdating(false)
    }
  }, [missingDates, allDates])

  useEffect(() => {
    fetchMissing()
    return () => abortRef.current?.abort()
  }, [fetchMissing])

  return { stats, isUpdating }
}
