import { Suspense } from 'react'
import { DiscordInsights } from '@/_shared'
import { getDiscordStats } from '../lib/discord/get-stats'

export const revalidate = 86400

async function DiscordInsightsSection() {
  const stats = await getDiscordStats()
  return <DiscordInsights aggregatedStats={stats} />
}

export default function InsightsPage() {
  return (
    <section className="flex flex-col flex-1 gap-2 px-2">
      <Suspense fallback={<div className="animate-pulse h-64 bg-gray-100 rounded-md" />}>
        <DiscordInsightsSection />
      </Suspense>
    </section>
  )
}
