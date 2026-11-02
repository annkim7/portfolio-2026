# NK Portfolio — 히어로 슬라이더 구현 지침 (R7 · ASCII 바다 · 도트 프레임)

> 이 문서는 디자인 시안 **R7**을 코드로 옮기기 위한 지침입니다. 읽는 사람(또는 AI)이 디자인 캔버스를 보지 못한다고 가정하고 필요한 값을 모두 적었습니다.
> 기준 시안 크기: **630 × 945 px (세로형)**. 아래 px 값은 이 기준이며, 반응형 변환 규칙은 §8에 있습니다.
>
> **2026-10-30:** SQL 슬라이드의 픽셀 고래 4마리와 핑크 점 배경은 빼기로 했습니다. 03 비주얼은 `CreatureLayer` 안의 `AsciiOcean` 캔버스(상어와 물고기)입니다. §4–§11은 그 구현을 기준으로 고쳤습니다. 프레임, 글꼴, 색은 그대로입니다.

---

## 1. 개요

- 풀스크린 히어로 슬라이더 **3장**: `01 REACT`, `02 JAVA`, `03 SQL`.
- 3장은 **같은 프레임**(모서리 브래킷, 상단 내비, 점 구분 행, 세로 사이드 라벨, 하단 슬라이드 탭)을 공유하고, **가운데 비주얼과 제목만 바뀝니다**.
- 화면 가운데는 비워 둡니다. 텍스트는 모두 **가장자리에 붙입니다.** 03 슬라이드의 ASCII 바다가 화면 전체를 채우기 때문입니다.
- 톤: 밝은 회색 바탕, 검정 텍스트, 주황 포인트 하나. 고정폭(mono) 글꼴과 도트 매트릭스 글꼴을 함께 씁니다.

---

## 2. 디자인 토큰

```css
:root {
  --bg:          #ECECEC;  /* 배경 */
  --ink:         #222222;  /* 기본 텍스트 */
  --accent:      #EE5A0E;  /* 큰 제목, 모서리 브래킷 (큰 요소 전용) */
  --accent-text: #B23A0B;  /* 작은 주황 텍스트(12px). --accent는 작은 글씨에서 대비 4.5:1 미달 */
  --muted:       #B4B4B4;  /* 세로 사이드 라벨 (장식, aria-hidden) */
  --dot-pink:    #D8B4B8;  /* 03 슬라이드 배경 점 (이미지에 포함됨) */
}
```

### 글꼴 (Google Fonts)

| 용도 | 글꼴 | 굵기 |
|---|---|---|
| 큰 제목(도트) | **Doto** | 900 |
| UI·라벨·내비 | **JetBrains Mono** | 400 / 500 / 600 |

```html
<link href="https://fonts.googleapis.com/css2?family=Doto:wght@700;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

- Doto를 불러오지 못하면 `monospace`로 폴백합니다. 레이아웃이 크게 깨지지 않게 제목 블록의 폭은 고정하지 마세요.
- 한글이 들어갈 일은 거의 없지만, 들어가면 시스템 고딕으로 폴백되어도 괜찮습니다.

---

## 3. 레이아웃 (기준 630 × 945)

```
┌─[브래킷]────────────────────────────────[브래킷]─┐
│  NK PORTFOLIO  /  LINKEDIN  /  GITHUB      [☰]    │  ← 상단 내비 (top 30)
│  ⁚    STACK 03     ⁚     DATABASE     ⁚           │  ← 점 구분 행 (top 104)
│세                                               세│
│로                                               로│
│라          ( 비워 둔 바다 : ASCII 물고기 )      라│
│벨                                               벨│
│                                                   │
│  SQL.                 ← Doto 128px, 주황          │
│  POSTGRESQL           ← Doto 46px                 │
│  (ST-03) © 2026       ← Doto 26px  (bottom 112)   │
│                                                   │
│  01 REACT NATIVE   02 JAVA SPRING   03 POSTGRESQL │  ← 하단 탭 (bottom 44)
└─[브래킷]────────────────────────────────[브래킷]─┘
```

| 요소 | 위치 / 크기 | 스타일 |
|---|---|---|
| 모서리 브래킷 ×4 | 각 모서리에서 24px 안쪽, 28×28px L자 | 2px solid `--accent`, 장식(aria-hidden) |
| 상단 내비 | left 70, right 62, top 30. `space-between` | Mono 12px/500, 자간 0.5px. 항목 사이에 `/`(aria-hidden). 오른쪽 끝에 햄버거 버튼 44×44, `aria-label="메뉴 열기"` |
| 점 구분 행 | left/right 70, top 104. `space-between` | `⁚`(지름 9px 원 2개, 세로 간격 8px) – 라벨 – `⁚` – 라벨 – `⁚`. 라벨은 Mono 12px/600 |
| 세로 사이드 라벨 | 좌: left 30, top 170 / 우: right 30, top 170 | `writing-mode: vertical-rl`, Mono 12px, 자간 1px, `--muted`, aria-hidden |
| 제목 블록 `<h1>` | left 64, bottom 112 | Doto 900, line-height 0.95. 1줄 128px `--accent` 자간 -3px / 2줄 46px(위 여백 8) / 3줄 26px(위 여백 12) |
| 하단 슬라이드 탭 `<nav>` | left/right 70, bottom 44. `space-between` | Mono 12px/600, `--accent-text`. 현재 슬라이드에 `aria-current="page"`와 밑줄(offset 4px) |

### 슬라이드별 텍스트

| 슬라이드 | 점 행 라벨 | 제목 1줄 | 제목 2줄 | 제목 3줄 | 세로 라벨 (좌 / 우) |
|---|---|---|---|---|---|
| 01 | `STACK 01` · `FRONTEND`* | `REACT.` | `REACT NATIVE` | `(ST-01) © 2026` | `ANN DEVELOPMENT STACK` / `NK PORTFOLIO — 2026` |
| 02 | `STACK 02` · `BACKEND` | `JAVA.` | `JAVA SPRING` | `(ST-02) © 2026` | 동일 |
| 03 | `STACK 03` · `DATABASE` | `SQL.` | `POSTGRESQL` | `(ST-03) © 2026` | 동일 |

\* `FRONTEND`/`BACKEND` 표기는 사이트 주인에게 확인하세요(시안에서 03만 확정).

---

## 4. 레이어 순서 (가장 중요)

아래에서 위 순서:

| z | 레이어 | 비고 |
|---|---|---|
| 0 | 배경 `--bg` | |
| 1 | 01·02 정지 이미지 | 나이테, 돌. 03에는 없음 |
| 2 | **제목 블록 `<h1>`** | 바다가 이 위를 덮음 |
| 3 | **ASCII 바다** (`CreatureLayer`) | 03 전용. `pointer-events: none`, `aria-hidden="true"` |
| 4 | 브래킷, 상단 내비, 점 행, 사이드 라벨, 하단 탭 | 링크와 탭이 클릭되게 맨 위 |

> 원칙: **큰 장식 글자 < ASCII 바다 < 작은 정보 텍스트·UI**

---

## 5. 슬라이드별 비주얼

### 03 SQL — ASCII 바다 (핵심)

픽셀 고래와 `dots.png`는 쓰지 않습니다. `CreatureLayer`가 `AsciiOcean` 캔버스를 히어로 전체에 깔고, 배경은 투명, 격자는 끕니다. 물고기 색은 `#C9A0A6`, 상어는 4마리입니다.

- 컴포넌트: `src/components/CreatureLayer.tsx`, `src/components/ascii-ocean/AsciiOcean.tsx`.
- 슬라이드 데이터는 `visual: "ocean"`일 때만 이 레이어를 켭니다. 01·02에서는 opacity 0입니다.
- 장식입니다. 레이어는 `aria-hidden="true"`, `pointer-events: none`이라 제목 위의 바다도 링크를 막지 않습니다.
- 다른 슬라이드로 나가면 레이어가 300ms 동안 사라진 뒤 시뮬레이션이 멈춥니다. 03으로 돌아오면 다시 돕니다.
- `prefers-reduced-motion`에서는 엔진이 루프를 돌리지 않고 한 프레임만 그립니다.

### 01 REACT — 나이테

- `rings.png` (흰 배경). 화면 가운데에 두고 `mix-blend-mode: multiply`로 흰 배경을 지웁니다.
- 기준 배치: left 0, top 127, 630 × 547 (원본 비율 유지).
- 움직임(선택): 아주 느린 회전 `rotate(0 → 360deg)`, 180s, linear, infinite. 눈에 띄지 않을 정도여야 합니다.

### 02 JAVA — 돌

- `rock.png` (흰 배경). 배치는 01과 같고 `mix-blend-mode: multiply`.
- 움직임(선택): 떠오르기 `translateY(-8px) ↔ translateY(8px)`, 6s, `ease-in-out`, `alternate`.

> 01·02는 오브젝트가 가운데에 고정되어 있으므로 제목 블록과 겹치지 않는지만 확인하면 됩니다.

---

## 6. 슬라이드 전환

- 하단 탭(`01 / 02 / 03`)이 슬라이드 내비게이션입니다. 각 탭은 실제 `<a>`나 `<button>`이어야 합니다.
- 프레임(브래킷, 내비, 사이드 라벨, 탭)은 **고정**하고, **비주얼과 제목만 교체**합니다.
- 권장 전환: 제목은 아래에서 위로 12px 이동하며 페이드인(300ms). 비주얼은 크로스페이드(400ms).
- 03 → 다른 슬라이드: ASCII 바다는 opacity 0으로 300ms 페이드아웃한 뒤 시뮬레이션을 멈춥니다. 지연은 페이드를 담당하는 곳에서 한 번만 겁니다. 03으로 돌아오면 다시 재생합니다.
- 키보드: 좌/우 화살표로 전환합니다. 단, 전역 keydown이 입력 필드를 방해하지 않게 히어로에 포커스가 있을 때만 동작시키세요.
- 자동 재생이 있다면 일시정지 버튼을 제공하세요(WCAG 2.2.2).

---

## 7. 접근성

- `prefers-reduced-motion: reduce`일 때는 제목·점 행·나이테·돌의 CSS 애니메이션을 멈추고, ASCII 바다 엔진도 루프 없이 한 프레임만 그립니다.
- 장식(브래킷, 점 행의 점, 사이드 라벨, ASCII 바다)은 `aria-hidden="true"`로 숨깁니다.
- 비주얼 이미지(나이테, 돌)는 `alt="나이테 단면"`, `alt="돌 조각"`. 바다 레이어 전체는 aria-hidden입니다.
- 아이콘만 있는 버튼에는 `aria-label`을 붙이고, 터치 영역은 44 × 44px 이상으로 합니다.
- 포커스 표시는 `:focus-visible`에만 그립니다. 기존 사이트에서 클릭 후 네모 테두리가 남는 문제를 이렇게 해결합니다.

---

## 8. 반응형 변환 규칙

시안은 세로형 630 × 945입니다. 실제 히어로는 `100vw × 100svh`로 꽉 채웁니다.

- **프레임 요소(브래킷, 내비, 점 행, 라벨, 탭)**: px 여백을 `clamp()`로 바꿉니다.
  - 가장자리 여백: `clamp(16px, 3.8vw, 32px)` (브래킷)
  - 내용 좌우 여백: `clamp(24px, 11vw, 96px)` (시안 70px)
- **제목 크기**: 시안 비율을 화면 높이에 맞춥니다.
  - 1줄 `clamp(72px, 13.5svh, 180px)` / 2줄 `clamp(28px, 4.9svh, 64px)` / 3줄 `clamp(16px, 2.75svh, 36px)`
- **ASCII 바다**: 캔버스가 히어로를 꽉 채웁니다. 별도 스프라이트 크기나 이동 경로는 없습니다. 물고기 수는 엔진이 화면 면적으로 잡을 수 있고, 지금 `CreatureLayer`는 `fishCount={384}`를 넘깁니다.
- **좁은 화면(≤ 480px)**: 상단 내비에서 LINKEDIN·GITHUB를 메뉴 안으로 옮기고, 하단 탭은 `01 / 02 / 03` 숫자만 남깁니다.
- 가로 화면에서는 세로 사이드 라벨을 숨겨도 됩니다.

---

## 9. 구현 메모

- 구현은 `Stage` 안에 `SlideObject`, `SlideTitle`, `CreatureLayer`, 그리고 고정 프레임(`Header`, `DotRow`, `SideLabels`, `Pagination`)으로 나뉩니다.
- 03의 바다는 CSS 키프레임이 아니라 캔버스 시뮬레이션입니다. 슬라이드를 떠나면 페이드 뒤에 `setRunning(false)`로 멈춥니다.
- 01·02 이미지는 `next/image`로 두고, 첫 슬라이드만 `priority`를 줍니다. 인접 슬라이드 이미지는 미리 불러옵니다.

---

## 10. 에셋 목록

픽셀 고래(`whale-1.png`~`whale-4.png`)와 핑크 점 배경(`dots.png`)은 구현에 없습니다.

| 파일 | 내용 | 비고 |
|---|---|---|
| `public/images/slides/main_slider_01.png` | 나이테 | `mix-blend-mode: multiply` |
| `public/images/slides/main_slider_02.png` | 돌 | 위와 동일 |
| (없음) | 03 ASCII 바다 | 이미지 대신 캔버스 |

---

## 11. 완료 체크리스트

- [ ] 3장 모두 프레임 위치가 픽셀 단위로 동일하다 (전환할 때 프레임이 흔들리지 않음)
- [ ] 화면 가운데에 고정 텍스트가 없다
- [ ] ASCII 바다는 제목 위에 있고, 내비·탭·라벨은 그 위에 있다
- [ ] 바다가 보여도 링크와 버튼이 클릭된다
- [ ] 03이 아닌 슬라이드에서는 바다가 숨고, 페이드 뒤에 시뮬레이션이 멈춘다
- [ ] `prefers-reduced-motion`에서 장식 움직임이 멈추고 바다는 한 프레임만 그린다
- [ ] 12px 주황 텍스트는 `--accent-text`(#B23A0B)를 쓴다
- [ ] 포커스 테두리는 키보드로 이동할 때만 보인다
- [ ] 390px 폭(모바일)과 1440px 폭(데스크톱)에서 제목·탭이 잘리지 않는다
