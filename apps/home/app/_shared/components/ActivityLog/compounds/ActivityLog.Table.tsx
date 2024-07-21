import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, cn } from '@hamsurang/ui'
import { useActivityLogYear } from '../ActivityLog.provider'
import { getDateRange } from '../ActivityLog.utils'

const colorClasses = ['bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800']

const getCellColorClass = (activityCount: number) => {
  return colorClasses[Math.min(activityCount, colorClasses.length) - 1]
}

export const ActivityLogTable = ({
  activityLog,
}: {
  activityLog: Record<string, { contents: string[] }>
}) => {
  const context = useActivityLogYear()
  const [startDate, endDate] = getDateRange(context.selectedYear)
  const totalDays = endDate.diff(startDate, 'day') + 1

  return (
    <table className="table-fixed w-full max-w-xl border-separate">
      <tbody>
        {Array.from({ length: 7 }).map((_, dayOfWeek) => (
          <tr key={crypto.randomUUID()}>
            {Array.from({ length: Math.ceil(totalDays / 7) }).map((_, weekIndex) => {
              const dayIndex = weekIndex * 7 + dayOfWeek
              const currentDate = startDate.add(dayIndex, 'day')

              if (
                dayIndex >= totalDays ||
                (context.selectedYear && currentDate.year() < context.selectedYear)
              ) {
                return null
              }

              const formattedDate = currentDate.format('YYYY-MM-DD')
              const dayData = activityLog[formattedDate]

              if (!dayData) {
                return (
                  <TooltipProvider key={formattedDate}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <td
                          className="w-[10px] h-[10px] cursor-pointer  max-w-[10px] max-h-[10px] bg-gray-200 rounded-[2px]"
                          aria-label="활동 내역: 없음"
                        />
                      </TooltipTrigger>
                      <TooltipContent asChild>
                        <section className="flex flex-col gap-1 bg-zinc-800 text-white p-2 rounded-[4px] w-full max-w-44">
                          <span>{currentDate.format('YYYY.MM.DD')}</span>
                          <span className="whitespace-pre-wrap">활동 내역이 없습니다.</span>
                        </section>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              }

              const contents = dayData.contents.join(', ')

              return (
                <TooltipProvider key={formattedDate}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <td
                        className={cn(
                          'w-[10px] h-[10px] cursor-pointer  max-w-[10px] max-h-[10px] rounded-[2px]',
                          getCellColorClass(dayData.contents.length ?? 0),
                        )}
                        aria-label={`활동 내역: ${contents}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent asChild>
                      <section className="flex flex-col gap-1 bg-zinc-800 text-white p-2 rounded-[4px] w-full max-w-44">
                        <span>{currentDate.format('YYYY.MM.DD')}</span>
                        <span className="whitespace-pre-wrap">{contents}</span>
                      </section>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
