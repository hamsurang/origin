# Discord Activity & Insights Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Discord 서버 활동 데이터를 매일 수집하여 GitHub Contributors 스타일 바 차트 + 기여자 랭킹으로 origin 홈페이지에 시각화한다.

**Architecture:** GitHub Action이 매일 Discord REST API를 호출해 일별 메시지/사용자 데이터를 JSON 파일에 적재하고 커밋한다. Next.js 앱은 이 JSON을 정적 import하여 빌드 타임에 집계 후 렌더링한다. Main 페이지에 요약 위젯(Top 3), `/insights`에 전체 기여자 목록을 표시한다.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Discord REST API v10, GitHub Actions

**Spec:** `docs/superpowers/specs/2026-04-03-discord-activity-insights-design.md`

---

## File Structure

```
apps/home/app/
├── _data/
│   └── discord-stats.json                          ← sample data (GH Action이 매일 업데이트)
├── _shared/
│   └── components/
│       ├── DiscordActivity/
│       │   ├── index.ts                            ← barrel exports
│       │   ├── DiscordActivity.types.ts            ← 타입 정의
│       │   ├── DiscordActivity.utils.ts            ← 집계 유틸리티 (순수 함수)
│       │   ├── BarChart.tsx                         ← 재사용 바 차트
│       │   ├── ContributorRow.tsx                   ← 기여자 행
│       │   ├── DiscordActivity.tsx                  ← Main 위젯
│       │   └── DiscordInsights.tsx                  ← Insights 전체 페이지
│       └── index.ts                                ← export 추가
├── (profile-readme)/
│   └── page.tsx                                    ← 수정: Discord Activity 위젯 최상단 추가
├── insights/
│   └── page.tsx                                    ← 신규: Insights 라우트

scripts/
└── collect-discord-stats.mjs                       ← Discord 데이터 수집 스크립트

.github/workflows/
└── discord-stats.yml                               ← daily cron workflow
```

---

## Task 1: Types and Sample Data

**Files:**
- Create: `apps/home/app/_shared/components/DiscordActivity/DiscordActivity.types.ts`
- Create: `apps/home/app/_data/discord-stats.json`

- [ ] **Step 1: Create types file**

```ts
// apps/home/app/_shared/components/DiscordActivity/DiscordActivity.types.ts

export type DailyContributor = {
  id: string
  username: string
  avatar: string | null
  messages: number
}

export type DailyStats = {
  date: string
  messages: number
  participants: number
  contributors: DailyContributor[]
}

export type DiscordStats = {
  guildId: string
  lastUpdated: string
  daily: DailyStats[]
}

export type RankedContributor = {
  id: string
  username: string
  avatar: string | null
  totalMessages: number
  dailyMessages: { date: string; value: number }[]
}

export type AggregatedStats = {
  totalMessages: number
  totalContributors: number
  dailyTotals: { date: string; value: number }[]
  rankedContributors: RankedContributor[]
}
```

- [ ] **Step 2: Create sample data JSON**

```json
// apps/home/app/_data/discord-stats.json
{
  "guildId": "0000000000",
  "lastUpdated": "2026-04-03T15:00:00Z",
  "daily": [
    {
      "date": "2026-03-01",
      "messages": 28,
      "participants": 12,
      "contributors": [
        { "id": "1001", "username": "minsoo-web", "avatar": null, "messages": 8 },
        { "id": "1002", "username": "oilater", "avatar": null, "messages": 6 },
        { "id": "1003", "username": "dev-seongjoo", "avatar": null, "messages": 5 },
        { "id": "1004", "username": "se-zero", "avatar": null, "messages": 4 },
        { "id": "1005", "username": "kim-jieun", "avatar": null, "messages": 3 },
        { "id": "1006", "username": "lee-hyun", "avatar": null, "messages": 2 }
      ]
    },
    {
      "date": "2026-03-02",
      "messages": 35,
      "participants": 14,
      "contributors": [
        { "id": "1002", "username": "oilater", "avatar": null, "messages": 10 },
        { "id": "1001", "username": "minsoo-web", "avatar": null, "messages": 7 },
        { "id": "1004", "username": "se-zero", "avatar": null, "messages": 6 },
        { "id": "1003", "username": "dev-seongjoo", "avatar": null, "messages": 5 },
        { "id": "1005", "username": "kim-jieun", "avatar": null, "messages": 4 },
        { "id": "1007", "username": "park-joon", "avatar": null, "messages": 3 }
      ]
    },
    {
      "date": "2026-03-03",
      "messages": 42,
      "participants": 16,
      "contributors": [
        { "id": "1001", "username": "minsoo-web", "avatar": null, "messages": 12 },
        { "id": "1003", "username": "dev-seongjoo", "avatar": null, "messages": 9 },
        { "id": "1002", "username": "oilater", "avatar": null, "messages": 7 },
        { "id": "1005", "username": "kim-jieun", "avatar": null, "messages": 6 },
        { "id": "1004", "username": "se-zero", "avatar": null, "messages": 5 },
        { "id": "1006", "username": "lee-hyun", "avatar": null, "messages": 3 }
      ]
    },
    {
      "date": "2026-03-04",
      "messages": 18,
      "participants": 10,
      "contributors": [
        { "id": "1002", "username": "oilater", "avatar": null, "messages": 5 },
        { "id": "1001", "username": "minsoo-web", "avatar": null, "messages": 4 },
        { "id": "1003", "username": "dev-seongjoo", "avatar": null, "messages": 3 },
        { "id": "1005", "username": "kim-jieun", "avatar": null, "messages": 3 },
        { "id": "1004", "username": "se-zero", "avatar": null, "messages": 2 },
        { "id": "1007", "username": "park-joon", "avatar": null, "messages": 1 }
      ]
    },
    {
      "date": "2026-03-05",
      "messages": 55,
      "participants": 18,
      "contributors": [
        { "id": "1001", "username": "minsoo-web", "avatar": null, "messages": 15 },
        { "id": "1002", "username": "oilater", "avatar": null, "messages": 12 },
        { "id": "1003", "username": "dev-seongjoo", "avatar": null, "messages": 10 },
        { "id": "1004", "username": "se-zero", "avatar": null, "messages": 8 },
        { "id": "1005", "username": "kim-jieun", "avatar": null, "messages": 6 },
        { "id": "1006", "username": "lee-hyun", "avatar": null, "messages": 4 }
      ]
    }
  ]
}
```

- [ ] **Step 3: Commit**

```bash
git add apps/home/app/_shared/components/DiscordActivity/DiscordActivity.types.ts apps/home/app/_data/discord-stats.json
git commit -m "feat(discord-activity): add types and sample data"
```

---

## Task 2: Data Aggregation Utilities

**Files:**
- Create: `apps/home/app/_shared/components/DiscordActivity/DiscordActivity.utils.ts`

- [ ] **Step 1: Create aggregation utility**

이 함수는 raw JSON 데이터를 컴포넌트가 소비할 수 있는 형태로 변환한다.

```ts
// apps/home/app/_shared/components/DiscordActivity/DiscordActivity.utils.ts

import type { AggregatedStats, DiscordStats, RankedContributor } from './DiscordActivity.types'

const DISCORD_CDN = 'https://cdn.discordapp.com'

export function getAvatarUrl(userId: string, avatarHash: string | null): string {
  if (!avatarHash) {
    const index = Number(BigInt(userId) >> 22n) % 6
    return `${DISCORD_CDN}/embed/avatars/${index}.png`
  }
  return `${DISCORD_CDN}/avatars/${userId}/${avatarHash}.png`
}

export function aggregateStats(stats: DiscordStats): AggregatedStats {
  const dailyTotals = stats.daily.map((d) => ({
    date: d.date,
    value: d.messages,
  }))

  const totalMessages = stats.daily.reduce((sum, d) => sum + d.messages, 0)

  // Aggregate per-contributor totals across all days
  const contributorMap = new Map<
    string,
    { username: string; avatar: string | null; totalMessages: number; daily: Map<string, number> }
  >()

  for (const day of stats.daily) {
    for (const c of day.contributors) {
      const existing = contributorMap.get(c.id)
      if (existing) {
        existing.totalMessages += c.messages
        existing.daily.set(day.date, c.messages)
        // Update username/avatar to latest
        existing.username = c.username
        existing.avatar = c.avatar
      } else {
        const daily = new Map<string, number>()
        daily.set(day.date, c.messages)
        contributorMap.set(c.id, {
          username: c.username,
          avatar: c.avatar,
          totalMessages: c.messages,
          daily,
        })
      }
    }
  }

  // Build ranked list sorted by totalMessages desc
  const allDates = stats.daily.map((d) => d.date)
  const rankedContributors: RankedContributor[] = Array.from(contributorMap.entries())
    .map(([id, data]) => ({
      id,
      username: data.username,
      avatar: data.avatar,
      totalMessages: data.totalMessages,
      dailyMessages: allDates.map((date) => ({
        date,
        value: data.daily.get(date) ?? 0,
      })),
    }))
    .sort((a, b) => b.totalMessages - a.totalMessages)

  return {
    totalMessages,
    totalContributors: contributorMap.size,
    dailyTotals,
    rankedContributors,
  }
}
```

- [ ] **Step 2: Verify with build**

Run: `cd apps/home && npx tsc --noEmit`
Expected: No type errors

- [ ] **Step 3: Commit**

```bash
git add apps/home/app/_shared/components/DiscordActivity/DiscordActivity.utils.ts
git commit -m "feat(discord-activity): add data aggregation utilities"
```

---

## Task 3: BarChart Component

**Files:**
- Create: `apps/home/app/_shared/components/DiscordActivity/BarChart.tsx`

- [ ] **Step 1: Create BarChart component**

```tsx
// apps/home/app/_shared/components/DiscordActivity/BarChart.tsx

'use client'

import { cn } from '@hamsurang/ui'

type BarChartProps = {
  data: { date: string; value: number }[]
  height: number
  className?: string
}

const GREEN_PALETTE = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'] as const

function getBarColor(value: number, max: number): string {
  if (value === 0 || max === 0) return GREEN_PALETTE[0]
  const ratio = value / max
  if (ratio <= 0.25) return GREEN_PALETTE[1]
  if (ratio <= 0.5) return GREEN_PALETTE[2]
  if (ratio <= 0.75) return GREEN_PALETTE[3]
  return GREEN_PALETTE[4]
}

export const BarChart = ({ data, height, className }: BarChartProps) => {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div
      className={cn('flex items-end gap-[1px]', className)}
      style={{ height }}
    >
      {data.map((d) => {
        const barHeight = d.value === 0 ? 0 : Math.max((d.value / max) * 100, 4)
        return (
          <div
            key={d.date}
            className="flex-1 min-w-[2px] rounded-t-[1px]"
            style={{
              height: `${barHeight}%`,
              backgroundColor: getBarColor(d.value, max),
            }}
            title={`${d.date}: ${d.value} messages`}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/home/app/_shared/components/DiscordActivity/BarChart.tsx
git commit -m "feat(discord-activity): add BarChart component"
```

---

## Task 4: ContributorRow Component

**Files:**
- Create: `apps/home/app/_shared/components/DiscordActivity/ContributorRow.tsx`

- [ ] **Step 1: Create ContributorRow component**

```tsx
// apps/home/app/_shared/components/DiscordActivity/ContributorRow.tsx

'use client'

import { BarChart } from './BarChart'
import type { RankedContributor } from './DiscordActivity.types'
import { getAvatarUrl } from './DiscordActivity.utils'

type ContributorRowProps = {
  rank: number
  contributor: RankedContributor
  barHeight: number
  avatarSize: number
}

export const ContributorRow = ({
  rank,
  contributor,
  barHeight,
  avatarSize,
}: ContributorRowProps) => {
  const avatarUrl = getAvatarUrl(contributor.id, contributor.avatar)

  return (
    <div className="flex items-center gap-2.5 px-3.5 py-2.5 border-b border-gray-100 last:border-b-0">
      <span className="w-4 text-right text-xs font-semibold text-gray-500 shrink-0">
        #{rank}
      </span>
      <img
        src={avatarUrl}
        alt={contributor.username}
        className="rounded-full shrink-0"
        style={{ width: avatarSize, height: avatarSize }}
      />
      <div className="w-[90px] shrink-0">
        <div className="text-xs font-semibold truncate">{contributor.username}</div>
        <div className="text-[10px] text-gray-500">{contributor.totalMessages} msgs</div>
      </div>
      <BarChart
        data={contributor.dailyMessages}
        height={barHeight}
        className="flex-1"
      />
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/home/app/_shared/components/DiscordActivity/ContributorRow.tsx
git commit -m "feat(discord-activity): add ContributorRow component"
```

---

## Task 5: DiscordActivity Main Widget

**Files:**
- Create: `apps/home/app/_shared/components/DiscordActivity/DiscordActivity.tsx`

- [ ] **Step 1: Create main widget**

```tsx
// apps/home/app/_shared/components/DiscordActivity/DiscordActivity.tsx

'use client'

import Link from 'next/link'
import { memo, useMemo } from 'react'
import { BarChart } from './BarChart'
import { ContributorRow } from './ContributorRow'
import type { DiscordStats } from './DiscordActivity.types'
import { aggregateStats } from './DiscordActivity.utils'

type DiscordActivityProps = {
  stats: DiscordStats
}

export const DiscordActivity = memo(({ stats }: DiscordActivityProps) => {
  const aggregated = useMemo(() => aggregateStats(stats), [stats])
  const top3 = aggregated.rankedContributors.slice(0, 3)

  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      {/* Header + Chart */}
      <div className="px-3.5 pt-3.5">
        <div className="flex justify-between items-center mb-2.5">
          <span className="text-sm font-semibold">Discord Activity</span>
          <Link href="/insights" className="text-xs text-blue-600 hover:underline">
            Insights →
          </Link>
        </div>

        <BarChart data={aggregated.dailyTotals} height={48} className="mb-1.5" />

        <div className="flex gap-4 text-xs text-gray-500 mb-3">
          <span>
            💬 <strong className="text-gray-900">{aggregated.totalMessages.toLocaleString()}</strong> messages
          </span>
          <span>
            👥 <strong className="text-gray-900">{aggregated.totalContributors}</strong> contributors
          </span>
        </div>
      </div>

      {/* Top 3 contributors */}
      <div className="border-t border-gray-200">
        {top3.map((contributor, i) => (
          <ContributorRow
            key={contributor.id}
            rank={i + 1}
            contributor={contributor}
            barHeight={28}
            avatarSize={24}
          />
        ))}

        <div className="py-2 text-center bg-gray-50">
          <Link href="/insights" className="text-xs text-blue-600 hover:underline">
            View all {aggregated.totalContributors} contributors →
          </Link>
        </div>
      </div>
    </div>
  )
})
```

- [ ] **Step 2: Commit**

```bash
git add apps/home/app/_shared/components/DiscordActivity/DiscordActivity.tsx
git commit -m "feat(discord-activity): add main widget with top 3 contributors"
```

---

## Task 6: Barrel Exports and Main Page Integration

**Files:**
- Create: `apps/home/app/_shared/components/DiscordActivity/index.ts`
- Modify: `apps/home/app/_shared/components/index.ts`
- Modify: `apps/home/app/(profile-readme)/page.tsx`

- [ ] **Step 1: Create barrel export**

```ts
// apps/home/app/_shared/components/DiscordActivity/index.ts

export { DiscordActivity } from './DiscordActivity'
export { DiscordInsights } from './DiscordInsights'
export type { DiscordStats } from './DiscordActivity.types'
```

Note: `DiscordInsights`는 Task 7에서 생성. 타입 에러를 피하기 위해 Task 7 완료 후 이 export 줄을 추가해도 된다. 또는 빈 placeholder를 먼저 만들어도 된다.

- [ ] **Step 2: Add DiscordActivity to components barrel**

`apps/home/app/_shared/components/index.ts`에 한 줄 추가:

```ts
export * from './DiscordActivity'
```

기존 export 줄들 아래에 추가한다.

- [ ] **Step 3: Update main page**

`apps/home/app/(profile-readme)/page.tsx`를 다음으로 교체:

```tsx
// apps/home/app/(profile-readme)/page.tsx

import { ActivityLog, DiscordActivity, RepositoryList } from '@/_shared'
import discordStats from '../_data/discord-stats.json'
import { ACTIVITY_LOGS, REPOSITORY_ITEMS } from '../home.constants'

export default function Page() {
  return (
    <section className="flex flex-col flex-1 gap-2">
      <p className="mt-3">Discord Activity</p>
      <DiscordActivity stats={discordStats} />
      <p className="mt-5">Pinned</p>
      <RepositoryList items={REPOSITORY_ITEMS} />
      <p className="mt-5">Activity Logs</p>
      <ActivityLog logs={ACTIVITY_LOGS} />
    </section>
  )
}
```

- [ ] **Step 4: Verify dev server**

Run: `cd apps/home && pnpm dev`

브라우저에서 `http://localhost:3002` 접속. Discord Activity 위젯이 Pinned 위에 표시되는지 확인:
- aggregate 바 차트 렌더링
- 총 메시지/기여자 수 표시
- Top 3 기여자 행(#1, #2, #3)에 미니 바 차트 표시
- "View all N contributors →" 링크 표시

- [ ] **Step 5: Commit**

```bash
git add apps/home/app/_shared/components/DiscordActivity/index.ts apps/home/app/_shared/components/index.ts apps/home/app/\(profile-readme\)/page.tsx
git commit -m "feat(discord-activity): integrate widget into main page"
```

---

## Task 7: Insights Page

**Files:**
- Create: `apps/home/app/_shared/components/DiscordActivity/DiscordInsights.tsx`
- Create: `apps/home/app/insights/page.tsx`

- [ ] **Step 1: Create DiscordInsights component**

```tsx
// apps/home/app/_shared/components/DiscordActivity/DiscordInsights.tsx

'use client'

import { memo, useMemo } from 'react'
import { BarChart } from './BarChart'
import { ContributorRow } from './ContributorRow'
import type { DiscordStats } from './DiscordActivity.types'
import { aggregateStats } from './DiscordActivity.utils'

type DiscordInsightsProps = {
  stats: DiscordStats
}

export const DiscordInsights = memo(({ stats }: DiscordInsightsProps) => {
  const aggregated = useMemo(() => aggregateStats(stats), [stats])

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-base font-semibold">Discord Insights</span>
        <div className="text-xs text-gray-500">
          💬 <strong className="text-gray-900">{aggregated.totalMessages.toLocaleString()}</strong>
          {' · '}
          👥 <strong className="text-gray-900">{aggregated.totalContributors}</strong>
        </div>
      </div>

      {/* Aggregate chart */}
      <div className="border border-gray-200 rounded-md p-3.5 mb-4">
        <BarChart data={aggregated.dailyTotals} height={80} />
      </div>

      {/* Contributors */}
      <span className="text-sm font-semibold mb-2 block">Contributors</span>
      <div className="border border-gray-200 rounded-md overflow-hidden">
        {aggregated.rankedContributors.map((contributor, i) => (
          <ContributorRow
            key={contributor.id}
            rank={i + 1}
            contributor={contributor}
            barHeight={32}
            avatarSize={28}
          />
        ))}
      </div>
    </div>
  )
})
```

- [ ] **Step 2: Create Insights page route**

```tsx
// apps/home/app/insights/page.tsx

import { DiscordInsights } from '@/_shared'
import discordStats from '../_data/discord-stats.json'

export default function InsightsPage() {
  return (
    <section className="flex flex-col flex-1 gap-2 px-2">
      <DiscordInsights stats={discordStats} />
    </section>
  )
}
```

- [ ] **Step 3: Update barrel export (if not already done)**

`apps/home/app/_shared/components/DiscordActivity/index.ts`에 `DiscordInsights` export가 있는지 확인. Task 6 Step 1에서 이미 추가했다면 스킵.

- [ ] **Step 4: Verify dev server**

Run: `cd apps/home && pnpm dev`

브라우저에서 `http://localhost:3002/insights` 접속:
- 큰 aggregate 바 차트 렌더링
- 전체 기여자 목록 (#1~#N) 표시
- 각 행에 아바타 + 이름 + 메시지 수 + 미니 바 차트

메인 페이지에서 "Insights →" 또는 "View all N contributors →" 클릭 시 insights 페이지로 이동하는지 확인.

- [ ] **Step 5: Commit**

```bash
git add apps/home/app/_shared/components/DiscordActivity/DiscordInsights.tsx apps/home/app/insights/page.tsx
git commit -m "feat(discord-activity): add insights page with full contributor list"
```

---

## Task 8: Discord Stats Collection Script

**Files:**
- Create: `scripts/collect-discord-stats.mjs`

- [ ] **Step 1: Create collection script**

```js
// scripts/collect-discord-stats.mjs

import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const DISCORD_API = 'https://discord.com/api/v10'
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const GUILD_ID = process.env.DISCORD_GUILD_ID
const DATA_PATH = join(import.meta.dirname, '..', 'apps', 'home', 'app', '_data', 'discord-stats.json')

// Text-based channel types: GUILD_TEXT(0), GUILD_ANNOUNCEMENT(5), GUILD_FORUM(15), PUBLIC_THREAD(11), PRIVATE_THREAD(12)
const TEXT_CHANNEL_TYPES = new Set([0, 5, 11, 12, 15])

if (!BOT_TOKEN || !GUILD_ID) {
  console.error('Missing DISCORD_BOT_TOKEN or DISCORD_GUILD_ID environment variables')
  process.exit(1)
}

async function discordFetch(path) {
  const url = `${DISCORD_API}${path}`
  const res = await fetch(url, {
    headers: { Authorization: `Bot ${BOT_TOKEN}` },
  })

  if (res.status === 429) {
    const retryAfter = Number(res.headers.get('retry-after') || '5')
    console.warn(`Rate limited, waiting ${retryAfter}s...`)
    await new Promise((r) => setTimeout(r, retryAfter * 1000))
    return discordFetch(path)
  }

  if (!res.ok) {
    throw new Error(`Discord API error: ${res.status} ${res.statusText} for ${path}`)
  }

  return res.json()
}

function snowflakeFromTimestamp(timestamp) {
  return String((BigInt(timestamp) - 1420070400000n) << 22n)
}

async function fetchChannelMessages(channelId, afterSnowflake) {
  const messages = []
  let lastId = afterSnowflake

  while (true) {
    const batch = await discordFetch(
      `/channels/${channelId}/messages?after=${lastId}&limit=100`
    )

    if (batch.length === 0) break

    messages.push(...batch)

    if (batch.length < 100) break

    // Messages are returned newest-first, so the smallest ID is last
    lastId = batch[batch.length - 1].id
  }

  return messages
}

async function collectDailyStats() {
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  const dateStr = yesterday.toISOString().split('T')[0]

  // Start of yesterday UTC
  const startOfDay = new Date(`${dateStr}T00:00:00Z`)
  const endOfDay = new Date(`${dateStr}T23:59:59.999Z`)
  const afterSnowflake = snowflakeFromTimestamp(startOfDay.getTime())

  console.log(`Collecting stats for ${dateStr}...`)

  // Fetch channels
  const channels = await discordFetch(`/guilds/${GUILD_ID}/channels`)
  const textChannels = channels.filter((c) => TEXT_CHANNEL_TYPES.has(c.type))
  console.log(`Found ${textChannels.length} text channels`)

  // Fetch messages from each channel
  const contributorMap = new Map()
  let totalMessages = 0

  for (const channel of textChannels) {
    try {
      const messages = await fetchChannelMessages(channel.id, afterSnowflake)

      // Filter to messages within the target date
      const dayMessages = messages.filter((m) => {
        const ts = new Date(m.timestamp)
        return ts >= startOfDay && ts <= endOfDay && !m.author.bot
      })

      totalMessages += dayMessages.length

      for (const msg of dayMessages) {
        const { id, username, avatar } = msg.author
        const existing = contributorMap.get(id)
        if (existing) {
          existing.messages += 1
          existing.username = username
          existing.avatar = avatar
        } else {
          contributorMap.set(id, { id, username, avatar, messages: 1 })
        }
      }
    } catch (err) {
      console.warn(`Skipping channel ${channel.name} (${channel.id}): ${err.message}`)
    }
  }

  const contributors = Array.from(contributorMap.values()).sort(
    (a, b) => b.messages - a.messages
  )

  console.log(`${dateStr}: ${totalMessages} messages from ${contributors.length} contributors`)

  return {
    date: dateStr,
    messages: totalMessages,
    participants: contributors.length,
    contributors,
  }
}

async function main() {
  // Read existing data
  let data
  try {
    const raw = await readFile(DATA_PATH, 'utf-8')
    data = JSON.parse(raw)
  } catch {
    data = { guildId: GUILD_ID, lastUpdated: '', daily: [] }
  }

  const todayStats = await collectDailyStats()

  // Avoid duplicate entries
  const existingIndex = data.daily.findIndex((d) => d.date === todayStats.date)
  if (existingIndex >= 0) {
    data.daily[existingIndex] = todayStats
  } else {
    data.daily.push(todayStats)
  }

  // Sort by date ascending
  data.daily.sort((a, b) => a.date.localeCompare(b.date))

  // Keep last 365 days
  if (data.daily.length > 365) {
    data.daily = data.daily.slice(-365)
  }

  data.guildId = GUILD_ID
  data.lastUpdated = new Date().toISOString()

  await writeFile(DATA_PATH, JSON.stringify(data, null, 2) + '\n')
  console.log(`Saved to ${DATA_PATH}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
```

- [ ] **Step 2: Local test (optional, requires env vars)**

```bash
DISCORD_BOT_TOKEN=<your-token> DISCORD_GUILD_ID=<your-guild-id> node scripts/collect-discord-stats.mjs
```

Expected: `discord-stats.json` 파일에 어제 날짜의 데이터가 추가됨.

- [ ] **Step 3: Commit**

```bash
git add scripts/collect-discord-stats.mjs
git commit -m "feat(discord-activity): add Discord stats collection script"
```

---

## Task 9: GitHub Action Workflow

**Files:**
- Create: `.github/workflows/discord-stats.yml`

- [ ] **Step 1: Create workflow file**

```yaml
# .github/workflows/discord-stats.yml
name: Collect Discord Stats

on:
  schedule:
    - cron: '0 15 * * *' # Daily at KST 00:00 (UTC 15:00)
  workflow_dispatch: # Manual trigger

permissions:
  contents: write

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Collect Discord stats
        run: node scripts/collect-discord-stats.mjs
        env:
          DISCORD_BOT_TOKEN: ${{ secrets.DISCORD_BOT_TOKEN }}
          DISCORD_GUILD_ID: ${{ secrets.DISCORD_GUILD_ID }}

      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add apps/home/app/_data/discord-stats.json
          git diff --staged --quiet || git commit -m "chore: update discord stats $(date +%Y-%m-%d)"
          git push
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/discord-stats.yml
git commit -m "ci: add daily Discord stats collection workflow"
```

- [ ] **Step 3: Set up GitHub Secrets (manual)**

GitHub repo → Settings → Secrets and variables → Actions에 추가:
- `DISCORD_BOT_TOKEN`: Discord Developer Portal → 기존 dli 봇 → Bot → Token
- `DISCORD_GUILD_ID`: 함수랑산악회 서버 ID (dli에서 `dli server list --json`으로 확인 가능)

- [ ] **Step 4: Test workflow manually**

GitHub repo → Actions → "Collect Discord Stats" → "Run workflow" 클릭.

Expected: 워크플로우가 성공하고 `discord-stats.json`에 실제 Discord 데이터가 커밋됨.

---

## Post-Implementation Checklist

- [ ] 메인 페이지에서 Discord Activity 위젯이 Pinned 위에 표시됨
- [ ] Top 3 기여자에 #1, #2, #3 랭킹 + 아바타 + 미니 바 차트 표시됨
- [ ] "Insights →" 링크 클릭 시 `/insights` 페이지로 이동
- [ ] Insights 페이지에 전체 기여자 목록이 바 차트와 함께 표시됨
- [ ] GitHub Action 수동 실행 시 실제 Discord 데이터가 수집되어 커밋됨
- [ ] `.gitignore`에 `.superpowers/` 추가 (brainstorming 아티팩트 제외)
