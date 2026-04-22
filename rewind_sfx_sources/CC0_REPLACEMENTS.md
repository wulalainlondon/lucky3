# Lucky3 CC0 音效替換候選（追加版）

下面清單只放我這次有再確認到 `Creative Commons 0` 的來源，優先給你可直接商用的替換候選。

## 1) 直接對應目前檔名

### `deal.mp3`
- Card shuffle（短，紙牌質感）：https://freesound.org/people/Breviceps/sounds/447918/
- Interface/impact 類短敲擊（同包可挑多版本）：https://kenney.nl/assets/impact-sounds

### `cardSelect1.ogg` / `cardSelect2.ogg` / `cardSelect3.ogg`
- UI 點擊整包（100 個，適合做 3 個變體）：https://kenney.nl/assets/interface-sounds
- UI click 整包（50 個）：https://kenney.nl/assets/ui-audio
- 短 click（極短，可自己加 reverb）：https://freesound.org/s/370962/

### `cardSelectOK.ogg`
- Coin pickup（短、清楚）：https://freesound.org/people/SoundDesignForYou/sounds/646672/
- Coin pickup（更短）：https://freesound.org/s/347172/

### `cardSelectFail.ogg` / `error.mp3`
- 錯誤蜂鳴包（一包多種）：https://freesound.org/people/Breviceps/sounds/493163/
- Impact 類重擊/失敗感替代：https://kenney.nl/assets/impact-sounds

### `clear9.mp3` / `clear19.mp3` / `clear29.mp3`
- Coin pickup V0.2（可作 clear9）：https://freesound.org/s/347174/
- Coin pickup SFX [2]（可作 clear19）：https://freesound.org/people/SoundDesignForYou/sounds/646672/
- Success/transition 類（可作 clear29）：https://freesound.org/people/BrodieSound/sounds/612072/

### `recycle.mp3`
- Tape rewind（名副其實的倒帶感）：https://freesound.org/people/simplewave/sounds/372876/
- Whoosh 組（可挑短 reverse 當 recycle/rewind）：https://freesound.org/people/susssounds/sounds/752068/

### `deadlock.mp3`
- Error buzzer 包（偏「失敗/受阻」語義）：https://freesound.org/people/Breviceps/sounds/493163/
- Digital/Sci-fi 警示類音色包：https://kenney.nl/assets/digital-audio

### `win.mp3`
- Success Jingle（完整勝利感）：https://freesound.org/people/Kastenfrosch/sounds/521949/
- You've succeeded（更 arcade）：https://freesound.org/people/Rolly-SFX/sounds/626259/
- Music jingle 套件（可挑更短結算）：https://kenney.nl/assets/music-jingles

### `bgm.mp3`
- 背景 loop（短迴圈，可再接長）：https://freesound.org/s/368730/
- 音樂短句包（CC0，可剪接成 menu/battle loop）：https://kenney.nl/assets/music-jingles

## 2) 我建議的「先換順序」
1. 先換 `recycle.mp3` -> `372876`，最能體現「倒帶」。
2. 再換 `deadlock.mp3` / `error.mp3` -> `493163` 裡挑兩個不同層級。
3. 最後換 `clear*` 與 `win.mp3`，把成功回饋做出階梯感。

## 3) 下載與整理
- Freesound 下載通常需要登入。
- 先把原檔放在 `rewind_sfx_sources/raw/`（可自行建立）。
- 處理後輸出放在 `rewind_sfx_sources/processed/`。
- 匯入遊戲前，建議統一 `-14 ~ -12 LUFS`，避免某顆音突然爆大。
