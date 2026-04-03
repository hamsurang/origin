import { DiscordInsights } from '@/_shared'
import { getDiscordStats } from '../lib/discord/get-stats'

export const revalidate = 86400

export default async function InsightsPage() {
  const stats = await getDiscordStats()

  return (
    <section className="flex flex-col flex-1 gap-2 px-2">
      <DiscordInsights aggregatedStats={stats} />
    </section>
  )
}
