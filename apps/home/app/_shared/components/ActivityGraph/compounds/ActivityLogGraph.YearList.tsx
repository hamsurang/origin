import { Button, cn } from '@hamsurang/ui'
import dayjs from 'dayjs'
import { useActivityLogGraphYear } from '../ActivityLogGraph.provider'

const getButtonBgColor = ({ isSelected }: { isSelected: boolean }) => {
  return isSelected ? 'bg-blue-700 text-white hover:bg-blue-300' : ''
}

export const getYearButtonArray = () => {
  const thisYear = dayjs().startOf('year')

  const maxYear = thisYear.year()
  const yearDiff = maxYear - 2023
  return Array.from({ length: yearDiff + 1 }).map((_, index) => ({
    id: maxYear - index,
    year: maxYear - index,
  }))
}

export const ActivityLogGraphYearList = () => {
  const yearButtonArray = getYearButtonArray()
  const context = useActivityLogGraphYear()

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
