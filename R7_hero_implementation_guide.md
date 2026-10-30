# NK Portfolio — 히어로 슬라이더 구현 지침 (R7 · 헤엄치는 고래 · 도트 프레임)

> 이 문서는 디자인 시안 **R7**을 코드로 옮기기 위한 지침입니다. 읽는 사람(또는 AI)이 디자인 캔버스를 보지 못한다고 가정하고 필요한 값을 모두 적었습니다.
> 기준 시안 크기: **630 × 945 px (세로형)**. 아래 px 값은 이 기준이며, 반응형 변환 규칙은 §8에 있습니다.

---

## 1. 개요

- 풀스크린 히어로 슬라이더 **3장**: `01 REACT`, `02 JAVA`, `03 SQL`.
- 3장은 **같은 프레임**(모서리 브래킷, 상단 내비, 점 구분 행, 세로 사이드 라벨, 하단 슬라이드 탭)을 공유하고, **가운데 비주얼과 제목만 바뀝니다**.
- 화면 가운데는 비워 둡니다. 텍스트는 모두 **가장자리에 붙입니다.** 03 슬라이드의 고래가 화면 전체를 헤엄쳐 다니기 때문입니다.
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
│라          ( 비워 둔 바다 : 고래가 지나감 )     라│
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
| 1 | 배경 점 (`dots.png`, 03 전용) | 천천히 떠다님 |
| 2 | **제목 블록 `<h1>`** | 고래가 이 위를 **덮고** 지나감 (깊이감) |
| 3 | **고래 레이어** | `pointer-events: none`, `aria-hidden="true"` |
| 4 | 브래킷, 상단 내비, 점 행, 사이드 라벨, 하단 탭 | 작은 글씨는 고래가 가리지 않게 맨 위 |

> 원칙: **큰 장식 글자 < 고래 < 작은 정보 텍스트·UI**

---

## 5. 슬라이드별 비주얼

### 03 SQL — 헤엄치는 픽셀 고래 (핵심)

에셋: `whale-1.png` ~ `whale-4.png`(배경 투명), `dots.png`(핑크 점만, 630×945 비율 전체 배경).

각 고래는 **머리가 향한 방향으로 화면 밖에서 들어와 반대편 밖으로 나가는** 직선 경로를 무한 반복합니다. 이동(래퍼)과 출렁임(안쪽 img)은 요소를 분리합니다.

| 스프라이트 | 머리 방향 | 표시 크기 (기준 px) | 시작 → 끝 (translate, 기준 px) | 주기 | 시작 오프셋 | 출렁임 지연 |
|---|---|---|---|---|---|---|
| whale-1 | 왼쪽 | 156 × 105 | (680, 236) → (-220, 170) | 28s | -7s | 0s |
| whale-2 | 아래 | 113 × 267 | (430, -300) → (476, 980) | 34s | -15s | -1.2s |
| whale-3 | 왼쪽 위 | 117 × 180 | (560, 980) → (-180, -220) | 31s | -5s | -2.1s |
| whale-4 | 오른쪽 | 197 × 129 | (-240, 600) → (680, 652) | 25s | -11s | -0.6s |

- 이동: `linear`, `infinite`. 음수 delay를 줘서 페이지를 처음 열 때부터 고래가 화면 곳곳에 흩어져 있게 합니다.
- 출렁임(`bob`): `translateY(-6px) rotate(-1.5deg)` ↔ `translateY(6px) rotate(1.5deg)`, 3.4s, `ease-in-out`, `alternate`.
- 배경 점(`drift`): `translate(0,0)` ↔ `translate(-16px, 12px)`, 14s, `ease-in-out`, `alternate`, opacity 0.85.
- 스프라이트는 회전·반전하지 않습니다. 이미지 자체가 이동 방향을 보고 있습니다.

참고 CSS (기준 px, 반응형 변환은 §8):

```css
@keyframes swimW1 { from { transform: translate(680px, 236px); } to { transform: translate(-220px, 170px); } }
@keyframes swimW2 { from { transform: translate(430px, -300px); } to { transform: translate(476px, 980px); } }
@keyframes swimW3 { from { transform: translate(560px, 980px); } to { transform: translate(-180px, -220px); } }
@keyframes swimW4 { from { transform: translate(-240px, 600px); } to { transform: translate(680px, 652px); } }
@keyframes bob   { from { transform: translateY(-6px) rotate(-1.5deg); } to { transform: translateY(6px) rotate(1.5deg); } }
@keyframes drift { from { transform: translate(0, 0); } to { transform: translate(-16px, 12px); } }

.whale-layer { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.whale       { position: absolute; left: 0; top: 0; will-change: transform; }
.whale img   { display: block; width: 100%; height: 100%; animation: bob 3.4s ease-in-out infinite alternate; }
.w1 { width: 156px; height: 105px; animation: swimW1 28s linear -7s  infinite; }
.w2 { width: 113px; height: 267px; animation: swimW2 34s linear -15s infinite; }
.w3 { width: 117px; height: 180px; animation: swimW3 31s linear -5s  infinite; }
.w4 { width: 197px; height: 129px; animation: swimW4 25s linear -11s infinite; }
.w2 img { animation-delay: -1.2s; } .w3 img { animation-delay: -2.1s; } .w4 img { animation-delay: -0.6s; }
```

```html
<div class="whale-layer" aria-hidden="true">
  <div class="whale w1"><img src="/whale-1.png" alt=""></div>
  <div class="whale w2"><img src="/whale-2.png" alt=""></div>
  <div class="whale w3"><img src="/whale-3.png" alt=""></div>
  <div class="whale w4"><img src="/whale-4.png" alt=""></div>
</div>
```

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
- 03 → 다른 슬라이드: 고래 레이어는 opacity 0으로 300ms 페이드아웃한 뒤 애니메이션을 정지합니다(`animation-play-state: paused`). 03으로 돌아오면 다시 재생합니다.
- 키보드: 좌/우 화살표로 전환합니다. 단, 전역 keydown이 입력 필드를 방해하지 않게 히어로에 포커스가 있을 때만 동작시키세요.
- 자동 재생이 있다면 일시정지 버튼을 제공하세요(WCAG 2.2.2).

---

## 7. 접근성

- `prefers-reduced-motion: reduce`일 때는 모든 애니메이션(고래, 출렁임, 점, 회전, 부유)을 멈춥니다. 고래는 **정지 위치**에 둡니다(화면 안에 보이게).
  - 정지 위치(기준 px): w1 (172, 167) · w2 (459, 266) · w3 (67, 483) · w4 (120, 655)

  ```css
  @media (prefers-reduced-motion: reduce) {
    .whale, .whale img, .dots, .rings, .rock { animation: none !important; }
    .w1 { transform: translate(172px, 167px); } .w2 { transform: translate(459px, 266px); }
    .w3 { transform: translate(67px, 483px); }  .w4 { transform: translate(120px, 655px); }
  }
  ```
- 장식(브래킷, 점 행의 점, 사이드 라벨, 고래, 배경 점)은 `aria-hidden="true"`로 숨깁니다.
- 비주얼 이미지(나이테, 돌)는 `alt="나이테 단면"`, `alt="돌 조각"`. 고래 레이어 전체는 aria-hidden입니다.
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
- **고래 크기**: **화면 높이 기준(svh)**으로 맞추면 세로·가로 화면 모두 비율이 유지됩니다.
  - w1 `16.5svh` × auto · w2 `12svh` · w3 `12.4svh` · w4 `20.8svh` (폭 기준, 높이는 비율 유지)
- **고래 경로**: 기준 px를 비율로 바꿔 `vw / svh`로 적습니다(x ÷ 630 × 100vw, y ÷ 945 × 100svh). 예:

  ```css
  @keyframes swimW1 { from { transform: translate(108vw, 25svh); } to { transform: translate(-35vw, 18svh); } }
  @keyframes swimW2 { from { transform: translate(68vw, -32svh); } to { transform: translate(75.5vw, 104svh); } }
  @keyframes swimW3 { from { transform: translate(89vw, 104svh); } to { transform: translate(-28.5vw, -23svh); } }
  @keyframes swimW4 { from { transform: translate(-38vw, 63.5svh); } to { transform: translate(108vw, 69svh); } }
  ```
  - 가로로 넓은 화면에서는 이동 거리가 길어지므로 주기를 `화면폭 ÷ 630 × 기준 주기` 정도로 늘려야 속도가 비슷하게 느껴집니다(CSS 변수나 JS로 계산).
- **좁은 화면(≤ 480px)**: 상단 내비에서 LINKEDIN·GITHUB를 메뉴 안으로 옮기고, 하단 탭은 `01 / 02 / 03` 숫자만 남깁니다.
- 가로 화면에서는 세로 사이드 라벨을 숨겨도 됩니다.

---

## 9. 구현 메모

- 기존 사이트가 Next.js로 보입니다(개발 표시 "N"). React 컴포넌트로 나누기를 권장합니다:
  `HeroSlider` › `HeroFrame`(고정 UI) + `SlideVisual`(슬라이드별) + `SlideTitle` + `WhaleLayer`(03 전용).
- 고래 애니메이션은 **CSS keyframes만으로 충분**합니다. 마우스를 피하는 등의 상호작용이 필요해지면 그때 `requestAnimationFrame`과 `transform`으로 옮기세요. `top`/`left`를 직접 바꾸면 버벅입니다.
- 이미지는 `next/image`(또는 `loading="eager"`)로 첫 슬라이드만 우선 로드하고, 나머지는 지연 로드합니다.
- 탭이 백그라운드에 있을 때는 브라우저가 CSS 애니메이션을 알아서 줄여 주므로 별도 처리는 필요 없습니다.

---

## 10. 에셋 목록 (`r7-assets/`)

| 파일 | 내용 | 비고 |
|---|---|---|
| `whale-1.png` ~ `whale-4.png` | 픽셀 고래 4마리, 배경 투명 | 기존 사이트 스크린샷에서 추출(저해상도). **원본 고래 이미지가 있으면 같은 방식(투명 배경, 개별 분리)으로 다시 뽑아 쓰세요.** |
| `dots.png` | 핑크 점만 남긴 배경, 투명 | 630×945 비율 전체 배경용 |
| `rings.png` | 나이테, 흰 배경 | `mix-blend-mode: multiply` 사용. 원본 교체 권장 |
| `rock.png` | 돌, 흰 배경 | 위와 동일 |

---

## 11. 완료 체크리스트

- [ ] 3장 모두 프레임 위치가 픽셀 단위로 동일하다 (전환할 때 프레임이 흔들리지 않음)
- [ ] 화면 가운데에 고정 텍스트가 없다
- [ ] 고래가 제목 위로는 지나가고, 내비·탭·라벨은 가리지 않는다
- [ ] 고래가 지나가는 중에도 링크와 버튼이 클릭된다
- [ ] 페이지를 처음 열었을 때 고래가 이미 화면 곳곳에 있다
- [ ] `prefers-reduced-motion`에서 모든 움직임이 멈추고 고래가 화면 안에 정지해 있다
- [ ] 12px 주황 텍스트는 `--accent-text`(#B23A0B)를 쓴다
- [ ] 포커스 테두리는 키보드로 이동할 때만 보인다
- [ ] 390px 폭(모바일)과 1440px 폭(데스크톱)에서 제목·탭이 잘리지 않는다
