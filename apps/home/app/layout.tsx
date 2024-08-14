'use client'

import '@hamsurang/ui/globals.css'
import { onMessageHandler } from '@hamsurang/utils'
import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { type PropsWithChildren, Suspense, useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: PropsWithChildren): JSX.Element {
  const router = useRouter()

  useEffect(() => {
    const handleIncomingMessage = (event: MessageEvent) => {
      onMessageHandler(event, router)
    }

    window.addEventListener('message', handleIncomingMessage)

    return () => {
      window.removeEventListener('message', handleIncomingMessage)
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
