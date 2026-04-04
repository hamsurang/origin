import { Suspense } from 'react'
import { ActivityLog, DiscordActivity, RepositoryList } from '@/_shared'
import { DiscordActivitySkeleton } from '../_shared/components/DiscordActivity/DiscordActivitySkeleton'
import { getDiscordStats } from '../lib/discord/get-stats'
import { ACTIVITY_LOGS, REPOSITORY_ITEMS } from '../home.constants'

export const revalidate = 86400

async function DiscordActivitySection() {
  const stats = await getDiscordStats()
  return <DiscordActivity aggregatedStats={stats} />
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
    </section>
  )
}
