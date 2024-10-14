import type { PropsWithChildren } from 'react'

export const BannerBox = ({ children, href }: PropsWithChildren<{ href: string }>) => {
  return (
    <a href={href} className="relative aspect-[4] flex-grow rounded-lg overflow-hidden">
      {children}
    </a>
  )
}
