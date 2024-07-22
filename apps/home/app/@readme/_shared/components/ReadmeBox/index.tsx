import type { PropsWithChildren } from 'react'

export const ReadmeBox = ({ children }: PropsWithChildren) => (
  <div className="border border-[#d0d7de] rounded-[6px] p-[24px]">{children}</div>
)
