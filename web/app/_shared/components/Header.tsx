'use client'

import { HamsurangLogo } from '@hamsurang/icon'
import { usePathname, useSearchParams } from 'next/navigation'
import { GlobalNavigationBar } from './GlobalNavigationBar'

export const Header = () => {
  const pathname = usePathname()
  useSearchParams()

  return (
    <>
      <header className="flex flex-col gap-2 fixed bg-background px-4 pt-2 w-full">
        <div className="flex gap-4 items-center">
          <div className="size-8 rounded-full overflow-hidden">
            <HamsurangLogo width="100%" height="100%" />
          </div>
          <h1>함수랑산악회</h1>
          {pathname}
        </div>

        <GlobalNavigationBar />
      </header>

      <div className="h-[84px]" />
    </>
  )
}
