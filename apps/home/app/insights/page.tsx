import { Suspense } from 'react'
import { DiscordInsights } from '@/_shared'
import { getDiscordStats } from '../lib/discord/get-stats'

export const revalidate = 3600

async function DiscordInsightsSection() {
  const { stats, missingDates } = await getDiscordStats()
  const allDates = stats.dailyTotals.map((d) => d.date)

  return <DiscordInsights initialStats={stats} missingDates={missingDates} allDates={allDates} />
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
