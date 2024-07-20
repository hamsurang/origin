'use client'

import { Book, Code } from '@hamsurang/icon'
import { cn } from '@hamsurang/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { PropsWithChildren } from 'react'

export const GlobalNavigationBar = () => {
  return (
    <nav className="flex gap-4">
      <LinkButton href="/">
        <Code />
        <span>홈</span>
      </LinkButton>
      <LinkButton href="/activity">
        <Book />
        <span>활동</span>
      </LinkButton>
    </nav>
  )
}

const LinkButton = ({
  href,
  children,
}: PropsWithChildren<{
  href: __next_route_internal_types__.RouteImpl<string>
}>) => {
  const pathname = usePathname()

  return (
    <Link
      className={cn(
        'flex gap-2 justify-center items-center border-b-4 px-2 py-1',
        href === pathname
          ? 'border-primary text-primary'
          : 'border-transparent text-muted-foreground',
      )}
      href={href}
    >
      {children}
    </Link>
  )
}
