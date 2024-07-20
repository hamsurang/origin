import { cn } from '@hamsurang/ui'

const getSrOnlyClass = ({ weekDay }: { weekDay: string }) => {
  const isNonSrOnly = weekDay === 'Mon' || weekDay === 'Wed' || weekDay === 'Fri'
  return isNonSrOnly ? '' : 'sr-only'
}

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const ActivityLogWeekList = () => {
  return (
    <aside className="flex flex-col justify-evenly">
      {weekDays.map((weekDay) => (
        <span
          className={cn('text-xs text-right', getSrOnlyClass({ weekDay }))}
          key={`${weekDay}+${crypto.randomUUID()}`}
        >
          {weekDay}
        </span>
      ))}
    </aside>
  )
}
