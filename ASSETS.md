# 도트 게임 이미지

## 루미 교체 (현재 사용)

기본 제공 image_gen 도구로 기존 배경의 로봇을 여우로 교체했습니다. 원본은 보존합니다.
결과 파일: `dist/assets/titanic-lumi.png`, `dist/assets/store-lumi.png`, `dist/assets/city-lumi.png`, `dist/assets/lumi-portrait.png`.

최종 프롬프트:

- Titanic: precise-object-edit. Edit this pixel art game background. Replace ONLY the small teal robot at lower right beside the human detective with Lumi, an adorable small orange fox animal detective with cream muzzle and chest, large pointed ears, fluffy white-tipped tail, teal scarf and small brown detective cap. Same size and position as robot. No robot remains. Preserve the entire ship deck scene, human, lighting, layout, wide aspect ratio and detailed pixel art. No text.
- Store: precise-object-edit. Replace ONLY the small teal robot at lower right with Lumi, a small cute orange fox with cream muzzle and chest, fluffy white tipped tail, large pointed ears, teal scarf, brown detective cap. Same position and size. Keep human manager, entire department store background, warm lighting, framing and pixel art style unchanged. No robot remains. No text.
- City: precise-object-edit. Replace ONLY small teal robot next to engineer at lower right with Lumi, a small cute orange fox animal with cream muzzle and chest, large ears, fluffy white tipped tail, teal scarf and brown detective cap. Fox sits beside map. Keep engineer, car, rainy city, lights, garage, layout, wide ratio, pixel art unchanged. No robot remains. No text.
- Portrait: Pixel art RPG dialogue portrait, one friendly orange fox detective named Lumi, cream cheeks and muzzle, big pointed ears, kind dark eyes, small brown deerstalker cap and teal scarf. Head and shoulders centered, fills square frame. Dark navy flat background. Crisp pixel art, warm golden highlights, readable at 64 pixels. No text, no border, no robot.

기본 제공 imagegen 도구로 생성했습니다. 원본 PNG를 편집하지 않고 프로젝트에 복사했습니다.

- `dist/assets/titanic-pixel.png`: 별빛 갑판, 승객 명단, 탐정과 작은 로봇
- `dist/assets/store-pixel.png`: 저녁 백화점, 안내 데스크, 매니저와 작은 로봇
- `dist/assets/city-pixel.png`: 비 내리는 도시 차고, 지도, 엔지니어와 작은 로봇

## 최종 생성 프롬프트

### 1

Use case: illustration-story. Asset type: wide 16:9 pixel-art background for a Korean beginner educational adventure game, no UI and absolutely no letters or text. Create a richly detailed authentic 16-bit pixel art night scene on the promenade deck of a 1912 ocean liner inspired by Titanic. Crisp square pixels, no painterly smoothing. Deep navy ocean, starry indigo sky, large warm amber lit windows, wooden planked deck, brass railings, rope and lifebuoy, a writing desk with an open passenger ledger in the middle foreground. A small cute adult detective in brown coat and cap stands near the desk at lower right, accompanied by a tiny teal round robot with glowing eyes. Peaceful curious atmosphere, no disaster, no distress. Landscape game background with cinematic depth and a readable silhouette; keep upper left dark and spacious for a game location label. Limited navy, teal, warm gold palette. Polished commercial indie pixel adventure, no photorealism, no gradients that erase the pixels, no logos or watermarks.

### 2

Use case: illustration-story. Asset type: wide 16:9 pixel-art background for a Korean beginner educational adventure game, no UI and absolutely no letters or text. Richly detailed authentic 16-bit pixel art department store at evening: elegant warm amber ceiling lights, burgundy and plum interior, display shelves with clothes and bags, glass shopfront, checkered tile floor, a wooden reception counter with a receipt book and a small vintage monitor. A cute adult marketing assistant in a violet vest at lower right is accompanied by a tiny teal round robot with glowing eyes. Welcoming magical everyday-life adventure, not fantasy dungeon. Crisp square pixels throughout, beautiful commercial indie game environment, palette deep indigo, plum, amber and teal, no photorealism or vector appearance. Leave upper left spacious and dark enough for a game location label. No text, no letters, no logos, no watermarks.

### 3

Use case: illustration-story. Asset type: wide 16:9 pixel-art background for a Korean beginner educational adventure game, no UI and absolutely no letters or text. Richly detailed authentic 16-bit pixel art futuristic-but-cozy urban mobility garage on a rainy blue twilight evening. View from inside a warmly lit small dispatch workshop toward a street and distant city; a friendly teal compact car parked at lower left, warm desk lamps, a desk with an unlabelled paper street map, road signal glows, puddle reflections. Cute adult engineer in light jacket at lower right accompanied by a tiny teal round robot with glowing eyes. Cozy problem-solving adventure, hopeful mood, clearly visible crisp square pixels, limited deep navy, blue, teal, warm amber palette, polished commercial indie game environment. Keep upper left relatively open and dark for game label. No UI, no text, no letters, no logos, no watermarks.

