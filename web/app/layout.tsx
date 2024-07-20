'use client'

import '@hamsurang/ui/globals.css'
import { onMessageHandler } from '@hamsurang/utils'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import { Header } from './_shared/components/Header'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  useEffect(() => {
    addEventListener('message', onMessageHandler)

    return () => {
      removeEventListener('message', onMessageHandler)
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
