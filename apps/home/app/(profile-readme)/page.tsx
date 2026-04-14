import { Suspense } from 'react'
import { ActivityLog, DiscordActivity, Followers, RepositoryList } from '@/_shared'
import { DiscordActivitySkeleton } from '../_shared/components/DiscordActivity/DiscordActivitySkeleton'
import { getDiscordStats } from '../lib/discord/get-stats'
import { ACTIVITY_LOGS, REPOSITORY_ITEMS } from '../home.constants'

export const revalidate = 3600

async function DiscordActivitySection() {
  const { stats, missingDates } = await getDiscordStats()
  return <DiscordActivity initialStats={stats} missingDates={missingDates} />
}

export default function Page() {
  return (
    <section className="flex flex-col flex-1 gap-2">
      <p className="mt-3">Discord Activity</p>
      <Suspense fallback={<DiscordActivitySkeleton />}>
        <DiscordActivitySection />
      </Suspense>
      <p className="mt-5">Pinned</p>
      <RepositoryList items={REPOSITORY_ITEMS} />
      <p className="mt-5">Activity Logs</p>
      <ActivityLog logs={ACTIVITY_LOGS} />
      <p className="mt-5">Followers</p>
      <Suspense
        fallback={
          <div className="border border-gray-200 rounded-md p-5 h-[400px] animate-pulse bg-gray-50" />
        }
      >
        <Followers />
      </Suspense>
    </section>
  )
}
