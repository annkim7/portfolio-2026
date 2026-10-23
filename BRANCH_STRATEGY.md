# 브랜치 전략 (AI 작업자용)

> 이 문서는 `PORTFOLIO_BUILD_GUIDE.md`에 따라 코드를 작성할 때 지켜야 할 Git 브랜치 운영 원칙입니다.
> 작업을 시작하기 전에 반드시 이 문서와 빌드 가이드를 함께 읽으세요.

---

## 1. 브랜치 구조

```
main ────●────────────────────────────────●──────────▶   배포(완성본)
          \                              / (release)
dev ───────●────●────●────●────●────●───●────────────▶   통합(개발 중 최신본)
            \  /  \  /  \  /
feature-*    ●●    ●●    ●●                                 단위 작업
```

| 브랜치 | 역할 | 생성 기준 | 머지 대상 | 직접 커밋 |
|---|---|---|---|---|
| `main` | 언제든 배포 가능한 안정 버전 | 저장소 최초 생성 | — | ❌ 금지 |
| `dev` | 완료된 기능이 모이는 통합 브랜치 | `main`에서 1회 생성 | `main` | ❌ 금지 |
| `feature-<작업요약>` | 빌드 가이드의 세부 작업 1개 | 항상 최신 `dev`에서 생성 | `dev` | ✅ 여기서만 작업 |

**핵심 원칙: 모든 코드 작업은 feature 브랜치에서만 한다. `main`과 `dev`에는 머지로만 변경이 들어간다.**

---

## 2. 브랜치 이름 규칙

형식: `feature-<작업내용요약>`

- 영어 소문자 + 하이픈(kebab-case)만 사용 (한글, 공백, 대문자, 밑줄 금지)
- 2~4단어로 작업 내용을 요약
- 슬래시(`/`)를 쓰지 않는다 (`feature/...` ❌ → `feature-...` ✅)

| ✅ 좋은 예 | ❌ 나쁜 예 | 이유 |
|---|---|---|
| `feature-slide-navigation` | `feature-phase5` | 내용이 드러나지 않음 |
| `feature-header-layout` | `feature/header` | 슬래시 사용 |
| `feature-fix-wheel-inertia` | `feature-Fix_Wheel` | 대문자·밑줄 |
| `feature-transition-animation` | `feature-애니메이션` | 한글 |

버그 수정도 별도 브랜치 타입을 두지 않고 `feature-fix-<내용>` 으로 만든다.

---

## 3. 빌드 가이드 Phase ↔ feature 브랜치 매핑

아래 순서대로 진행한다. **앞 브랜치가 `dev`에 머지된 뒤에** 다음 브랜치를 `dev`에서 새로 만든다.

| 순서 | 빌드 가이드 | 브랜치 이름 | 주요 산출물 |
|---|---|---|---|
| 0 | — | (main 초기화, dev 생성) | `README.md`, `.gitignore` |
| 1 | Phase 1 | `feature-project-setup` | Next.js 프로젝트, 패키지 설치 |
| 2 | Phase 2 | `feature-design-tokens` | `globals.css` 토큰, 폰트, 배경 |
| 3 | Phase 3 | `feature-slide-data` | `src/data/slides.ts`, 플레이스홀더 이미지 |
| 4 | Phase 4 | `feature-header-layout` | `Header.tsx` |
| 5 | Phase 4 | `feature-slide-static-layout` | `Stage`, `SlideObject`, `SlideTitle`, `SideLabels`, `Pagination` 정적 배치 |
| 6 | Phase 5 | `feature-slide-navigation` | `useSlideNavigation.ts` (휠/터치/키보드/점) |
| 7 | Phase 6 | `feature-transition-animation` | `lib/motion.ts`, `MaskedLine`, 진입·퇴장 애니메이션 |
| 8 | Phase 7 | `feature-pointer-parallax` | `usePointerParallax.ts` |
| 9 | Phase 8 | `feature-responsive-layout` | 브레이크포인트, dvh 처리 |
| 10 | Phase 8 | `feature-accessibility` | reduced-motion, aria, 포커스 링 |
| 11 | Phase 8.3 | `feature-frame-mode` (선택) | 프레젠테이션 프레임 옵션 |
| 12 | Phase 9 | `feature-performance` | 이미지 프리로드, 최적화 |
| 13 | Phase 10 | (dev에서 QA) → `main` 릴리스 | 태그 `v1.0.0` |

- 한 Phase가 크면 여러 feature로 나눠도 된다(예: Phase 4 → 4, 5번). 반대로 **여러 Phase를 한 브랜치에 묶지 않는다.**
- QA 중 발견된 문제는 각각 `feature-fix-<내용>` 브랜치로 수정한다.

---

## 4. 작업 흐름 (명령어 포함)

### 4.0 최초 1회: main / dev 준비
```bash
git init
git checkout -b main
# README.md, .gitignore 작성
git add . && git commit -m "chore: initialize repository"
git checkout -b dev
git push -u origin main dev   # 원격 저장소가 있을 경우
```
> `create-next-app`은 자체적으로 `git init`을 수행하므로, `feature-project-setup`에서는 `--skip-git` 옵션을 붙이거나 현재 디렉터리에 생성해 기존 저장소를 유지한다.

### 4.1 feature 시작
```bash
git checkout dev
git pull origin dev            # 원격이 있을 경우
git checkout -b feature-slide-navigation
```

### 4.2 작업 중
- 작은 단위로 자주 커밋한다(5장 커밋 규칙).
- 작업이 길어지면 `dev` 변경을 반영한다:
  ```bash
  git fetch origin
  git rebase origin/dev        # 로컬 전용이면: git rebase dev
  ```

### 4.3 머지 전 셀프 체크 (모두 통과해야 머지 가능)
- [ ] `npm run lint` 통과
- [ ] `npm run build` 통과
- [ ] 빌드 가이드 해당 Phase의 **완료 기준(Acceptance Criteria)** 체크리스트 전부 충족
- [ ] 이 브랜치 범위 밖의 파일을 건드리지 않았음
- [ ] `console.log`, 디버그 코드, 개발용 오버레이 제거
- [ ] 최신 `dev` 위로 rebase 되어 있음(충돌 없음)

### 4.4 dev로 머지
```bash
git checkout dev
git merge --squash feature-slide-navigation
git commit -m "feat(navigation): add wheel, touch, keyboard slide navigation (Phase 5)"
git branch -d feature-slide-navigation
```
- feature → dev 는 **Squash merge**: dev 히스토리에 기능 1개 = 커밋 1개가 남도록 한다.
- GitHub 등에서 PR을 사용하는 경우 PR 제목을 위 커밋 메시지 형식으로 쓰고 "Squash and merge"를 선택한다.
- 머지 후 feature 브랜치는 삭제한다(로컬·원격 모두).

### 4.5 dev → main 릴리스
Phase 10 QA가 모두 통과했을 때만 진행한다.
```bash
git checkout main
git merge --no-ff dev -m "release: v1.0.0"
git tag -a v1.0.0 -m "Portfolio site v1.0.0"
git push origin main --tags
```
- dev → main 은 **`--no-ff` 일반 머지**: 릴리스 시점을 히스토리에 남긴다.
- 버전: 첫 완성본 `v1.0.0`, 이후 기능 추가 `v1.1.0`, 수정만 `v1.0.1`.
- 릴리스 후 `main`과 `dev`가 같은 상태인지 확인한다.

---

## 5. 커밋 메시지 규칙

[Conventional Commits](https://www.conventionalcommits.org/) 형식을 따른다.

```
<type>(<scope>): <요약 — 영어 명령형, 소문자 시작, 마침표 없음>
```

| type | 용도 |
|---|---|
| `feat` | 새 기능, 새 컴포넌트 |
| `fix` | 버그 수정 |
| `style` | 스타일·디자인 토큰 수정(로직 변화 없음) |
| `refactor` | 동작 변화 없는 구조 개선 |
| `perf` | 성능 개선 |
| `chore` | 설정, 패키지, 빌드 관련 |
| `docs` | 문서 |

scope 예시: `setup`, `tokens`, `data`, `header`, `layout`, `navigation`, `motion`, `parallax`, `responsive`, `a11y`, `perf`

```
feat(header): add fixed header with logo, nav and icons
style(tokens): adjust title bottom offset to match reference
fix(navigation): block trackpad inertia after transition lock
```

- 커밋 1개 = 논리적 변경 1개. "여러 가지 수정" 같은 커밋 금지.
- squash 커밋 메시지 끝에는 빌드 가이드 Phase 번호를 괄호로 표기한다: `(Phase 5)`.

---

## 6. AI 작업자 행동 규칙

1. **작업 시작 전** `git branch --show-current`로 현재 브랜치를 확인한다. `main` 또는 `dev`이면 코드를 수정하지 말고 feature 브랜치부터 만든다.
2. **한 번에 하나의 feature 브랜치만** 진행한다. 이전 feature가 dev에 머지되기 전에 다음 feature를 시작하지 않는다(3장 순서 준수).
3. **브랜치 범위를 지킨다.** 작업 중 다른 영역의 문제를 발견하면 고치지 말고 메모해 두었다가, 현재 브랜치를 머지한 뒤 별도 `feature-fix-*` 브랜치에서 처리한다.
4. **빌드 가이드의 "임의로 결정하면 안 되는 것"(부록 A)** 을 바꿔야 할 것 같으면 머지하지 말고 사용자에게 먼저 확인한다.
5. **강제 푸시 금지**: `main`, `dev`에 `git push --force` 절대 사용 금지. feature 브랜치에서 rebase 후에는 `--force-with-lease`만 허용.
6. **히스토리 변경 금지**: `main`, `dev`에서 `reset`, `rebase`, `commit --amend` 금지.
7. **머지 충돌**은 feature 브랜치에서 `dev`를 rebase하며 해결한다. dev 위에서 충돌을 해결하지 않는다.
8. **작업 기록**: 각 feature 머지 시 저장소 루트의 `PROGRESS.md`에 한 줄을 추가한다.
   ```markdown
   | 날짜 | 브랜치 | Phase | 상태 | 비고 |
   |---|---|---|---|---|
   | 2026-10-24 | feature-slide-navigation | 5 | merged | 트랙패드 관성 150ms 차단 적용 |
   ```
   다음 AI 작업자는 `PROGRESS.md`의 마지막 줄을 보고 이어서 할 브랜치를 결정한다.

---

## 7. 커밋하지 않는 것

`.gitignore`에 반드시 포함:
```
node_modules/
.next/
out/
.env*.local
.DS_Store
*.log
```
- 참고 이미지 오버레이용 `public/ref.jpg`는 커밋하지 않는다(`.gitignore`에 추가).
- 실제 포트폴리오 이미지는 `public/images/slides/`에 커밋한다(각 300KB 이하).

---

## 8. 한눈에 보는 요약

1. `dev`에서 `feature-<작업요약>` 생성
2. feature에서만 커밋 (Conventional Commits)
3. lint · build · Phase 완료 기준 통과
4. `dev` 위로 rebase → **squash merge** → feature 삭제 → `PROGRESS.md` 기록
5. 모든 Phase 완료 + QA 통과 시 `dev` → `main` **--no-ff merge** + 버전 태그
