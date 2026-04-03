---
date: 2026-04-03
topic: discord-activity-in-origin
focus: dli를 활용해서 discord 활동 내용들을 origin에 더 담아볼 수 있을지
---

# Ideation: Discord 활동 데이터를 origin에 담기

## Codebase Context

- **origin**: Next.js 14 (App Router) monorepo for 함수랑산악회 (developer community)
- **Stack**: TypeScript, React 18, Tailwind CSS, pnpm + Turborepo
- **Apps**: apps/home (profiles, activity log heatmap), apps/wiki (MDX docs), web (iframe shell)
- **Activity data**: 100% hardcoded in `home.constants.ts` — every event requires code PR
- **dli**: Rust CLI tool (`~/.cargo/bin/dli`) for Discord interaction, JSON output, MESSAGE_CONTENT intent enabled
- **Discord server**: ~29 members, 기수 system (0기, 1기), channels per activity type
- **No GitHub Actions, no API routes, no test infrastructure**

## Ranked Ideas

### 1. dli Activity Log Generator (로컬 도구)
**Description:** dli --json으로 Discord 공지 채널을 읽고 ACTIVITY_LOGS 형식의 엔트리를 자동 생성하는 로컬 스크립트. 크리틱 V2의 주간 Notion URL links 매핑도 자동으로 채움.
**Rationale:** PR #53이 정확히 이 수작업이었음. 1기만 12개 항목 추가. 기수마다 반복.
**Downsides:** 비구조화 메시지 파싱 edge case. 수동 트리거 필요.
**Confidence:** 85%
**Complexity:** Low
**Status:** Unexplored

### 2. 데이터 레이어 분리 (JSON 파일)
**Description:** ACTIVITY_LOGS를 TypeScript에서 JSON으로 분리. 데이터 수정이 코드 수정과 분리됨.
**Rationale:** ActivityLogProps는 순수 직렬화 가능 타입. JSON으로 옮기면 스크립트 출력을 안전하게 쓸 수 있음.
**Downsides:** 단독으로는 사용자 대면 가치 없음.
**Confidence:** 80%
**Complexity:** Low
**Status:** Unexplored

### 3. 커뮤니티 산출물 쇼케이스 페이지
**Description:** 테크콘서트 발표 주제, 기록해 TIL 하이라이트, 엑싯해 사이드 프로젝트를 wiki에 전시. dli로 원본 수집, 큐레이션은 수동.
**Rationale:** 예비 멤버에게 커뮤니티 "생산물"을 보여줌. Discord에 풍부한 콘텐츠 존재.
**Downsides:** 편집 노력 필요. 업데이트 안 하면 낡은 페이지.
**Confidence:** 70%
**Complexity:** Medium
**Status:** Unexplored

### 4. 기수 종료 리캡 자동 생성
**Description:** 기수 종료 시 dli로 Discord 채널 스캔하여 종합 리캡 생성. 기수당 1회 배치.
**Rationale:** 기수 시스템의 자연스러운 마일스톤. 1기 종료(2026-04-24) 임박.
**Downsides:** 기수당 1회만 실행하므로 ROI 제한적.
**Confidence:** 65%
**Complexity:** Medium
**Status:** Unexplored

### 5. Discord 활동 요약 위젯 + Insights 페이지
**Description:** GitHub Action cron으로 매일 Discord 메시지/사용자별 데이터를 수집하여 JSON에 적재. Main에 바 차트 + Top 3 기여자 요약, Insights 페이지에서 전체 기여자별 상세 바 차트.
**Rationale:** GitHub Contributors 그래프 패턴으로 커뮤니티 활력을 시각화. 예비 멤버에게 직관적 인상.
**Downsides:** GitHub Action 인프라 추가. Discord API 토큰 관리.
**Confidence:** 85%
**Complexity:** Medium
**Status:** Explored

## Rejection Summary

| # | Idea | Reason Rejected |
|---|------|-----------------|
| 1 | GitHub Action 자동 모니터 (이벤트용) | 연 5회 업데이트에 CI 인프라 과잉 |
| 2 | 실시간 API 라우트 | Vercel에 dli 설치 불가, 랜딩 페이지에 실시간 불필요 |
| 3 | Discord 위젯 임베드 | 디자인 불일치, Discord 의존성 |
| 4 | 지식in Q&A 위키 (자동) | 비구조화 한국어 파싱 불안정 |
| 5 | 멤버별 기여 프로필 | 29명에서 감시 느낌, 허영 지표 |
| 6 | 참여도 히트맵 오버레이 | 29명의 반응 수는 통계적 노이즈 |
| 7 | RSVP 반응 출석 추적 | 행동 규약 필요 + Google Form이 나음 |
| 8 | 구조화된 포스팅 규약 | 사회적 규약은 빠르게 무너짐 |
| 9 | 양방향 연동 | 정적 사이트에 양방향은 과잉 |
| 10 | Discord as CMS | 20줄 데이터에 CMS 레이어 과잉 |
| 11 | Discord 봇 커맨드 | 봇 호스팅 필요, 연 5회에 과잉 |
| 12 | Notion 웹훅 연동 | 세 번째 콘텐츠 경로로 복잡도 증가 |
| 13 | 멤버 drift 감지기 | 분기 1회 업데이트에 자동 감지 불필요 |
| 14 | 할거야 약속 추적기 | Discord에서 이미 사회적 책임 작동 |
| 15 | 커뮤니티 타임머신 | 2.5년 30명에서 시기상조 |
| 16 | 코호트간 멘토링 시각화 | N=2 코호트로는 패턴 불가 |
| 17 | 스터디 그룹 하트비트 | 웹사이트 지표 불필요 |
| 18 | Discord-Origin 플라이휠 | 단방향 관계에 양방향 과잉 |

## Session Log
- 2026-04-03: Initial ideation — 46 raw ideas generated (6 agents), 29 after merge/dedupe, 5 survived adversarial filtering
- 2026-04-03: Brainstormed idea #5 → expanded to Discord Activity widget + Insights page with per-user tracking, GitHub Contributors bar chart style. Design spec written.
