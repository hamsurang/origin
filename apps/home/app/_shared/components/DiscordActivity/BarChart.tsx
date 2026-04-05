'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, cn } from '@hamsurang/ui'

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

function formatDate(dateStr: string): string {
  return dateStr.slice(5)
}

export const BarChart = ({ data, height, className }: BarChartProps) => {
  const max = Math.max(...data.map((d) => d.value), 1)
  const firstDate = data.at(0)
  const lastDate = data.at(-1)

  return (
    <div className={className}>
      <TooltipProvider>
        <div className="flex items-end gap-[1px]" style={{ height }}>
          {data.map((d) => {
            const barHeight = d.value === 0 ? 0 : Math.max((d.value / max) * 100, 4)
            return (
              <Tooltip key={d.date}>
                <TooltipTrigger asChild>
                  <div
                    className="flex-1 min-w-[2px] rounded-t-[1px] cursor-pointer transition-[height,background-color] duration-500 ease-out"
                    style={{
                      height: `${barHeight}%`,
                      backgroundColor: getBarColor(d.value, max),
                    }}
                  />
                </TooltipTrigger>
                <TooltipContent asChild>
                  <div className="bg-zinc-800 text-white px-2 py-1 rounded text-xs">
                    <span className="font-medium">{d.date}</span>
                    <span className="ml-1.5 text-gray-300">{d.value} messages</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </div>
      </TooltipProvider>
      {firstDate && lastDate && (
        <div className="flex justify-between text-[10px] text-gray-400 mt-1">
          <span>{formatDate(firstDate.date)}</span>
          <span>{formatDate(lastDate.date)}</span>
        </div>
      )}
    </div>
  )
}
