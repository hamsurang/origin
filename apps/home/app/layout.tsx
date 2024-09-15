'use client'

import '@hamsurang/ui/globals.css'
import { isValidEventOrigin } from '@hamsurang/utils'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { type PropsWithChildren, Suspense, useEffect } from 'react'

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
        <main className="pt-iframe-padding">
          <Suspense>{children}</Suspense>
        </main>
      </body>
    </html>
  )
}
