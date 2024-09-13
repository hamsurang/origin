import { MBTIGraph } from './MBTI.graph'
import { MBTIInfo } from './MBTI.info'
import type { MBTI, MBTIProps } from './MBTI.types'

const sortedKeys = ['에너지_방향', '인식_기능', '판단_기능', '생활_양식'] as const

export const MBTIOverview = (props: MBTIProps) => {
  const mbtiInfos = sortedKeys.map((key) => props[key])
  const mbti = mbtiInfos.map(({ value }) => value).join('') as MBTI

  return (
    <div className="flex w-full items-center gap-2 border-slate-200 border-2 h-[400px] rounded-lg mobile:flex mobile:flex-col mobile:h-[auto]">
      <MBTIInfo mbti={mbti} />
      <div className="h-[100%] w-[2px] bg-slate-200 mobile:w-full mobile:h-[2px]" />
      <MBTIGraph mbtiInfos={mbtiInfos} />
    </div>
  )
}
