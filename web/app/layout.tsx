import '@hamsurang/ui/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GlobalNavigationBar } from './_shared/components/GlobalNavigationBar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '함수랑산악회',
  description: '함수랑산악회의 공식 홈페이지',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}): JSX.Element {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <GlobalNavigationBar />
        {children}
      </body>
    </html>
  )
}
