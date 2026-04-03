'use client'

import { cn } from '@hamsurang/ui'

type BarChartProps = {
  data: { date: string; value: number }[]
  height: number
  className?: string
}

const GREEN_PALETTE = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'] as const

function getBarColor(value: number, max: number): string {
  if (value === 0 || max === 0) {
    return GREEN_PALETTE[0]
  }
  const ratio = value / max
  if (ratio <= 0.25) {
    return GREEN_PALETTE[1]
  }
  if (ratio <= 0.5) {
    return GREEN_PALETTE[2]
  }
  if (ratio <= 0.75) {
    return GREEN_PALETTE[3]
  }
  return GREEN_PALETTE[4]
}

export const BarChart = ({ data, height, className }: BarChartProps) => {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className={cn('flex items-end gap-[1px]', className)} style={{ height }}>
      {data.map((d) => {
        const barHeight = d.value === 0 ? 0 : Math.max((d.value / max) * 100, 4)
        return (
          <div
            key={d.date}
            className="flex-1 min-w-[2px] rounded-t-[1px]"
            style={{
              height: `${barHeight}%`,
              backgroundColor: getBarColor(d.value, max),
            }}
            title={`${d.date}: ${d.value} messages`}
          />
        )
      })}
    </div>
  )
}
