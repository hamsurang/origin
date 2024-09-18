import '@hamsurang/ui/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import type { PropsWithChildren } from 'react'
import { EventListener, Header } from './_shared/components'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '함수랑산악회',
  description: '함수랑산악회의 공식 홈페이지입니다.',
}

export default function RootLayout({ children }: PropsWithChildren): JSX.Element {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        <EventListener />
        {children}
      </body>
    </html>
  )
}
