---
date: 2026-04-04
topic: discord-activity-ssr
---

# Discord Activity SSR 전환

## Problem Frame

현재 Discord Activity 데이터 파이프라인이 과도하게 복잡하다: GitHub Action → Discord API → JSON 커밋 → Vercel 재배포. JSON 파일은 365일까지 성장하고, 수집 스크립트는 38개 채널 순차 호출로 rate limiting에 취약하다. SSR + ISR 캐싱으로 전환하여 CI 파이프라인을 제거하고 데이터를 런타임에 직접 가져온다.

## Requirements

- R1. `packages/ci-scripts/`, `.github/workflows/discord-stats.yml`, `apps/home/app/_data/discord-stats.json`을 제거한다
- R2. Discord API 호출을 Next.js 서버 컴포넌트로 이동하고, ISR로 24시간 캐싱한다 (`revalidate = 86400`)
- R3. 데이터 범위는 최근 7일. 바 차트와 기여자 랭킹은 7일간의 메시지 기반으로 집계한다
- R4. Discord 봇 토큰은 Vercel 환경변수로 관리한다 (GitHub Secrets 대신)
- R5. 기존 UI 컴포넌트(BarChart, ContributorRow, DiscordActivity, DiscordInsights)는 유지한다. 데이터 소스만 변경한다
- R6. API 호출 실패 시 빈 상태(empty state)를 graceful하게 표시한다

## Success Criteria

- CI 파이프라인(GitHub Action) 없이 Discord 활동 데이터가 사이트에 표시됨
- 24시간 캐싱으로 Discord API가 하루 1회만 호출됨
- `pnpm --filter home build` 통과
- Vercel 배포 후 실제 Discord 데이터 렌더링 확인

## Scope Boundaries

- 기존 UI 컴포넌트 디자인/기능 변경 없음
- 과거 데이터 히스토리 저장 없음 (7일 롤링 윈도우)
- 다크 모드 없음

## Key Decisions

- **ISR 선택**: SSR이 아닌 ISR(revalidate). 매 요청마다 Discord API를 호출하지 않고 24시간 단위로 백그라운드 재생성
- **7일 데이터**: 365일 히스토리를 포기하고 7일 롤링 윈도우로 단순화. API 호출 최소화 + JSON 비대화 문제 해소
- **CI 완전 제거**: 하이브리드가 아닌 SSR 완전 대체. 유지보수 포인트 최소화

## Dependencies / Assumptions

- Vercel에 DISCORD_BOT_TOKEN, DISCORD_GUILD_ID 환경변수 설정 필요
- Discord bot의 MESSAGE_CONTENT privileged intent 활성화 상태 유지
- Next.js ISR이 Vercel에서 정상 동작 (표준 기능)

## Outstanding Questions

### Deferred to Planning

- [Affects R2][Technical] Discord API 호출 로직의 위치: page.tsx 직접 vs lib/ 분리
- [Affects R2][Needs research] 서버 컴포넌트에서 `'use client'` 자식 컴포넌트에 데이터 전달 패턴
- [Affects R3][Technical] 7일간 데이터 수집 시 rate limiting 대응 (채널 수 × 7일)
- [Affects R6][Technical] ISR 첫 방문 콜드 스타트 시 로딩 UX

## Next Steps

→ `/ce:plan` for structured implementation planning
