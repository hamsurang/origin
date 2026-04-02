'use client'

import dayjs from 'dayjs'
import { memo } from 'react'
import { ActivityLogProvider } from './ActivityLog.provider'
import type { ActivityLogProps } from './ActivityLog.types'
import * as Compounds from './compounds'

const DAY_OF_WEEK_MAP: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

export type MergedContentItem = {
  text: string
  url?: string
}

const getMergedActivityLog = ({ logs }: ActivityLogProps) => {
  return logs.reduce<Record<string, { contents: MergedContentItem[] }>>((acc, log) => {
    const endDate = dayjs(log.endDate)
    const startDate = dayjs(log.startDate)
    let currentDate = startDate

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      if (log.loop) {
        const dayNums = log.loop.daysOfWeek.map((d) => DAY_OF_WEEK_MAP[d])
        const interval = log.loop.weekInterval ?? 1

        if (
          !dayNums.includes(currentDate.day()) ||
          currentDate.diff(startDate, 'week') % interval !== 0
        ) {
          currentDate = currentDate.add(1, 'day')
          continue
        }
      }

      const date = currentDate.format('YYYY-MM-DD')
      if (!acc[date]) {
        acc[date] = { contents: [] }
      }

      const dateLink = log.links?.[date as keyof typeof log.links]
      acc[date].contents.push({
        text: dateLink?.label ?? log.contents,
        url: dateLink?.url ?? log.url,
      })
      currentDate = currentDate.add(1, 'day')
    }

    return acc
  }, {})
}

export const ActivityLog = memo(({ logs }: ActivityLogProps) => {
  const mergedActivityLog = getMergedActivityLog({ logs })

  return (
    <ActivityLogProvider>
      <section className="flex gap-5 w-full max-w-max">
        <article className="overflow-auto pt-3 pl-2 pr-2 pb-3 border border-gray-40 rounded-t-lg w-full max-w-[690px] h-32">
          <Compounds.MonthList />

          <div className="flex gap-2">
            <Compounds.WeekList />

            <Compounds.Table activityLog={mergedActivityLog} />
          </div>
        </article>

        <Compounds.YearList />
      </section>
    </ActivityLogProvider>
  )
})
