'use client'

import { People } from '@/_shared'
import '@hamsurang/ui/globals.css'
import { postMessageToParent } from '@hamsurang/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { type PropsWithChildren, useEffect } from 'react'

export default function PeopleLayout({
  children,
  readme,
  profile,
}: PropsWithChildren<{
  readme: React.ReactNode
  profile: React.ReactNode
}>): JSX.Element {
  const searchParams = useSearchParams()
  const pathname = usePathname()

  useEffect(() => {
    const fullRoute = `/home${pathname}?${searchParams}`

    postMessageToParent({
      type: 'routeChange',
      route: fullRoute,
    })
  }, [pathname, searchParams])

  return (
    <main className="flex gap-6 mobile:flex-col px-4 mt-2 max-w-[1200px] mx-auto">
      <aside className="mobile:w-full w-[296px]">
        {profile}
        <People />
      </aside>

      <section className="flex flex-col gap-4 flex-grow">
        {readme}
        {children}
      </section>
    </main>
  )
}
