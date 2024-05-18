'use client'

import { cn } from '@hamsurang/ui'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const GlobalNavigationBar = () => {
  return (
    <div>
      <LinkButton href="/">홈</LinkButton>
      <LinkButton href="/activity">활동</LinkButton>
    </div>
  )
}

const LinkButton = ({
  href,
  children,
}: {
  href: __next_route_internal_types__.RouteImpl<string>
  children: React.ReactNode
}) => {
  const pathname = usePathname()

  return (
    <Link
      className={cn(
        'px-4 py-2text-primaryhover:bg-primary/90hover:text-primary-foregroundfont-bold',
        href === pathname ? 'bg-primary text-primary-foreground' : '',
      )}
      href={href}
    >
      {children}
    </Link>
  )
}
