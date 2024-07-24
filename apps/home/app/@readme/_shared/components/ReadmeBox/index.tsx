import type { PropsWithChildren } from 'react'

export const ReadmeBox = ({ children }: PropsWithChildren) => (
  <div className="border-slate-200 border-2 rounded-lg p-[24px]">{children}</div>
)
