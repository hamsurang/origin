'use client'

import '@hamsurang/ui/globals.css'
import { postMessageToParent } from '@hamsurang/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { type PropsWithChildren, useEffect } from 'react'

export default function DocsLayout({ children }: PropsWithChildren): JSX.Element {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    const fullRoute = `/wiki${pathname}?${searchParams}`

    postMessageToParent({
      type: 'routeChange',
      route: fullRoute,
    })
  }, [pathname, searchParams])

  return <>{children}</>
}
