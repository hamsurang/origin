'use client'

import '@hamsurang/ui/globals.css'

import { isValidEventOrigin } from '@hamsurang/utils'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { type PropsWithChildren, Suspense, useEffect } from 'react'
import { NAV_ITEMS, SideNav } from './_shared'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: PropsWithChildren): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const handleIncomingMessage = ({ origin, data }: MessageEvent) => {
      if (!isValidEventOrigin(origin)) {
        return
      }

      if (data.type === 'navigate' && router) {
        router.push(data.route)
        router.refresh()
      }
    }

    addEventListener('message', handleIncomingMessage)

    return () => {
      removeEventListener('message', handleIncomingMessage)
    }
  }, [router])

  return (
    <html lang="ko">
      <body className={inter.className}>
        <main className="flex gap-6 mobile:flex-col px-4 max-w-[1200px] mx-auto">
          <Suspense>
            {children}
            <SideNav items={NAV_ITEMS} />
          </Suspense>
        </main>
      </body>
    </html>
  )
}
