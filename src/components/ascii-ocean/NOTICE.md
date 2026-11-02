# ocean-engine.js 라이선스

`ocean-engine.js` 첫 줄은 이 파일을 Framer 마켓플레이스의 ASCII Ocean 컴포넌트에서 가져왔다고 적고 있습니다. 작성자는 Muhammad Saeed이고, 그 컴포넌트는 [stackedlol/ascii-sharks](https://github.com/stackedlol/ascii-sharks) 시뮬레이션을 바탕으로 합니다.

두 라이선스는 다릅니다.

- **ascii-sharks**는 MIT입니다. Copyright (c) 2026 drewdi. 저작권 고지와 라이선스 문구를 남기면 수정과 재배포가 됩니다.
- **Framer ASCII Ocean**(무료 Creator Content)은 [Framer Community Terms](https://www.framer.com/legal/community-terms/1.0)의 Limited Commercial License를 따릅니다. 이 포트폴리오 안에서 쓰고 고치는 것은 허용됩니다. 컴포넌트를 단독 에셋으로 다시 배포하거나 공개하는 것은 금지입니다.

이 파일은 Framer 쪽 설정(투명 배경, 물고기 색, `setRunning`, `updateConfig`)이 들어 있는 트랜스파일 결과입니다. upstream `OceanEngine`은 `constructor(canvas, sharks?)`만 있고, 렌더러 색은 어두운 배경용으로 고정되어 있습니다. MIT 소스로 그대로 바꾸면 히어로의 밝은 배경과 맞지 않습니다.

그래서 이 파일에 MIT 고지를 붙이지 않습니다. 공개 저장소에 남아 있는 동안은 Framer 무료 라이선스의 재배포 제한과 충돌합니다. 다음 작업은 MIT 소스를 가져오고, 밝은 테마와 일시정지는 이 저장소에서 새로 작성한 뒤 `ocean-engine.js`를 지우는 것입니다. 그 전에 파일을 포맷하거나 lint 대상에 넣어도 라이선스 문제는 그대로입니다.
