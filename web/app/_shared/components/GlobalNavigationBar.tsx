'use client'

import { URL } from '@hamsurang/constants'
import { Book, Code } from '@hamsurang/icon'
import { cn } from '@hamsurang/ui'
import { postMessageToChildren } from '@hamsurang/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { MouseEventHandler, PropsWithChildren } from 'react'

export const GlobalNavigationBar = () => {
  return (
    <nav className="flex gap-4">
      <LinkButton
        href="/home"
        onClick={() =>
          postMessageToChildren({
            type: 'navigate',
            route: '/',
            title: 'home',
            targetOrigin: URL.HOME,
          })
        }
      >
        <Code />
        <span>홈</span>
      </LinkButton>
      <LinkButton
        href="/wiki"
        onClick={() =>
          postMessageToChildren({
            type: 'navigate',
            route: '/',
            title: 'wiki',
            targetOrigin: URL.WIKI,
          })
        }
      >
        <Book />
        <span>위키</span>
      </LinkButton>
    </nav>
  )
}

const LinkButton = ({
  href,
  children,
  onClick,
}: PropsWithChildren<{
  href: __next_route_internal_types__.RouteImpl<string>
  onClick: MouseEventHandler<HTMLAnchorElement>
}>) => {
  const pathname = usePathname()

  const isActive = pathname.startsWith(href)

  return (
    <Link
      className={cn(
        'flex gap-2 justify-center items-center border-b-4 px-2 py-1',
        isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground',
      )}
      href={href}
      onClick={onClick}
    >
      {children}
    </Link>
  )
}
