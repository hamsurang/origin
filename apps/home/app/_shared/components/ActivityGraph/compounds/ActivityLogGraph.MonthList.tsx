import type { Dayjs } from 'dayjs'
import { useActivityLogGraphYear } from '../ActivityLogGraph.provider'
import { getDateRange } from '../ActivityLogGraph.utils'

const calculateGapClass = ({
  index,
  leftDaysInFirstMonth,
}: { index: number; leftDaysInFirstMonth: number }) => {
  const baseMargin = 'mr-[30.5px]'
  if (index !== 0) {
    return baseMargin
  }

  const weeksInFirstMonth = Math.floor(leftDaysInFirstMonth / 7)
  const reducedMargin = ['mr-0', 'mr-2.5', 'mr-5', baseMargin][weeksInFirstMonth - 1] || baseMargin
  return reducedMargin
}

const getMonthsInRange = ({
  startDate,
  endDate,
  selectedYear,
}: { startDate: Dayjs; endDate: Dayjs; selectedYear?: number }) => {
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

export const ActivityLogGraphMonthList = () => {
  const context = useActivityLogGraphYear()
  const [startDate, endDate] = getDateRange(context.selectedYear)

  const months = getMonthsInRange({ startDate, endDate, selectedYear: context.selectedYear })
  const leftDaysInFirstMonth = startDate.endOf('month').diff(startDate, 'day')

  return (
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
  )
}
