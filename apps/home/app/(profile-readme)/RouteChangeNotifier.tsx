'use client'

import { postMessageToParent } from '@hamsurang/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const RouteChangeNotifier = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    const fullRoute = `/home${pathname}?${searchParams}`

    postMessageToParent({
      type: 'routeChange',
      route: fullRoute,
    })
  }, [pathname, searchParams])

  return null
}
