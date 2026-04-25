import '@hamsurang/ui/globals.css'
import type { PropsWithChildren } from 'react'
import { PeopleFollowersSection } from '../_shared/components/PeopleFollowersTabs/PeopleFollowersSection'
import { Playlist } from '../playlist/Playlist'
import { RouteChangeNotifier } from './RouteChangeNotifier'

export default function PeopleLayout({
  children,
  readme,
  profile,
}: PropsWithChildren<{
  readme: React.ReactNode
  profile: React.ReactNode
}>): JSX.Element {
  return (
    <main className="flex gap-6 mobile:flex-col px-4 mt-2 max-w-[1400px] mx-auto">
      <RouteChangeNotifier />
      <aside className="mobile:w-full w-[296px] shrink-0">
        {profile}
        <PeopleFollowersSection />
      </aside>

      <section className="flex flex-col gap-4 flex-grow min-w-0">
        {readme}
        {children}
      </section>

      <aside className="mobile:w-full w-[280px] shrink-0 relative">
        <Playlist />
      </aside>
    </main>
  )
}
