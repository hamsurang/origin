---
title: "refactor: Discord Activity를 SSR(ISR)로 전환"
type: refactor
status: active
date: 2026-04-04
origin: docs/brainstorms/2026-04-04-discord-activity-ssr-requirements.md
---

# refactor: Discord Activity를 SSR(ISR)로 전환

## Overview

Discord Activity 데이터 소스를 GitHub Action + JSON 파일에서 Next.js ISR(Incremental Static Regeneration)로 전환한다. 서버 컴포넌트에서 Discord API를 직접 호출하고, `unstable_cache`로 24시간 캐싱한다. CI 파이프라인, JSON 파일, ci-scripts 패키지를 모두 제거한다. (see origin: docs/brainstorms/2026-04-04-discord-activity-ssr-requirements.md)

## Acceptance Criteria

- [ ] CI 파이프라인 없이 Discord 활동 데이터가 사이트에 표시됨
- [ ] 24시간 캐싱으로 Discord API가 하루 ~1회만 호출됨
- [ ] 최근 7일 데이터 기반 바 차트 + 기여자 랭킹
- [ ] API 실패 시 graceful empty state 표시
- [ ] `packages/ci-scripts/`, `.github/workflows/discord-stats.yml`, `discord-stats.json` 제거됨
- [ ] `pnpm --filter home build` 통과
- [ ] Vercel 배포 후 실제 데이터 렌더링

## Context

**현재 구조 (제거 대상):**
```
GitHub Action (cron) → Discord API → JSON 커밋 → Vercel 재배포
```

**새 구조:**
```
사용자 방문 → Next.js 서버 컴포넌트 → unstable_cache (24h) → Discord API
                                    ↓ 캐시 히트
                              즉시 응답 (stale-while-revalidate)
```

**핵심 기술 결정:**
- `fetch()` 대신 `unstable_cache` 사용: Discord API 호출이 단순 HTTP fetch가 아닌 다수 채널 순회 + 집계 로직 포함
- React `cache()`로 동일 렌더 내 중복 호출 방지 (page.tsx, insights/page.tsx 둘 다 같은 데이터 사용)
- 환경변수: `DISCORD_BOT_TOKEN`, `DISCORD_GUILD_ID`를 Vercel 환경변수로 관리 (서버 전용, NEXT_PUBLIC_ 불필요)

## MVP

### Phase 1: Discord API 클라이언트를 home 앱으로 이동

ci-scripts에서 재사용 가능한 코드를 `apps/home/app/lib/discord/`로 이동:

```
apps/home/app/lib/discord/
├── api.ts          ← discordFetch, fetchGuildChannels, fetchChannelMessages (ci-scripts에서 이동)
├── stats.ts        ← aggregateContributors (ci-scripts에서 이동)
├── snowflake.ts    ← snowflakeFromTimestamp (ci-scripts에서 이동)
├── types.ts        ← Discord API 타입 (ci-scripts에서 이동)
└── get-stats.ts    ← unstable_cache + React cache 래퍼 (신규)
```

#### `apps/home/app/lib/discord/get-stats.ts`

```ts
import { cache } from 'react'
import { unstable_cache } from 'next/cache'
import type { AggregatedStats } from '../../_shared/components/DiscordActivity/DiscordActivity.types'
// ... imports from local modules

const REVALIDATE_INTERVAL = 86400 // 24 hours

async function fetchDiscordStats(): Promise<AggregatedStats> {
  const token = process.env.DISCORD_BOT_TOKEN
  const guildId = process.env.DISCORD_GUILD_ID

  if (!token || !guildId) {
    return emptyStats()
  }

  try {
    // Fetch last 7 days of messages across all text channels
    // Aggregate into AggregatedStats shape
    // Return directly — no JSON file needed
  } catch (error) {
    console.error('Failed to fetch Discord stats:', error)
    return emptyStats()
  }
}

// Layer 1: ISR-style persistent cache (24h)
const getCachedStats = unstable_cache(
  fetchDiscordStats,
  ['discord-stats'],
  { revalidate: REVALIDATE_INTERVAL, tags: ['discord-stats'] }
)

// Layer 2: Request-level deduplication
export const getDiscordStats = cache(getCachedStats)

function emptyStats(): AggregatedStats {
  return { totalMessages: 0, totalContributors: 0, dailyTotals: [], rankedContributors: [] }
}
```

**핵심**: `fetchDiscordStats`가 직접 `AggregatedStats`를 반환하므로, 페이지에서 `aggregateStats()` 호출이 불필요해짐. 기존 `DiscordActivity.utils.ts`의 `aggregateStats`를 서버 측으로 통합.

### Phase 2: 페이지 업데이트

#### `apps/home/app/(profile-readme)/page.tsx`

```tsx
import { ActivityLog, DiscordActivity, RepositoryList } from '@/_shared'
import { getDiscordStats } from '../lib/discord/get-stats'
import { ACTIVITY_LOGS, REPOSITORY_ITEMS } from '../home.constants'

export const revalidate = 86400

export default async function Page() {
  const stats = await getDiscordStats()

  return (
    <section className="flex flex-col flex-1 gap-2">
      <p className="mt-3">Discord Activity</p>
      <DiscordActivity aggregatedStats={stats} />
      <p className="mt-5">Pinned</p>
      <RepositoryList items={REPOSITORY_ITEMS} />
      <p className="mt-5">Activity Logs</p>
      <ActivityLog logs={ACTIVITY_LOGS} />
    </section>
  )
}
```

#### `apps/home/app/insights/page.tsx`

```tsx
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
```

### Phase 3: 컴포넌트 Props 변경

`DiscordActivity`와 `DiscordInsights`의 props를 `stats: DiscordStats` → `aggregatedStats: AggregatedStats`로 변경. 컴포넌트 내부의 `useMemo(() => aggregateStats(stats))` 제거 — 서버에서 이미 집계된 데이터를 받음.

### Phase 4: 에러 경계 추가

#### `apps/home/app/(profile-readme)/error.tsx`

```tsx
'use client'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-8">
      <p className="text-sm text-gray-500">데이터를 불러올 수 없습니다</p>
      <button onClick={reset} className="text-xs text-blue-600 hover:underline">
        다시 시도
      </button>
    </div>
  )
}
```

### Phase 5: 제거

```bash
# CI 파이프라인
rm .github/workflows/discord-stats.yml

# JSON 데이터 파일
rm apps/home/app/_data/discord-stats.json

# ci-scripts 패키지 전체
rm -rf packages/ci-scripts/

# turbo.json에서 test/typecheck 태스크 제거 (ci-scripts 전용이었으므로)
# → 다른 패키지에서 사용하지 않는다면 제거. 추후 다른 패키지에서 사용 시 다시 추가.

# pnpm install로 lockfile 정리
pnpm install
```

### Phase 6: 환경변수 설정 (수동)

Vercel 대시보드 → `apps/home` 프로젝트:
- `DISCORD_BOT_TOKEN`: Discord 봇 토큰 (Production + Preview)
- `DISCORD_GUILD_ID`: `1464184292371595350` (Production + Preview)

로컬 개발용: `apps/home/.env.local` 생성 (gitignored)

## Sources

- **Origin document:** [docs/brainstorms/2026-04-04-discord-activity-ssr-requirements.md](docs/brainstorms/2026-04-04-discord-activity-ssr-requirements.md) — Key decisions: ISR 완전 대체, 7일 롤링 윈도우, CI 제거
- Next.js ISR docs: `unstable_cache` for non-fetch data caching
- Existing patterns: `apps/home/app/(profile-readme)/page.tsx` (서버 컴포넌트, props 전달)
- Related PR: hamsurang/origin#54
