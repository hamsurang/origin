'use client'

import '@hamsurang/ui/globals.css'
import { type MessageData, isValidEventOrigin } from '@hamsurang/utils'
import { Inter } from 'next/font/google'
import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'
import { Header } from './_shared/components/Header'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: PropsWithChildren): JSX.Element {
  useEffect(() => {
    const handleIncomingMessage = ({ origin, data }: MessageEvent<MessageData>) => {
      if (!isValidEventOrigin(origin)) {
        return
      }

      if (data.type === 'routeChange') {
        history.replaceState({}, '', data.route)
      }
    }

    addEventListener('message', handleIncomingMessage)

    return () => {
      removeEventListener('message', handleIncomingMessage)
    }
  }, [])

  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        {children}
      </body>
    </html>
  )
}
