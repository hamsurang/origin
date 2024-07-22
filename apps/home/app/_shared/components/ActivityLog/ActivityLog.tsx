'use client'

import dayjs from 'dayjs'
import { memo } from 'react'
import { ActivityLogProvider } from './ActivityLog.provider'
import type { ActivityLogProps } from './ActivityLog.types'
import * as Compounds from './compounds'

const getMergedActivityLog = ({ logs }: ActivityLogProps) => {
  return logs.reduce<Record<string, { contents: string[] }>>((acc, log) => {
    const endDate = dayjs(log.endDate)
    let currentDate = dayjs(log.startDate)

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      const date = currentDate.format('YYYY-MM-DD')
      if (!acc[date]) {
        acc[date] = { contents: [] }
      }
      acc[date].contents.push(log.contents)
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
