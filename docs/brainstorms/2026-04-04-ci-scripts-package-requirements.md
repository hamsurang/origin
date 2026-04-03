---
date: 2026-04-04
topic: ci-scripts-package
---

# ci-scripts 패키지 분리 및 보강

## Problem Frame

Discord 데이터 수집 스크립트가 `scripts/collect-discord-stats.mjs`에 standalone JS 파일로 존재하며, 타입 안전성·테스트·모노레포 일관성이 부족하다. PR 스크린샷이 repo에 커밋된 상태이므로 정리도 필요.

## Requirements

- R1. `docs/screenshots/` 디렉토리와 해당 커밋을 제거한다
- R2. `scripts/collect-discord-stats.mjs`를 `packages/ci-scripts/` 패키지로 이동하고 TypeScript로 전환한다. `tsx`로 실행한다
- R3. ci-scripts 패키지에 `typecheck` 스크립트(`tsc --noEmit`)를 추가한다
- R4. ci-scripts 패키지에 vitest를 설정하고 수집 스크립트의 핵심 유틸리티 함수(snowflake 계산, 데이터 집계 등)에 대한 단위 테스트를 작성한다
- R5. `discord-stats.json`의 샘플 데이터를 dli CLI로 수집한 실제 Discord 프로필 데이터로 교체한다
- R6. GitHub Action workflow를 ci-scripts 패키지의 tsx 실행으로 업데이트한다

## Success Criteria

- `pnpm --filter ci-scripts typecheck` 통과
- `pnpm --filter ci-scripts test` 통과
- `apps/home` 빌드 성공
- `discord-stats.json`에 실제 Discord avatar hash와 username 포함
- `docs/screenshots/` 파일 없음

## Scope Boundaries

- 수집 스크립트의 비즈니스 로직은 변경하지 않음 (이미 리뷰 완료)
- Discord API 호출 코드의 통합 테스트는 포함하지 않음 (순수 함수 단위 테스트만)
- ci-scripts 패키지는 private, workspace 전용

## Key Decisions

- **tsx 사용**: Node.js에서 TypeScript를 직접 실행. ts-node 대비 ESM 호환성 우수
- **패키지 컨벤션**: 기존 `@hamsurang/*` 패키지 구조 따름 (exports, devDependencies, biome lint/format)
- **vitest**: 프로젝트 최초 테스트 인프라. ci-scripts에서 시작하여 점진적 확대 가능

## Dependencies / Assumptions

- dli CLI가 로컬에 설치되어 있고 MESSAGE_CONTENT intent가 활성화됨
- pnpm workspace에 `packages/*` 패턴이 이미 등록됨

## Outstanding Questions

### Deferred to Planning

- [Affects R2][Technical] ci-scripts 내부 디렉토리 구조 (src/ 구조, 진입점 경로)
- [Affects R4][Needs research] vitest에서 fetch mock 방식 결정 (순수 함수만 테스트하므로 불필요할 수 있음)
- [Affects R5][Technical] dli로 수집할 채널 범위와 날짜 범위

## Next Steps

→ `/ce:plan` for structured implementation planning
