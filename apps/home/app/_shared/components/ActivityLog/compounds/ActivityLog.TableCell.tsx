import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, cn } from '@hamsurang/ui'
import type { Dayjs } from 'dayjs'
import type { MergedContentItem } from '../ActivityLog'
import { useActivityLogYear } from '../ActivityLog.provider'

export const ActivityLogTableCell = ({
  dayIndex,
  dayData,
  totalDays,
  currentDate,
}: {
  dayIndex: number
  dayData: { contents: MergedContentItem[] } | undefined
  totalDays: number
  currentDate: Dayjs
}) => {
  const context = useActivityLogYear()

  const isOutOfRange =
    dayIndex >= totalDays || (context.selectedYear && currentDate.year() < context.selectedYear)

  if (isOutOfRange) {
    return null
  }

  if (!dayData) {
    return <Empty currentDate={currentDate} />
  }

  return <Content currentDate={currentDate} dayData={dayData} />
}

const colorClasses = ['bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800']

const getCellColorClass = (activityCount: number) => {
  return colorClasses[Math.min(activityCount, colorClasses.length) - 1]
}

const Empty = ({
  currentDate,
}: {
  currentDate: Dayjs
}) => {
  return (
    <TooltipProvider>
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

const Content = ({
  currentDate,
  dayData,
}: {
  currentDate: Dayjs
  dayData: { contents: MergedContentItem[] }
}) => {
  const label = dayData.contents.map((c) => c.text).join(',\n')

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <td
            className={cn(
              'w-[10px] h-[10px] cursor-pointer  max-w-[10px] max-h-[10px] rounded-[2px]',
              getCellColorClass(dayData.contents.length ?? 0),
            )}
            aria-label={`활동 내역: ${label}`}
          />
        </TooltipTrigger>
        <TooltipContent asChild>
          <section className="flex flex-col gap-1 bg-zinc-800 text-white p-2 rounded-[4px] w-full max-w-44">
            <span>{currentDate.format('YYYY.MM.DD')}</span>
            {dayData.contents.map((item) =>
              item.url ? (
                <a
                  key={item.text}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-pre-wrap text-blue-300 underline"
                >
                  {item.text}
                </a>
              ) : (
                <span key={item.text} className="whitespace-pre-wrap">
                  {item.text}
                </span>
              ),
            )}
          </section>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
