'use client'

import '@hamsurang/ui/globals.css'
import { postMessageToParent } from '@hamsurang/utils'
import { Inter } from 'next/font/google'
import { usePathname, useSearchParams } from 'next/navigation'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { People } from './_shared'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
  readme,
  profile,
}: PropsWithChildren<{
  readme: React.ReactNode
  profile: React.ReactNode
}>): JSX.Element {
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
            {profile}
            <People />
          </aside>

          <section className="flex flex-col gap-4 flex-grow">
            {readme}
            {children}
          </section>
        </main>
      </body>
    </html>
  )
}
