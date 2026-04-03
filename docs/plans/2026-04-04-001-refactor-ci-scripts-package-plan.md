---
title: "refactor: ci-scripts 패키지 분리 및 테스트 보강"
type: refactor
status: active
date: 2026-04-04
origin: docs/brainstorms/2026-04-04-ci-scripts-package-requirements.md
---

# refactor: ci-scripts 패키지 분리 및 테스트 보강

## Overview

Discord 데이터 수집 스크립트를 `scripts/collect-discord-stats.mjs`에서 `packages/ci-scripts/`로 이동하여 모노레포 컨벤션에 맞는 TypeScript 패키지로 전환한다. vitest로 단위 테스트를 추가하고, dli CLI로 실제 Discord 프로필 데이터를 수집하여 샘플 데이터를 교체한다.

## Problem Statement / Motivation

수집 스크립트가 standalone `.mjs` 파일로 존재하여 타입 안전성이 없고, 테스트가 불가능하며, 모노레포의 다른 패키지와 구조적으로 일관되지 않는다. PR 스크린샷이 repo에 커밋된 상태이므로 정리도 필요하다. (see origin: docs/brainstorms/2026-04-04-ci-scripts-package-requirements.md)

## Proposed Solution

1. `docs/screenshots/` 제거
2. `packages/ci-scripts/` 패키지 생성 (`@hamsurang/ci-scripts`, tsx 실행)
3. 수집 스크립트를 TypeScript로 전환, 순수 함수 분리
4. vitest 단위 테스트 추가
5. dli로 실제 Discord 데이터 수집
6. GitHub Action workflow 업데이트

## Technical Considerations

- **tsx 사용**: `@hamsurang/typescript-config/base.json`이 `module: "NodeNext"`를 사용하므로 tsx와 호환성 우수. ts-node 대비 ESM 지원이 안정적
- **패키지 컨벤션**: 기존 `@hamsurang/*` 패턴 따름 — `private: true`, `version: "0.0.0"`, `exports: { ".": "./src/index.ts" }`
- **turbo.json 확장**: `test`, `typecheck` 태스크를 turbo pipeline에 추가하여 모노레포 전체에서 사용 가능하게 함
- **DATA_PATH 변경**: 스크립트 위치가 `scripts/` → `packages/ci-scripts/src/`로 변경되므로 상대 경로 업데이트 필요
- **vitest**: 프로젝트 최초 테스트 인프라. ci-scripts 패키지 로컬에만 설정 (root-level config 불필요)

## Acceptance Criteria

- [ ] `docs/screenshots/` 디렉토리 없음
- [ ] `scripts/collect-discord-stats.mjs` 파일 없음
- [ ] `pnpm --filter @hamsurang/ci-scripts typecheck` 통과
- [ ] `pnpm --filter @hamsurang/ci-scripts test` 통과
- [ ] `apps/home` 빌드 성공 (`pnpm --filter home build`)
- [ ] `discord-stats.json`에 실제 Discord avatar hash와 username 포함
- [ ] GitHub Action workflow가 tsx로 실행되도록 업데이트됨

## Dependencies & Risks

- dli CLI가 로컬에 설치되어 있어야 실제 데이터 수집 가능
- pnpm workspace에 `packages/*` 패턴이 이미 등록됨 (확인 완료)
- GitHub Action에 pnpm 설치 단계 추가 필요 — 기존 워크플로우는 `node`만 사용

## Implementation Plan

### Phase 1: 정리 및 패키지 셋업

#### Task 1: docs/screenshots 제거

```bash
git rm -r docs/screenshots/
git commit -m "chore: remove PR screenshots from repo"
```

#### Task 2: packages/ci-scripts 패키지 생성

**파일 구조:**

```
packages/ci-scripts/
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── src/
    ├── collect-discord-stats.ts    ← 메인 스크립트 (진입점)
    ├── discord-api.ts              ← discordFetch, fetchChannelMessages
    ├── snowflake.ts                ← snowflakeFromTimestamp
    ├── stats.ts                    ← collectDailyStats, 집계 로직
    └── types.ts                    ← Discord API 응답 타입, 내부 타입
```

**`packages/ci-scripts/package.json`:**

```json
{
  "name": "@hamsurang/ci-scripts",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "collect-discord-stats": "tsx src/collect-discord-stats.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "typecheck": "tsc --noEmit",
    "lint": "biome lint ./src",
    "format": "biome format ./src --write"
  },
  "devDependencies": {
    "@hamsurang/typescript-config": "workspace:*",
    "tsx": "^4.19.0",
    "typescript": "^5.4.5",
    "vitest": "^3.1.1"
  }
}
```

**`packages/ci-scripts/tsconfig.json`:**

```json
{
  "extends": "@hamsurang/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist",
    "noEmit": true
  },
  "include": ["src"]
}
```

**`packages/ci-scripts/vitest.config.ts`:**

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
})
```

#### Task 3: turbo.json에 test, typecheck 태스크 추가

```json
{
  "tasks": {
    "test": {},
    "typecheck": {}
  }
}
```

기존 tasks에 추가. `dependsOn` 불필요 (각 패키지 독립 실행).

### Phase 2: 스크립트 TypeScript 전환

#### Task 4: 타입 정의 (`src/types.ts`)

Discord API 응답 타입과 내부 데이터 타입을 정의.

```ts
// Discord API 응답 타입
export type DiscordChannel = {
  id: string
  name: string
  type: number
}

export type DiscordAuthor = {
  id: string
  username: string
  avatar: string | null
  bot?: boolean
}

export type DiscordMessage = {
  id: string
  timestamp: string
  author: DiscordAuthor
}

// 내부 데이터 타입
export type ContributorStats = {
  id: string
  username: string
  avatar: string | null
  messages: number
}

export type DailyStats = {
  date: string
  messages: number
  participants: number
  contributors: ContributorStats[]
}

export type StatsData = {
  guildId: string
  lastUpdated: string
  daily: DailyStats[]
}
```

#### Task 5: snowflake 유틸리티 (`src/snowflake.ts`)

```ts
const DISCORD_EPOCH = 1420070400000n

export function snowflakeFromTimestamp(timestamp: number): string {
  return String((BigInt(timestamp) - DISCORD_EPOCH) << 22n)
}

export function timestampFromSnowflake(snowflake: string): number {
  return Number((BigInt(snowflake) >> 22n) + DISCORD_EPOCH)
}
```

#### Task 6: Discord API 클라이언트 (`src/discord-api.ts`)

기존 `discordFetch`, `fetchChannelMessages`를 타입 안전하게 전환. `DiscordChannel`, `DiscordMessage` 타입 사용.

주요 변경:
- 제네릭 `discordFetch<T>(path: string, retries?: number): Promise<T>`
- `TEXT_CHANNEL_TYPES`를 `Set<number>`로 export
- `fetchChannelMessages`가 `DiscordMessage[]`를 반환

#### Task 7: 수집 및 집계 로직 (`src/stats.ts`)

`collectDailyStats`와 데이터 파일 읽기/쓰기 로직을 분리. 순수 함수는 테스트 가능하게 추출:

- `aggregateContributors(messages: DiscordMessage[]): ContributorStats[]` — 메시지 배열에서 사용자별 집계 (순수 함수, 테스트 대상)
- `upsertDailyStats(existing: StatsData, newDay: DailyStats, maxDays?: number): StatsData` — 기존 데이터에 새 날짜 추가/교체 (순수 함수, 테스트 대상)

#### Task 8: 메인 진입점 (`src/collect-discord-stats.ts`)

기존 `main()` 로직을 조합하는 진입점. 환경변수 읽기, Discord API 호출, 파일 I/O.

`DATA_PATH`를 스크립트 새 위치 기준으로 업데이트:

```ts
const DATA_PATH = join(import.meta.dirname, '..', '..', '..', 'apps', 'home', 'app', '_data', 'discord-stats.json')
```

#### Task 9: 기존 스크립트 파일 제거

```bash
git rm scripts/collect-discord-stats.mjs
```

### Phase 3: 테스트 추가

#### Task 10: snowflake 테스트 (`src/snowflake.test.ts`)

```ts
import { describe, expect, it } from 'vitest'
import { snowflakeFromTimestamp, timestampFromSnowflake } from './snowflake.js'

describe('snowflakeFromTimestamp', () => {
  it('converts Unix timestamp to Discord snowflake', () => {
    // 2026-03-01T00:00:00Z = 1772006400000ms
    const snowflake = snowflakeFromTimestamp(1772006400000)
    // Verify it's a valid snowflake string
    expect(typeof snowflake).toBe('string')
    expect(BigInt(snowflake)).toBeGreaterThan(0n)
  })

  it('produces snowflakes that increase with time', () => {
    const earlier = snowflakeFromTimestamp(1772006400000)
    const later = snowflakeFromTimestamp(1772006400000 + 86400000)
    expect(BigInt(later)).toBeGreaterThan(BigInt(earlier))
  })
})

describe('timestampFromSnowflake', () => {
  it('roundtrips with snowflakeFromTimestamp', () => {
    const original = 1772006400000
    const snowflake = snowflakeFromTimestamp(original)
    const recovered = timestampFromSnowflake(snowflake)
    expect(recovered).toBe(original)
  })
})
```

#### Task 11: stats 테스트 (`src/stats.test.ts`)

`aggregateContributors`와 `upsertDailyStats` 순수 함수에 대한 테스트:

- `aggregateContributors`: 메시지 배열 → 사용자별 집계, 봇 필터링, 내림차순 정렬
- `upsertDailyStats`: 새 날짜 추가, 기존 날짜 교체, 날짜 정렬, 365일 cap

#### Task 12: typecheck 및 test 실행 확인

```bash
pnpm --filter @hamsurang/ci-scripts typecheck
pnpm --filter @hamsurang/ci-scripts test
```

### Phase 4: 실제 데이터 수집 및 워크플로우 업데이트

#### Task 13: dli로 실제 Discord 데이터 수집

```bash
# 서버의 채널 목록 확인
dli channel list --server 함수랑산악회 --json

# 최근 메시지에서 실제 사용자 프로필 추출
dli message list --server 함수랑산악회 --channel 공지사항 --json --limit 100
```

수집한 데이터에서 실제 Discord user ID, username, avatar hash를 추출하여 `apps/home/app/_data/discord-stats.json`의 샘플 데이터를 교체.

#### Task 14: GitHub Action workflow 업데이트

`.github/workflows/discord-stats.yml` 변경사항:

```yaml
steps:
  - uses: actions/checkout@v4

  - uses: pnpm/action-setup@v4

  - uses: actions/setup-node@v4
    with:
      node-version: 20
      cache: 'pnpm'

  - name: Install dependencies
    run: pnpm install --frozen-lockfile

  - name: Collect Discord stats
    run: pnpm --filter @hamsurang/ci-scripts collect-discord-stats
    env:
      DISCORD_BOT_TOKEN: ${{ secrets.DISCORD_BOT_TOKEN }}
      DISCORD_GUILD_ID: ${{ secrets.DISCORD_GUILD_ID }}
```

주요 변경:
- `pnpm/action-setup@v4` 추가
- `actions/setup-node`에 `cache: 'pnpm'` 추가
- `pnpm install --frozen-lockfile` 추가
- 실행 커맨드를 `node scripts/...` → `pnpm --filter @hamsurang/ci-scripts collect-discord-stats`로 변경

#### Task 15: 최종 검증

```bash
pnpm --filter @hamsurang/ci-scripts typecheck
pnpm --filter @hamsurang/ci-scripts test
pnpm --filter home build
```

모든 체크 통과 확인 후 커밋.

## Success Metrics

- typecheck + vitest 모두 통과
- home 앱 빌드 성공
- discord-stats.json에 실제 Discord 프로필 데이터 포함

## Sources & References

- **Origin document:** [docs/brainstorms/2026-04-04-ci-scripts-package-requirements.md](docs/brainstorms/2026-04-04-ci-scripts-package-requirements.md) — Key decisions: tsx 사용, @hamsurang/* 패키지 컨벤션, vitest as first test infra
- Similar package: `packages/utils/package.json` (구조 참고)
- TypeScript config: `packages/typescript-config/base.json` (module: NodeNext)
- Turbo config: `turbo.json` (test/typecheck 태스크 추가 필요)
