'use client'

import dayjs from 'dayjs'
import { ActivityLogGraphProvider } from './ActivityLogGraph.provider'
import type { ActivityLogGraphProps } from './ActivityLogGraph.types'
import * as Compounds from './compounds'

const getDayDataMap = ({ data }: ActivityLogGraphProps) => {
  return data.reduce<Record<string, { count: number; contents: string[] }>>((acc, data) => {
    const startDate = dayjs(data.startDate)
    const endDate = dayjs(data.endDate)
    let currentDate = startDate

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      const date = currentDate.format('YYYY-MM-DD')
      if (!acc[date]) {
        acc[date] = { count: 0, contents: [] }
      }
      acc[date].count += 1
      acc[date].contents.push(data.contents)
      currentDate = currentDate.add(1, 'day')
    }

    return acc
  }, {})
}

export const ActivityLogGraph = ({ data }: ActivityLogGraphProps) => {
  const dayDataMap = getDayDataMap({ data })

  return (
    <ActivityLogGraphProvider>
      <section className="flex gap-5 w-full max-w-max">
        <article className="overflow-auto pt-3 pl-2 pr-2 pb-3 border border-gray-40 rounded-t-lg w-full max-w-[690px] h-32">
          <Compounds.MonthList />

          <div className="flex gap-2">
            <Compounds.WeekList />

            <Compounds.Table dayDataMap={dayDataMap} />
          </div>
        </article>

        <Compounds.YearList />
      </section>
    </ActivityLogGraphProvider>
  )
}
