import { Button, cn } from '@hamsurang/ui'
import dayjs from 'dayjs'
import { useActivityLogYear } from '../ActivityLog.provider'

const START_YEAR = 2023

export const getYearButtonArray = () => {
  const thisYear = dayjs().startOf('year').year()

  const yearDiff = thisYear - START_YEAR + 1
  return Array.from({ length: yearDiff }).map((_, index) => {
    const year = thisYear - index
    return {
      id: year,
      year,
    }
  })
}

export const ActivityLogYearList = () => {
  const yearButtonArray = getYearButtonArray()
  const context = useActivityLogYear()

  return (
    <div className="flex-col flex gap-2 h-40 overflow-auto w-40 tablet:hidden">
      {yearButtonArray.map((button) => (
        <Button
          className={cn(
            'bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground w-28 flex justify-start',
            button.year === context.selectedYear ? 'bg-blue-700 text-white hover:bg-blue-300' : '',
          )}
          key={button.id}
          onClick={() => context.setSelectedYear(button.year)}
        >
          {button.year}
        </Button>
      ))}
    </div>
  )
}
