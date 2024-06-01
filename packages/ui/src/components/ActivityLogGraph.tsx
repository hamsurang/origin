'use client'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Tooltip } from 'react-tooltip'
import { cn } from '../lib/utils'
import { Button } from './button'

type ActivityLogGraphDataType = {
  date: string | Date
  contents: string
}

interface ActivityLogGraphProps {
  data: ActivityLogGraphDataType[]
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const getCellColorClass = ({ contents, date }: { contents?: string; date?: dayjs.Dayjs }) => {
  if (!contents) return 'bg-gray-200'
  const colorClasses = ['bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800']
  const colorIndex = date ? date.get('day') % colorClasses.length : 0
  return colorClasses[colorIndex]
}

const getMonthsInRange = ({
  startDate,
  endDate,
  selectedYear,
}: { startDate: dayjs.Dayjs; endDate: dayjs.Dayjs; selectedYear?: number }) => {
  const months = []
  const startOfMonth =
    startDate.endOf('month').diff(startDate, 'day') < 7
      ? startDate.add(1, 'month').startOf('month')
      : startDate.startOf('month')
  let currentMonth = selectedYear ? startDate.add(1, 'day').startOf('month') : startOfMonth
  const endOfMonth = endDate.endOf('month')

  while (currentMonth.isBefore(endOfMonth)) {
    months.push({
      name: currentMonth.format('MMM'),
      startIndex: currentMonth.diff(startDate, 'day'),
    })
    currentMonth = currentMonth.add(1, 'month')
  }
  return months
}

const calculateGapClass = ({
  index,
  leftDaysInFirstMonth,
}: { index: number; leftDaysInFirstMonth: number }) => {
  const baseMargin = 'mr-[30.5px]'
  if (index !== 0) return baseMargin

  const weeksInFirstMonth = Math.floor(leftDaysInFirstMonth / 7)
  const reducedMargin = ['mr-0', 'mr-2.5', 'mr-5', baseMargin][weeksInFirstMonth - 1] || baseMargin
  return reducedMargin
}

const getYearButtonArray = ({ thisYear }: { thisYear: dayjs.Dayjs }) => {
  const maxYear = thisYear.year()
  const yearDiff = maxYear - 2023
  return Array.from({ length: yearDiff + 1 }).map((_, index) => ({
    id: maxYear - index,
    year: maxYear - index,
  }))
}

const getButtonBgColor = ({ isSelected }: { isSelected: boolean }) => {
  return isSelected ? 'bg-blue-700 text-white hover:bg-blue-300' : ''
}

const getDayDataMap = ({ data }: { data: ActivityLogGraphDataType[] }) => {
  return data.reduce<Record<string, string>>((acc, data) => {
    const date = dayjs(data.date).format('YYYY-MM-DD')
    acc[date] = data.contents
    return acc
  }, {})
}

const getSrOnlyClass = ({ weekDay }: { weekDay: string }) => {
  const isNonSrOnly = weekDay === 'Mon' || weekDay === 'Wed' || weekDay === 'Fri'
  return isNonSrOnly ? '' : 'sr-only'
}

const ActivityLogGraph = ({ data }: ActivityLogGraphProps) => {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined)
  const today = dayjs()
  const startDate = selectedYear
    ? dayjs().year(selectedYear).startOf('year')
    : today.subtract(1, 'year').startOf('week')
  const endDate = selectedYear ? dayjs().year(selectedYear).endOf('year') : today
  const totalDays = endDate.diff(startDate, 'day') + 1
  const months = getMonthsInRange({ startDate, endDate, selectedYear })
  const leftDaysInFirstMonth = startDate.endOf('month').diff(startDate, 'day')
  const dayDataMap = getDayDataMap({ data })
  const yearButtonArray = getYearButtonArray({ thisYear: dayjs().startOf('year') })

  return (
    <section className="flex gap-5 w-full max-w-max">
      <article className="overflow-auto pt-3 pl-2 pr-2 pb-3 border border-gray-40 rounded-t-lg scrollbar-hide w-full max-w-3xl h-32">
        <header className="flex w-full max-w-2xl pl-8">
          {months.map((month, index) => {
            const gapClass = calculateGapClass({ index, leftDaysInFirstMonth })

            return (
              <span key={month.startIndex} className={`text-xs text-center ${gapClass}`}>
                {month.name}
              </span>
            )
          })}
        </header>
        <div className="flex gap-2">
          <aside className="flex flex-col justify-evenly">
            {weekDays.map((weekDay, i) => (
              <span
                className={cn('text-xs text-right', getSrOnlyClass({ weekDay }))}
                key={`${weekDay}+${crypto.randomUUID()}`}
              >
                {weekDay}
              </span>
            ))}
          </aside>

          <table className="table-fixed w-full max-w-xl border-separate">
            <tbody>
              {Array.from({ length: 7 }).map((_, dayOfWeek) => (
                <tr key={crypto.randomUUID()}>
                  {Array.from({ length: 53 }).map((_, weekIndex) => {
                    const dayIndex = weekIndex * 7 + dayOfWeek
                    const currentDate = startDate.add(dayIndex, 'day')
                    if (
                      dayIndex >= totalDays ||
                      (selectedYear && currentDate.year() < selectedYear)
                    )
                      return <td key={dayIndex} className="w-2.5 h-2.5  max-w-2.5 max-h-2.5" />

                    const formattedDate = currentDate.format('YYYY-MM-DD')
                    const contents = dayDataMap[formattedDate]

                    return (
                      <td
                        key={formattedDate}
                        className={cn(
                          'w-2.5 h-2.5 cursor-pointer  max-w-2.5 max-h-2.5',
                          getCellColorClass({ contents, date: currentDate }),
                        )}
                        style={{ borderRadius: '2px' }}
                        aria-label={`활동 내역: ${contents ?? '없음'}`}
                        data-tooltip-id="activity-tooltip"
                        data-tooltip-date={`Date: ${currentDate.format('YYYY.MM.DD')}`}
                        data-tooltip-contents={`활동 내역: ${contents ?? '없음'}`}
                        data-tooltip-place="top"
                      />
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Tooltip
          id="activity-tooltip"
          render={({ activeAnchor }) => (
            <section className="flex flex-col gap-1">
              <span>{activeAnchor?.getAttribute('data-tooltip-date')}</span>
              <span className="whitespace-pre-wrap">
                {activeAnchor?.getAttribute('data-tooltip-contents')}
              </span>
            </section>
          )}
        />
      </article>
      <nav className="flex-col flex gap-2 h-40 overflow-auto scrollbar-hide w-40 tablet:hidden">
        {yearButtonArray.map((button) => (
          <Button
            className={cn(
              'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground w-28 flex justify-start',
              getButtonBgColor({ isSelected: button.year === selectedYear }),
            )}
            key={button.id}
            onClick={() => setSelectedYear(button.year)}
          >
            {button.year}
          </Button>
        ))}
      </nav>
    </section>
  )
}

export { ActivityLogGraph, type ActivityLogGraphDataType, type ActivityLogGraphProps }
