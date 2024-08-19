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
    const handleIncomingMessage = (event: MessageEvent) => {
      if (!isValidEventOrigin(event.origin)) {
        return
      }

      const { data } = event

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
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
