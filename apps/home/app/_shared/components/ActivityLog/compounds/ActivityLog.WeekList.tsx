import { cn } from '@hamsurang/ui'

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const shouldHideWeekDay = (weekDay: (typeof weekDays)[number]) => {
  const visibleDays = ['Mon', 'Wed', 'Fri']
  return !visibleDays.includes(weekDay)
}

export const ActivityLogWeekList = () => {
  return (
    <aside className="flex flex-col justify-evenly">
      {weekDays.map((weekDay) => (
        <span
          className={cn('text-xs text-right', shouldHideWeekDay(weekDay) ? 'sr-only' : '')}
          key={`${weekDay}+${crypto.randomUUID()}`}
        >
          {weekDay}
        </span>
      ))}
    </aside>
  )
}
