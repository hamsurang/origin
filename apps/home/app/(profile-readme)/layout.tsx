'use client'

import { BannerBox, People } from '@/_shared'
import '@hamsurang/ui/globals.css'
import { postMessageToParent } from '@hamsurang/utils'
import Image from 'next/image'
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
        <div className="flex gap-2 mobile:flex-col">
          <BannerBox href="https://hamsurang.notion.site/7bf061d6b6f14e80803ad00388299c81?pvs=4">
            <Image fill src="/clean-ping.png" alt="" />
          </BannerBox>
          <BannerBox href="https://hamsurang.notion.site/856b66d7d9824521acfc529e8e6b2f86?pvs=4">
            <Image fill src="/under-ping.png" alt="" />
          </BannerBox>
        </div>
        {readme}
        {children}
      </section>
    </main>
  )
}
