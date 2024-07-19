import { cn } from '@hamsurang/ui'
import { useActivityLogGraphYear } from '../ActivityLogGraph.provider'
import { getDateRange } from '../ActivityLogGraph.utils'
import { Tooltip, TooltipContent, TooltipTrigger } from './ActivityLogGraph.Tooltip'

const colorClasses = ['bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800']

const getCellColorClass = ({ count }: { count: number }) => {
  if (count === 0) {
    return 'bg-gray-200'
  }

  const colorIndex = Math.min(count, colorClasses.length) - 1
  return colorClasses[colorIndex]
}

export const ActivityLogGraphTable = ({
  dayDataMap,
}: {
  dayDataMap: Record<string, { count: number; contents: string[] }>
}) => {
  const context = useActivityLogGraphYear()
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
                return (
                  <td key={dayIndex} className="w-[10px] h-[10px]  max-w-[10px] max-h-[10px]" />
                )
              }

              const formattedDate = currentDate.format('YYYY-MM-DD')
              const dayData = dayDataMap[formattedDate]
              const contents = dayData?.contents.join(', ') ?? '없음'
              const displayContents = contents

              return (
                <Tooltip key={formattedDate}>
                  <TooltipTrigger>
                    <td
                      className={cn(
                        'w-[10px] h-[10px] cursor-pointer  max-w-[10px] max-h-[10px]',
                        getCellColorClass({ count: dayData?.count ?? 0 }),
                      )}
                      style={{ borderRadius: '2px' }}
                      aria-label={`활동 내역: ${contents}`}
                    />
                  </TooltipTrigger>
                  <TooltipContent className="Tooltip">
                    <section className="flex flex-col gap-1 bg-zinc-800 text-white p-2 rounded-[4px] w-full max-w-44">
                      <span>{`Date: ${currentDate.format('YYYY.MM.DD')}`}</span>
                      <span className="whitespace-pre-wrap">{`활동 내역: ${displayContents}`}</span>
                    </section>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
