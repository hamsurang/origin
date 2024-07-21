'use client'

import '@hamsurang/ui/globals.css'
import { postMessageToParent } from '@hamsurang/utils'
import { Inter } from 'next/font/google'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { People, Profile } from './_shared'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
  readme,
}: {
  children: React.ReactNode
  readme: React.ReactNode
}): JSX.Element {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const fullRoute = `/home${pathname}?${searchParams}`

    postMessageToParent({
      type: 'routeChange',
      route: fullRoute,
    })
  }, [pathname, searchParams])

  return (
    <html lang="ko">
      <body className={inter.className}>
        <main className="flex gap-6 mobile:flex-col px-4 mt-2 max-w-[1200px] mx-auto">
          <aside className="mobile:w-full w-[296px]">
            <Profile
              name="함수랑산악회"
              username="hamsurang"
              email="hamsurang@gmail.com"
              description="프론트엔드의 거대한 산을 등반하자"
            />
            <People />
          </aside>

          <section className="flex flex-col gap-4">
            {readme}
            {children}
          </section>
        </main>
      </body>
    </html>
  )
}
