import '@hamsurang/ui/globals.css'
import { Inter } from 'next/font/google'
import { type PropsWithChildren, Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: PropsWithChildren): JSX.Element {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Suspense>{children}</Suspense>
      </body>
    </html>
  )
}
