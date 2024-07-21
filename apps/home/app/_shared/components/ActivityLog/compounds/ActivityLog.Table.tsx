import { useActivityLogYear } from '../ActivityLog.provider'
import { getDateRange } from '../ActivityLog.utils'
import { ActivityLogTableCell } from './ActivityLog.TableCell'

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
              const formattedDate = currentDate.format('YYYY-MM-DD')

              return (
                <ActivityLogTableCell
                  key={formattedDate}
                  dayData={activityLog[formattedDate]}
                  dayOfWeek={dayOfWeek}
                  totalDays={totalDays}
                  weekIndex={weekIndex}
                />
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
