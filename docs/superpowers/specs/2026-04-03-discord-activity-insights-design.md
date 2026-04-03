# Discord Activity & Insights

Discord 서버 활동 데이터를 매일 수집하여 origin 홈페이지에 GitHub Contributors 스타일로 시각화한다.

## 개요

- **목적**: 함수랑산악회 Discord 서버의 일일 메시지 수와 사용자별 기여도를 origin 사이트에 표시
- **데이터 수집**: GitHub Action (daily cron) → Discord REST API 직접 호출 → JSON 파일 커밋
- **시각화**: GitHub contributors 그래프 스타일 바 차트 + 기여자별 미니 바 차트
- **페이지 구조**: Main 요약 위젯 + Insights 상세 페이지

## 페이지 구조

### Main 페이지 — Discord Activity 위젯

기존 Pinned 섹션 위, 페이지 최상단에 배치.

구성 (위→아래):
1. 헤더: "Discord Activity" 제목 + "Insights →" 링크
2. Aggregate 바 차트: 일별 전체 메시지 수 (X축=시간, Y축=메시지 수)
3. 요약 통계: 총 메시지 수 + 총 기여자 수
4. Top 3 기여자: `#1`, `#2`, `#3` 텍스트 랭킹 + 아바타 + 이름 + 메시지 수 + 미니 바 차트
5. 하단 링크: "View all N contributors →" → Insights 페이지로 이동

### Insights 페이지

별도 라우트 (`/insights`).

구성:
1. 헤더: "Discord Insights" + 총 메시지/기여자 수
2. Aggregate 바 차트 (Main보다 크게)
3. Contributors 전체 목록: `#1`~`#N`, 각 행에 아바타 + 이름 + 메시지 수 + 미니 바 차트
4. 메시지 수 기준 내림차순 정렬

## 데이터 모델

### discord-stats.json

```json
{
  "guildId": "1234567890",
  "lastUpdated": "2026-04-03T15:00:00Z",
  "daily": [
    {
      "date": "2026-04-03",
      "messages": 42,
      "participants": 18,
      "contributors": [
        { "id": "111", "username": "minsoo-web", "avatar": "abc123", "messages": 8 },
        { "id": "222", "username": "oilater", "avatar": "def456", "messages": 6 }
      ]
    }
  ]
}
```

필드 설명:
- `daily[].date`: YYYY-MM-DD 형식의 날짜
- `daily[].messages`: 해당 일자 전체 메시지 수
- `daily[].participants`: 해당 일자 고유 참여자 수
- `daily[].contributors[]`: 해당 일자에 메시지를 보낸 사용자 목록
  - `id`: Discord user ID
  - `username`: Discord 사용자명
  - `avatar`: Discord avatar hash (CDN URL 조합용)
  - `messages`: 해당 사용자의 일별 메시지 수

아바타 URL: `https://cdn.discordapp.com/avatars/{id}/{avatar}.png`

예상 데이터 크기: 1년 × 일평균 15명 ≈ 5,500 contributor 레코드 ≈ 200KB

### 빌드 타임 집계

JSON에는 일별 raw 데이터만 저장. 다음 값은 컴포넌트에서 빌드 타임에 계산:
- 총 메시지 수 (전체 daily 합산)
- 기여자 랭킹 (contributor별 전체 기간 메시지 합산 → 내림차순)
- 기여자별 일별 메시지 배열 (미니 바 차트 데이터)

## 컴포넌트 구조

```
apps/home/app/
├── (profile-readme)/
│   └── page.tsx                    ← Discord Activity 위젯 추가 (최상단)
├── insights/
│   └── page.tsx                    ← Insights 페이지
├── _shared/
│   └── components/
│       └── DiscordActivity/
│           ├── DiscordActivity.tsx          ← Main 위젯 (chart + top 3)
│           ├── DiscordActivity.types.ts     ← 타입 정의
│           ├── DiscordInsights.tsx          ← Insights 전체 페이지
│           ├── BarChart.tsx                 ← 재사용 바 차트 (aggregate/개인 공용)
│           └── ContributorRow.tsx           ← 기여자 행 (#N + avatar + name + chart)
├── _data/
│   └── discord-stats.json                  ← GitHub Action이 매일 업데이트
```

### BarChart

aggregate 차트와 개인 미니 차트에서 공유. Props:
- `data`: `{ date: string; value: number }[]`
- `height`: 차트 높이 (aggregate: 48px~80px, 개인: 28px~32px)
- `color`: GitHub 그린 계열 (값 강도에 따라 `#9be9a8` → `#216e39`)

### ContributorRow

기여자 한 행. Props:
- `rank`: 순위 번호
- `username`: Discord 사용자명
- `avatarUrl`: 아바타 이미지 URL
- `totalMessages`: 전체 기간 총 메시지 수
- `dailyMessages`: 일별 메시지 배열 (미니 바 차트 데이터)

Main 위젯에서는 Top 3만 렌더링, Insights에서는 전체 렌더링.

## GitHub Action 파이프라인

### Workflow 파일

```yaml
# .github/workflows/discord-stats.yml
name: Collect Discord Stats

on:
  schedule:
    - cron: '0 15 * * *'      # 매일 KST 00:00 (UTC 15:00)
  workflow_dispatch:            # 수동 실행 가능

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

### 수집 스크립트 (scripts/collect-discord-stats.mjs)

처리 흐름:
1. `GET /guilds/{guild_id}/channels` → 텍스트 채널 목록 필터링 (type 0, 5, 15)
2. 24시간 전 시점의 Discord Snowflake ID 계산: `BigInt(Date.now() - 86400000 - 1420070400000) << 22n`
3. 각 채널: `GET /channels/{id}/messages?after={snowflake}&limit=100`
   - 100개 초과 시 `before` 파라미터로 페이지네이션 (반복)
   - Rate limit: `X-RateLimit-Remaining` 헤더 확인, 0이면 `X-RateLimit-Reset-After` 만큼 대기
4. 응답에서 `author.id`, `author.username`, `author.avatar` 추출
5. 집계: 총 메시지 수 + contributor별 `{ id, username, avatar, messages }` 배열
6. 기존 `discord-stats.json` 읽기 → 오늘 데이터 append → 파일 쓰기

Discord REST API 인증: `Authorization: Bot {token}` 헤더

### Discord 토큰 설정

1. Discord Developer Portal → 기존 dli 봇 앱 선택 (새로 만들 필요 없음)
2. Bot 탭 → Token → Copy
3. GitHub repo Settings → Secrets and variables → Actions → New repository secret:
   - `DISCORD_BOT_TOKEN`: 봇 토큰
   - `DISCORD_GUILD_ID`: 함수랑산악회 서버 ID
4. 필요 권한: `Read Message History` (dli 설정 시 이미 부여되었을 가능성 높음)
5. `MESSAGE_CONTENT` privileged intent: 이미 활성화됨 (dli 설정 시 완료)

## 스타일

GitHub 톤앤매너를 따른다:
- 바 차트 색상: GitHub 그린 팔레트 (`#ebedf0`, `#9be9a8`, `#40c463`, `#30a14e`, `#216e39`)
- 색상 강도: 해당 날짜의 메시지 수를 4단계로 매핑 (max 값 기준 비율)
- 랭킹: `#1`, `#2`, `#3` 등 텍스트 (font-weight 600, color gray)
- 아바타: 24px (Main) / 28px (Insights) 원형
- 카드: `border: 1px solid #d0d7de`, `border-radius: 6px`
- 기존 프로젝트의 Tailwind CSS 클래스 활용

## 메인 페이지 레이아웃 변경

```
Before:                    After:
┌──────────────────┐      ┌──────────────────┐
│ Pinned           │      │ Discord Activity  │ ← 새 위젯
│ (RepositoryList) │      │ [bar chart]       │
├──────────────────┤      │ #1 minsoo ▂▅█▃▆  │
│ Activity Logs    │      │ #2 oilater ▃█▅▂▇ │
│ (heatmap)        │      │ #3 dev-seo █▃▆▅▂ │
└──────────────────┘      │ View all → │
                          ├──────────────────┤
                          │ Pinned           │
                          │ (RepositoryList) │
                          ├──────────────────┤
                          │ Activity Logs    │
                          │ (heatmap)        │
                          └──────────────────┘
```

## 범위 외

다음은 이 설계에 포함하지 않는다:
- 채널별 분리 통계 (서버 전체만 집계)
- 실시간 데이터 (daily cron으로 1일 1회 수집)
- Discord↔GitHub 사용자 매핑 (Discord 사용자명만 표시)
- 기존 Activity Logs 히트맵 데이터 소스 변경
- 다크 모드
