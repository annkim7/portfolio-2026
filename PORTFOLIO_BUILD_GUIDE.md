# 패럴렉스 포트폴리오 사이트 — 작업 지침서 (AI 작업자용)

> 이 문서는 다른 AI(또는 개발자)가 **순서대로 따라 하기만 하면** 완성되도록 작성된 실행 지침입니다.
> 각 Phase는 **목표 → 작업 → 완료 기준(Acceptance Criteria)** 순서로 되어 있습니다.
> 완료 기준을 모두 만족하기 전에는 다음 Phase로 넘어가지 마세요.

---

## 0. 프로젝트 개요

### 0.1 무엇을 만드는가
- **Next.js(App Router) 기반 풀스크린 포트폴리오 사이트**
- 한 화면(뷰포트 100vw × 100vh)에 **하나의 슬라이드**만 보인다.
- 사용자가 **마우스 휠 스크롤 / 트랙패드 / 터치 스와이프 / 키보드 방향키 / 하단 점(dot) 클릭**을 하면 다음·이전 슬라이드로 전환된다.
- 전환 시 바뀌는 요소
  - 중앙 **오브젝트 이미지**
  - 좌측 하단 **볼드 타이틀**(예: `DIAMOND .` / `JEWELRY`)
  - 좌측 하단 **슬라이드 번호**(예: `02`)
  - 우측 하단 **라벨 텍스트**(예: `LUSON / ONE DAY WORKS`, `UI / PROJECT / WORKS`)
  - 하단 중앙 **페이지네이션 점**의 활성 상태
- 전환은 **패럴렉스(레이어별 이동 거리·속도 차이)** 를 가진 부드러운 애니메이션으로 "착지(landing)"하듯 자연스럽게 멈춰야 한다.
- 헤더(로고, 메뉴, 아이콘)는 **고정**되어 전환되지 않는다.

### 0.2 기술 스택 (확정)
| 항목 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | Next.js 최신 안정 버전, App Router | `create-next-app` 기본값 사용 |
| 언어 | TypeScript | strict 모드 |
| 스타일 | Tailwind CSS (create-next-app 기본 버전) | 디자인 토큰은 CSS 변수로도 정의 |
| 애니메이션 | `motion` 패키지 (구 Framer Motion, `import { motion } from "motion/react"`) | `AnimatePresence`로 진입/퇴장 처리 |
| 폰트 | `next/font/google` — **Oswald** (600, 700) | 참고 이미지의 굵은 컨덴스드 산세리프 느낌 |
| 이미지 | `next/image` | 투명 배경 PNG/WebP 오브젝트 이미지 |

> ❗ 스크롤 하이재킹 라이브러리(fullpage.js 등)는 사용하지 않는다. 입력 처리는 직접 구현한다(Phase 5).

### 0.3 작업 원칙
1. 모든 슬라이드 콘텐츠는 **데이터 파일 하나(`src/data/slides.ts`)** 에서 관리한다. 컴포넌트에 텍스트를 하드코딩하지 않는다.
2. 위치·크기 값은 **디자인 토큰(CSS 변수)** 으로만 사용한다. 매직 넘버를 컴포넌트에 흩뿌리지 않는다.
3. 애니메이션 값(duration, easing, 이동 거리)은 **`src/lib/motion.ts` 한 곳**에 모은다.
4. Phase가 끝날 때마다 `npm run build`와 `npm run lint`가 에러 없이 통과해야 한다.

---

## 1. 참고 이미지 분석 (디자인 스펙)

참고 이미지는 회색 배경 위에 둥근 카드가 떠 있는 **Dribbble식 프레젠테이션 목업**이다.
**실제 사이트 화면 = 안쪽의 밝은 회색 카드 영역**이다. 바깥 회색 프레임은 기본적으로 구현하지 않되, 옵션(Phase 8.3)으로 제공한다.

### 1.1 색상
| 토큰 | 값 | 용도 |
|---|---|---|
| `--bg` | `#ECECEC` | 페이지 기본 배경 |
| `--bg-light` | `#F3F3F3` | 배경 그라디언트 밝은 쪽(하단 중앙) |
| `--bg-dark` | `#E2E2E2` | 배경 그라디언트 어두운 쪽(상단 우측) |
| `--fg` | `#0B0B0B` | 모든 텍스트, 아이콘, 점 |
| `--fg-inverse` | `#F4F4F4` | 반전 라벨(검정 배경 위 글자) |
| `--frame` | `#969DA3` | (옵션) 바깥 프레젠테이션 프레임 배경 |

배경은 단색이 아니라 아주 은은한 그라디언트다:
```css
background:
  radial-gradient(120% 90% at 50% 100%, var(--bg-light) 0%, transparent 60%),
  linear-gradient(200deg, var(--bg-dark) 0%, var(--bg) 55%);
```

### 1.2 타이포그래피
- 전부 **대문자**, 굵은 컨덴스드 산세리프 → `Oswald` 사용
- 글자 크기는 1440px 너비 기준으로 산정하고 `clamp()`로 반응형 처리

| 요소 | 1440px 기준 크기 | weight | 기타 |
|---|---|---|---|
| 로고 `DD` | 15px | 700 | letter-spacing 0.02em |
| 헤더 메뉴(`PRODUCT`, `LAYOUT`, `DESIGN`, `LUSON`) | 10px | 600 | letter-spacing 0.04em |
| 슬라이드 번호 `02` | 10px | 600 | |
| 타이틀 1행 `DIAMOND .` | 30px | 700 | line-height 1.0 |
| 타이틀 2행 `JEWELRY` | 20px | 700 | line-height 1.1 |
| 우측 라벨 | 12px | 700 | line-height 1.15, 우측 정렬 |

```css
--fs-logo:  clamp(13px, 1.05vw, 17px);
--fs-nav:   clamp(9px, 0.7vw, 11px);
--fs-title: clamp(22px, 2.1vw, 36px);
--fs-sub:   clamp(15px, 1.4vw, 24px);
--fs-label: clamp(10px, 0.85vw, 13px);
```

### 1.3 레이아웃 좌표 (뷰포트 비율 기준)
참고 카드(약 970×545px)에서 측정한 값을 **뷰포트 대비 %** 로 환산한 것이다. 이 값을 그대로 CSS 변수로 사용한다.

```
┌──────────────────────────────────────────────────────────────┐
│  DD   PRODUCT          LAYOUT   DESIGN   LUSON         ⌕    🛒 │  ← top: 9.5%
│  ↑7%  ↑12.5%           (가운데 정렬, 간격 ~8.4vw)  ↑right 15.5% ↑right 6.5%
│                                                              │
│                      ┌──────────┐                            │
│                      │  OBJECT  │  ← 중앙, 너비 31vw         │
│                      │  IMAGE   │    세로 중심 52%            │
│                      └──────────┘                            │
│  02                                            [LUSON]       │  ← bottom: 25%
│                                          [ONE DAY WORKS]     │
│  DIAMOND .                                           UI      │
│  JEWELRY               ○ ● ○                     PROJECT     │
│                                                    WORKS     │  ← bottom: 10.5%
│  ↑left 7%                                    ↑right 5.8%     │
└──────────────────────────────────────────────────────────────┘
```

| 토큰 | 값 | 설명 |
|---|---|---|
| `--pad-x` | `7vw` | 좌측 요소(로고, 번호, 타이틀) 기준선 |
| `--pad-x-right` | `5.8vw` | 우측 라벨 기준선 |
| `--header-top` | `9.5vh` | 헤더 텍스트의 세로 중심 위치 |
| `--icon-search-right` | `15.5vw` | 검색 아이콘 우측 거리 |
| `--icon-cart-right` | `6.5vw` | 장바구니 아이콘 우측 거리 |
| `--product-left` | `12.5vw` | `PRODUCT` 텍스트 좌측 위치 |
| `--nav-gap` | `8.4vw` | 중앙 메뉴 3개 사이 간격(중심 간 거리) |
| `--index-bottom` | `25vh` | 슬라이드 번호 하단 거리 |
| `--title-bottom` | `10.5vh` | 타이틀 블록 하단 거리 |
| `--dots-bottom` | `11.5vh` | 페이지네이션 점 하단 거리 |
| `--label-top-bottom` | `21vh` | 우측 반전 라벨 블록 하단 거리 |
| `--label-bottom` | `10.5vh` | 우측 일반 라벨 블록 하단 거리 |
| `--object-w` | `31vw` (max 640px, min 220px) | 중앙 오브젝트 너비 |
| `--object-cy` | `52vh` | 오브젝트 세로 중심 |

### 1.4 세부 요소 스펙
- **헤더 아이콘**: 선 굵기 1.5px, 크기 12–14px의 라인 아이콘(검색 돋보기, 장바구니). `lucide-react`의 `Search`, `ShoppingCart` 사용 가능(strokeWidth 1.75, size 14).
- **우측 반전 라벨**(`LUSON`, `ONE DAY WORKS`): 각 줄이 **검정 배경 박스에 밝은 글자**. 줄마다 개별 박스(`display: inline-block; padding: 0 3px;`), 우측 정렬, 줄 간격 1px.
- **우측 일반 라벨**(`UI / PROJECT / WORKS`): 검정 글자, 우측 정렬, 3줄.
- **페이지네이션 점**: 지름 7px, 간격 10px. 비활성 = 1.25px 테두리 원, 활성 = 꽉 찬 원. 클릭 시 해당 슬라이드로 이동.
- **오브젝트 이미지**: 투명 배경, 아래쪽으로 아주 옅은 그림자
  `filter: drop-shadow(0 30px 40px rgba(0,0,0,0.12));`
- 타이틀 `DIAMOND .`의 마침표는 앞 단어와 한 칸 띄운다(데이터에 그대로 포함).

---

## 2. 폴더 구조 (최종)

```
src/
├─ app/
│  ├─ layout.tsx          # 폰트, 메타데이터, globals.css
│  ├─ page.tsx            # <Stage /> 렌더
│  └─ globals.css         # 디자인 토큰, 배경, 리셋
├─ components/
│  ├─ Stage.tsx           # 전체 슬라이드 무대(상태·입력·조립) — client
│  ├─ Header.tsx          # 고정 헤더
│  ├─ SlideObject.tsx     # 중앙 이미지 + 전환 애니메이션
│  ├─ SlideTitle.tsx      # 번호 + 볼드 타이틀 + 전환 애니메이션
│  ├─ SideLabels.tsx      # 우측 라벨 + 전환 애니메이션
│  ├─ Pagination.tsx      # 하단 점
│  └─ MaskedLine.tsx      # 한 줄 마스크 리빌 공용 컴포넌트
├─ hooks/
│  ├─ useSlideNavigation.ts  # 휠/터치/키보드 → index, direction
│  ├─ usePointerParallax.ts  # 마우스 위치 기반 미세 패럴렉스
│  └─ useReducedMotion.ts    # (motion 내장 훅 재노출 가능)
├─ lib/
│  └─ motion.ts           # easing, duration, variants 상수
└─ data/
   └─ slides.ts           # 슬라이드 콘텐츠
public/
└─ images/slides/         # 01.webp, 02.webp ...
```

---

## Phase 1 — 프로젝트 셋업

**목표**: 빈 Next.js 프로젝트가 실행되고, 필요한 패키지가 설치된 상태.

**작업**
1. 프로젝트 생성
   ```bash
   npx create-next-app@latest portfolio --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   cd portfolio
   npm install motion lucide-react clsx
   ```
2. `src/app/page.tsx`의 기본 마크업을 모두 지우고 `<main />`만 남긴다.
3. `src/app/globals.css`에서 create-next-app 기본 스타일(다크모드 변수 등)을 제거한다. **이 사이트는 다크 모드를 지원하지 않는다**(참고 디자인이 밝은 회색 고정).
4. `public/images/slides/` 폴더를 만들고, 실제 이미지가 없으면 **플레이스홀더**를 둔다(Phase 3 참고).

**완료 기준**
- [ ] `npm run dev` 실행 시 빈 화면이 에러 없이 뜬다.
- [ ] `npm run build`, `npm run lint` 통과.

---

## Phase 2 — 디자인 토큰 & 전역 스타일

**목표**: 1장의 색·폰트·좌표가 CSS 변수로 정의되고, 배경이 참고 이미지와 동일하게 보인다.

**작업**
1. `layout.tsx`에서 Oswald 로드
   ```tsx
   import { Oswald } from "next/font/google";
   const oswald = Oswald({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
   // <html lang="ko" className={oswald.variable}>
   ```
2. `globals.css`에 1.1~1.3의 모든 토큰을 `:root`에 정의한다.
3. 전역 규칙
   ```css
   html, body { height: 100%; overflow: hidden; overscroll-behavior: none; }
   body {
     margin: 0;
     color: var(--fg);
     font-family: var(--font-display), "Helvetica Neue", Arial, sans-serif;
     text-transform: uppercase;
     -webkit-font-smoothing: antialiased;
     background: /* 1.1의 그라디언트 */;
     touch-action: none;           /* 모바일 기본 스크롤/바운스 차단 */
   }
   ```
4. Tailwind에서 토큰을 쓰고 싶으면 `@theme`(Tailwind v4) 또는 `theme.extend`(v3)에 색상만 연결한다. 좌표는 CSS 변수를 `style` 또는 임의값 클래스(`left-[var(--pad-x)]`)로 사용한다.

**완료 기준**
- [ ] 브라우저 배경이 참고 이미지 카드와 같은 밝은 회색이고, 상단 우측이 약간 더 어둡고 하단 중앙이 약간 더 밝다.
- [ ] 페이지에 스크롤바가 나타나지 않는다.

---

## Phase 3 — 슬라이드 데이터 모델

**목표**: 모든 콘텐츠가 `slides.ts` 한 파일에서 관리된다.

**작업**
```ts
// src/data/slides.ts
export type Slide = {
  id: string;
  title: string;          // 1행, 큰 글씨  예) "DIAMOND ."
  subtitle: string;       // 2행           예) "JEWELRY"
  image: { src: string; alt: string; width: number; height: number };
  labelInverse: string[]; // 우측 반전 라벨 줄들 예) ["LUSON", "ONE DAY WORKS"]
  label: string[];        // 우측 일반 라벨 줄들 예) ["UI", "PROJECT", "WORKS"]
  href?: string;          // (선택) 상세 페이지 링크
};

export const slides: Slide[] = [
  { id: "ring",    title: "SILVER .",  subtitle: "RING",    image: {...}, labelInverse: ["LUSON", "ONE DAY WORKS"], label: ["UI", "PROJECT", "WORKS"] },
  { id: "diamond", title: "DIAMOND .", subtitle: "JEWELRY", image: {...}, labelInverse: ["LUSON", "ONE DAY WORKS"], label: ["UI", "PROJECT", "WORKS"] },
  { id: "pearl",   title: "PEARL .",   subtitle: "EARRING", image: {...}, labelInverse: ["LUSON", "ONE DAY WORKS"], label: ["UI", "PROJECT", "WORKS"] },
];
```
- 슬라이드 번호는 데이터에 넣지 않고 `String(index + 1).padStart(2, "0")`로 계산한다.
- 페이지네이션 점 개수 = `slides.length`.
- **이미지 준비 규칙**: 투명 배경, 오브젝트가 캔버스 중앙에 오도록, 정사각형에 가까운 비율, 긴 변 1200–1600px, WebP 권장.
- 실제 이미지가 없으면 임시로 SVG 플레이스홀더(회색 반투명 유기적 도형 + 중앙 금색 원)를 `public/images/slides/placeholder-0N.svg`로 만들어 사용하고, 교체가 필요하다는 TODO 주석을 남긴다.

**완료 기준**
- [ ] 슬라이드 3개 이상 정의. 타입 에러 없음.

---

## Phase 4 — 정적 레이아웃 (애니메이션 없이 픽셀 맞추기)

**목표**: 애니메이션 없이 **2번 슬라이드(index 1)** 를 렌더했을 때 참고 이미지와 나란히 놓고 봐도 위치·크기·색이 일치한다.

**작업**
1. `Stage.tsx`(`"use client"`): `position: fixed; inset: 0;` 무대. 아직은 `const index = 1` 고정.
2. `Header.tsx`: 모든 요소 `position: absolute`, 세로 위치 `top: var(--header-top); transform: translateY(-50%)`.
   - `DD` → `left: var(--pad-x)`
   - `PRODUCT` → `left: var(--product-left)`
   - `LAYOUT / DESIGN / LUSON` → `left: 50%; transform: translate(-50%, -50%)`인 flex 컨테이너, `gap: calc(var(--nav-gap) - 메뉴폭)` 대신 **각 항목을 고정 폭 박스(`width: var(--nav-gap)`, text-align center)** 로 두면 중심 간격이 정확히 맞는다.
   - 검색 아이콘 → `right: var(--icon-search-right)`, 장바구니 → `right: var(--icon-cart-right)`
   - 메뉴는 `<a>`/`<button>`으로 만들고 hover 시 `opacity: 0.5` 전환(200ms).
3. `SlideObject.tsx`: `left: 50%; top: var(--object-cy); width: var(--object-w); transform: translate(-50%, -50%)`, `next/image`에 `priority`(첫 슬라이드) 및 `sizes="31vw"`.
4. `SlideTitle.tsx`: 번호는 `bottom: var(--index-bottom)`, 타이틀 블록은 `bottom: var(--title-bottom)`, 둘 다 `left: var(--pad-x)`.
5. `SideLabels.tsx`: 반전 라벨 `bottom: var(--label-top-bottom)`, 일반 라벨 `bottom: var(--label-bottom)`, 둘 다 `right: var(--pad-x-right)`, `text-align: right`, flex-column + `align-items: flex-end`.
6. `Pagination.tsx`: `left: 50%; bottom: var(--dots-bottom); transform: translateX(-50%)`. 각 점은 `<button aria-label="슬라이드 N로 이동">`. 클릭 영역은 24×24px로 넓히되 시각적 점은 7px.
7. **검수 방법**: 참고 이미지를 `public/ref.jpg`로 넣고, 개발 중에만 `?overlay=1` 쿼리일 때 반투명(opacity 0.4)으로 덮어 위치를 비교한다. 비교 해상도는 1440×810(16:9). 검수 후 오버레이 코드는 제거한다.

**완료 기준**
- [ ] 1440×810에서 각 요소의 위치가 참고 이미지 대비 ±1% 이내.
- [ ] 텍스트가 모두 대문자, 굵은 컨덴스드체로 보인다.
- [ ] 우측 상단 라벨이 줄별 검정 박스 + 밝은 글자로 렌더된다.

---

## Phase 5 — 입력 처리 (스크롤 / 스와이프 / 키보드 / 점)

**목표**: 어떤 입력이든 **한 번의 제스처 = 정확히 한 장 이동**. 트랙패드 관성 스크롤로 여러 장이 넘어가면 안 된다.

**작업** — `src/hooks/useSlideNavigation.ts`
```ts
type Options = { count: number; duration: number; loop?: boolean };
type Result = { index: number; direction: 1 | -1; goTo: (i: number) => void; next: () => void; prev: () => void; isAnimating: boolean };
```
구현 규칙:
1. **상태**: `index`, `direction`(1 = 다음, -1 = 이전), `isAnimating`(ref + state).
2. **잠금(lock)**: 이동이 시작되면 `duration`(Phase 6의 전환 시간, 약 1100ms) 동안 모든 입력을 무시한다.
3. **휠(wheel)**
   - `window.addEventListener("wheel", handler, { passive: false })` + `e.preventDefault()`.
   - `deltaY`를 누적하고, 누적 절댓값이 **40 이상**이면 방향 결정 후 이동, 누적값 리셋.
   - **관성 차단**: 잠금이 풀린 뒤에도 마지막 wheel 이벤트로부터 **150ms 이상 조용해진 다음**에야 새 제스처로 인정한다(`lastWheelTime` 기록). 이것이 없으면 맥 트랙패드에서 2~3장씩 넘어간다.
   - `Math.abs(deltaX) > Math.abs(deltaY)`인 가로 휠은 deltaX를 사용(가로 스와이프 트랙패드 지원).
4. **터치(touch)**
   - `touchstart`에서 x, y, 시간 기록. `touchmove`는 `preventDefault()`(passive: false).
   - `touchend`에서 dx, dy 중 큰 축 사용. **거리 50px 이상 또는 속도 0.4px/ms 이상**이면 이동. 위로 스와이프(dy < 0) 또는 왼쪽 스와이프(dx < 0) = 다음.
5. **키보드**: `ArrowDown`, `ArrowRight`, `PageDown`, `Space` = 다음 / `ArrowUp`, `ArrowLeft`, `PageUp` = 이전 / `Home`, `End` = 처음·끝. 입력 필드에 포커스가 있을 땐 무시.
6. **점 클릭**: `goTo(i)` — 현재보다 크면 direction 1, 작으면 -1.
7. **경계 처리**: 기본은 `loop: false`로 처음/끝에서 멈춘다. 끝에서 더 스크롤하면 이미지를 살짝(12px) 밀었다 돌아오는 **고무줄(rubber-band) 피드백**만 준다(Phase 6에서 구현, 훅은 `onEdge` 콜백만 노출).
8. 모든 리스너는 `useEffect` cleanup에서 제거.
9. (선택) URL 해시 동기화: 이동 시 `history.replaceState(null, "", "#" + slides[i].id)`, 최초 진입 시 해시로 시작 인덱스 결정.

**완료 기준**
- [ ] 마우스 휠 1칸, 트랙패드 한 번 쓸기, 모바일 스와이프 1회 → 각각 정확히 1장 이동.
- [ ] 빠르게 연속 스크롤해도 전환 중에는 추가 이동이 없다.
- [ ] 키보드와 점 클릭으로 이동 가능.
- [ ] 모바일 Safari에서 페이지 바운스/당겨서 새로고침이 일어나지 않는다.

---

## Phase 6 — 전환 애니메이션 ("자연스러운 착지")

**목표**: 슬라이드 전환이 레이어별로 시차를 두고 움직이며, 끝에서 부드럽게 감속해 멈춘다.

### 6.1 모션 상수 — `src/lib/motion.ts`
```ts
export const EASE_OUT  = [0.22, 1, 0.36, 1] as const;   // 착지(감속)
export const EASE_IN   = [0.64, 0, 0.78, 0] as const;   // 퇴장(가속)
export const EASE_INOUT= [0.76, 0, 0.24, 1] as const;
export const DURATION  = { enter: 1.0, exit: 0.6, text: 0.8 };
export const TRANSITION_LOCK_MS = 1100; // useSlideNavigation의 duration
```

### 6.2 레이어별 동작 (direction = 1 기준, -1이면 부호 반대)
패럴렉스 느낌은 **레이어마다 이동 거리와 지연이 다르기 때문에** 생긴다. 아래 표를 정확히 따른다.

| 레이어 | 퇴장(exit) | 진입(enter) 시작값 → 최종값 | 지연 |
|---|---|---|---|
| 오브젝트 이미지 | y: 0 → `-35vh`, scale 1 → 0.9, rotate 0 → -8°, opacity → 0, filter blur(0→6px) / 0.6s, EASE_IN | y: `45vh` → 0, scale 0.85 → 1, rotate 10° → 0, opacity 0 → 1, blur 8px → 0 / 1.0s, EASE_OUT | enter 0.15s |
| 이미지 그림자/내부 회전 | 진입 완료 직전 rotate가 -1.5° → 0으로 미세하게 한 번 더 감속 (spring: stiffness 120, damping 18) | | |
| 타이틀 1행 | 마스크 안에서 y: 0 → `-110%` / 0.5s | y: `110%` → 0 / 0.8s, EASE_OUT | 0.35s |
| 타이틀 2행 | 동일 | 동일 | 0.42s |
| 슬라이드 번호 | 동일 | 동일 | 0.30s |
| 우측 반전 라벨(줄마다) | 검정 박스가 우→좌 `scaleX 1→0`(transform-origin right) 후 글자 사라짐 | 박스 `scaleX 0→1`(origin left) 0.45s → 글자 y 100%→0 | 0.45s + 줄당 0.06s |
| 우측 일반 라벨(줄마다) | 마스크 리빌 | 마스크 리빌 | 0.55s + 줄당 0.05s |
| 페이지네이션 점 | 활성 점이 `layoutId="dot-active"`로 다음 위치까지 미끄러져 이동 | | 0s, spring(stiffness 400, damping 32) |
| 배경 | 전체 배경 그라디언트가 direction 방향으로 `background-position` 3% 이동 후 복귀 (아주 미세) | | 0s |

핵심 포인트:
- **이미지는 텍스트보다 크게, 먼저 움직이고, 텍스트는 작게, 늦게 움직인다** → 깊이감.
- 퇴장은 짧고 가속(EASE_IN), 진입은 길고 감속(EASE_OUT) → "툭 떨어져서 사뿐히 착지"하는 느낌.
- 진입과 퇴장이 **겹쳐서** 진행되도록 `AnimatePresence`의 `mode="popLayout"` 또는 기본(sync) 모드를 사용한다. `mode="wait"`는 공백이 생기므로 사용하지 않는다.

### 6.3 구현 패턴
```tsx
// SlideObject.tsx (발췌)
const variants = {
  enter: (dir: number) => ({ y: `${45 * dir}vh`, scale: 0.85, rotate: 10 * dir, opacity: 0, filter: "blur(8px)" }),
  center: { y: 0, scale: 1, rotate: 0, opacity: 1, filter: "blur(0px)",
            transition: { duration: DURATION.enter, ease: EASE_OUT, delay: 0.15 } },
  exit: (dir: number) => ({ y: `${-35 * dir}vh`, scale: 0.9, rotate: -8 * dir, opacity: 0, filter: "blur(6px)",
            transition: { duration: DURATION.exit, ease: EASE_IN } }),
};

<AnimatePresence initial={false} custom={direction}>
  <motion.div key={slide.id} custom={direction} variants={variants}
              initial="enter" animate="center" exit="exit"
              style={{ position: "absolute", /* Phase 4 좌표 */ }}>
    <Image ... />
  </motion.div>
</AnimatePresence>
```
```tsx
// MaskedLine.tsx — 한 줄 마스크 리빌 공용 컴포넌트
<span style={{ display: "block", overflow: "hidden" }}>
  <motion.span style={{ display: "block" }} custom={dir}
    variants={{ enter: (d) => ({ y: d > 0 ? "110%" : "-110%" }),
                center: { y: 0, transition: { duration: DURATION.text, ease: EASE_OUT, delay } },
                exit:  (d) => ({ y: d > 0 ? "-110%" : "110%", transition: { duration: 0.5, ease: EASE_IN } }) }}
    initial="enter" animate="center" exit="exit">
    {children}
  </motion.span>
</span>
```
- 텍스트 레이어는 `AnimatePresence` 안에서 **같은 위치에 두 슬라이드가 겹칠 수 있도록** `position: absolute`로 쌓는다.
- 고무줄 피드백(경계): 이미지 컨테이너를 `useAnimate`로 `y: [0, -12*dir, 0]`, 0.5s.
- **첫 로드 인트로**: `initial={false}`를 쓰지 않는 별도 처리로, 페이지 진입 시 이미지가 아래에서 올라오고 텍스트가 순차 리빌된다(헤더는 opacity 0→1, 0.6s, delay 0.8s).

**완료 기준**
- [ ] 다음/이전 방향에 따라 애니메이션 방향이 반대로 바뀐다.
- [ ] 이미지와 텍스트가 동시에 움직이지 않고 시차가 느껴진다.
- [ ] 전환 중 화면이 비는 순간이 없다(겹쳐서 교체).
- [ ] 활성 점이 다음 점으로 미끄러지듯 이동한다.
- [ ] 60fps 유지(Chrome DevTools Performance에서 긴 프레임 없음). `transform`/`opacity`/`filter`만 애니메이션한다.

---

## Phase 7 — 상시 패럴렉스 (마우스 / 기울기)

**목표**: 전환이 없을 때도 화면이 살아 있도록, 커서 위치에 따라 레이어가 서로 다른 깊이로 미세하게 움직인다.

**작업** — `src/hooks/usePointerParallax.ts`
1. `pointermove`에서 화면 중심 기준 정규화 좌표 `nx, ny ∈ [-1, 1]`를 `useMotionValue`에 저장.
2. `useSpring(value, { stiffness: 60, damping: 20, mass: 0.6 })`로 부드럽게.
3. 레이어별 깊이 계수(px 단위 최대 이동량):
   | 레이어 | x | y | 추가 |
   |---|---|---|---|
   | 오브젝트 이미지 | 18 | 14 | rotateX/rotateY 최대 4° (perspective 1200px) |
   | 이미지 그림자 | -10 | -6 | 이미지와 반대로 움직여 입체감 |
   | 타이틀 블록 | 6 | 4 | |
   | 우측 라벨 | 6 | 4 | |
   | 헤더 | 0 | 0 | 고정 |
4. 이 패럴렉스 transform은 **전환 애니메이션 wrapper의 바깥 wrapper**에 적용한다(두 transform이 충돌하지 않도록 요소를 분리).
5. 터치 기기(`(hover: none)`)에서는 비활성화. (선택) `DeviceOrientationEvent`로 기울기 패럴렉스 — iOS 권한 요청이 필요하므로 기본 비활성.

**완료 기준**
- [ ] 마우스를 움직이면 이미지가 가장 많이, 텍스트가 조금 움직인다.
- [ ] 슬라이드 전환 중에도 패럴렉스가 튀지 않는다.

---

## Phase 8 — 반응형 & 옵션

### 8.1 브레이크포인트
| 구간 | 변경 사항 |
|---|---|
| ≥ 1024px | 1장 스펙 그대로 |
| 768–1023px | `--object-w: 42vw`, 중앙 메뉴 간격 `10vw` |
| < 768px (모바일) | 중앙 메뉴(LAYOUT/DESIGN/LUSON) 숨기고 햄버거 버튼으로 대체(우측, 장바구니 왼쪽). `--object-w: 72vw`, `--object-cy: 44vh`. `--pad-x: 6vw`. 우측 라벨은 반전 라벨만 남기고 일반 라벨 숨김. 타이틀 `--fs-title: 28px`. 점은 하단 중앙 유지 |

- 높이가 낮은 가로 모드(`max-height: 500px`)에서는 오브젝트 너비를 `min(31vw, 60vh)`로 제한해 텍스트와 겹치지 않게 한다.
- 모든 vh는 모바일 주소창 문제를 피하기 위해 **`dvh`** 를 사용한다(`100dvh`, 토큰도 `dvh`로 정의하고 `vh` 폴백 제공).

### 8.2 접근성
- `prefers-reduced-motion: reduce`이면: 이동/회전/블러 없이 **opacity 크로스페이드 0.3s**만, 포인터 패럴렉스 끔.
- 슬라이드 영역 `role="region" aria-roledescription="carousel"`, 각 슬라이드 `aria-label="2 / 3: DIAMOND JEWELRY"`.
- 전환 시 `aria-live="polite"` 숨김 텍스트로 현재 슬라이드 제목 안내.
- 모든 버튼에 포커스 링(`outline: 1px solid var(--fg); outline-offset: 3px`).

### 8.3 (옵션) 프레젠테이션 프레임 모드
참고 이미지처럼 회색 배경 위에 카드를 띄운 모습을 원할 때를 위해 `NEXT_PUBLIC_FRAME_MODE=true`일 때만 적용:
- `body` 배경 `--frame`(#969DA3)
- 무대를 `inset: 5vh 5vw`, `border-radius: 24px`, `border: 6px solid #F7F7F7`, `box-shadow: 0 40px 60px -30px rgba(40,48,56,0.45)`
- 내부 좌표는 무대 기준 %로 동작하도록 토큰을 `%`/컨테이너 단위(`cqw`, `cqh`)로 전환. 이를 위해 무대에 `container-type: size`를 지정하고 토큰을 `cqw/cqh`로 정의해 두면 두 모드를 같은 코드로 처리할 수 있다. **→ 처음부터 Phase 2의 vw/vh 토큰 대신 cqw/cqh를 써도 된다(권장).**

---

## Phase 9 — 성능 최적화

1. 첫 슬라이드 이미지 `priority`, 나머지는 **다음·이전 슬라이드 이미지를 미리 로드**(`<link rel="preload">` 또는 숨김 `next/image`로 렌더).
2. 이미지 `sizes` 지정, WebP/AVIF 사용, 각 300KB 이하.
3. `filter: blur()` 애니메이션이 저사양 기기에서 무거우면 `matchMedia("(max-width: 767px)")`일 때 blur 제거.
4. `will-change: transform`은 애니메이션 중인 요소에만.
5. 폰트는 `next/font`로 self-host되어 레이아웃 시프트 없음 확인.

**완료 기준**
- [ ] Lighthouse(데스크톱) Performance 90+, Accessibility 95+, CLS 0.
- [ ] 전환 중 이미지가 늦게 뜨는 현상(빈 프레임) 없음.

---

## Phase 10 — 최종 QA 체크리스트

### 시각
- [ ] 1440×810, 1920×1080, 1280×720에서 참고 이미지와 레이아웃 비율 일치
- [ ] 배경색·글자색·폰트 굵기 일치, 반전 라벨 정상
- [ ] 모바일(390×844), 태블릿(820×1180)에서 요소 겹침 없음

### 동작
- [ ] 휠 / 트랙패드 / 터치 / 키보드 / 점 클릭 모두 1장씩 이동
- [ ] 관성 스크롤로 여러 장 넘어가지 않음
- [ ] 처음·끝에서 고무줄 피드백
- [ ] 방향에 따라 애니메이션 반대
- [ ] reduced-motion에서 크로스페이드만

### 브라우저
- [ ] Chrome, Safari(macOS·iOS), Firefox, Samsung Internet

### 코드
- [ ] `npm run build`, `npm run lint` 통과, 콘솔 경고 없음
- [ ] 텍스트·이미지 하드코딩 없음(전부 `slides.ts`)
- [ ] 애니메이션 상수는 `lib/motion.ts`에만 존재
- [ ] 개발용 오버레이(`ref.jpg`) 코드 제거

---

## 부록 A. 작업자가 임의로 결정하면 안 되는 것
- 배경색, 글자색, 요소 위치 → 1장 스펙 고정
- 폰트 계열 → 굵은 컨덴스드 산세리프 대문자(Oswald). 바꿀 경우 사용자 확인 필요
- 헤더는 전환 애니메이션 대상이 아님

## 부록 B. 작업자가 자유롭게 결정해도 되는 것
- 플레이스홀더 이미지 디자인
- 슬라이드 샘플 텍스트(2번 슬라이드 `DIAMOND . / JEWELRY`는 유지)
- 컴포넌트 내부 구현 방식(스펙과 완료 기준만 만족하면 됨)

## 부록 C. 이후 확장(이번 범위 아님)
- 슬라이드 클릭 시 상세 페이지로 공유 레이아웃 전환(`layoutId`로 이미지 확대)
- CMS 연동으로 `slides.ts` 대체
- 커서 커스텀(원형 커서가 "SCROLL" 텍스트 표시)
