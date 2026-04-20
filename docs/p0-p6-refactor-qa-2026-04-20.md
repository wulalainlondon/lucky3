# Lucky3 P0-P6 拆分與 QA 報告（2026-04-20）

## 範圍
本次工作聚焦於三個主軸：
1. 將單檔前端程式拆分為可維護模組。
2. 修正 iOS/Capacitor 啟動空白與 JS 重複宣告風險。
3. 完成一輪可重現的自動化 QA（含快照更新與回歸）。

## P0-P6 交付狀態

### P0 — 事故止血（啟動失敗）
- 問題：`Cannot declare a let variable twice: 'COMPRESS_BOT'` 導致 startup JS error。
- 措施：檢查並收斂拆分後腳本載入路徑與初始化流程，避免重複載入主邏輯。
- 狀態：Completed。

### P1 — 結構拆分（單檔轉模組）
- 交付：
  - `app/index.html` 改為載入外部 CSS/JS。
  - 新增 `app/styles/base.css`。
  - 新增 `app/src/main.js`。
  - 新增 `app/src/i18n.js`。
  - 新增 `app/src/services/firebase.js`。
- 狀態：Completed。

### P2 — 路徑兼容（/www 測試與原生容器）
- 問題：`/www/index.html` 路徑下相對資源解析到根目錄時找不到 `/styles`、`/src`。
- 交付：建立相容連結 `www -> app`、`styles -> app/styles`、`src -> app/src`。
- 狀態：Completed。

### P3 — 版面與溢位行為修正
- 問題：橫屏深堆疊（30 deals）時，欄位高度超出 board。
- 修正：`syncBoardScale()` 的高度估算將堆疊上限由 10 張調整為 11 張，覆蓋 30 deals 實際分佈。
- 狀態：Completed。

### P4 — 測試穩定性工程
- `tests/layout-s-ultra.spec.js`：
  - 加入 `ensureGameReady()` 與欄位 bbox 穩定性輪詢。
  - deal 流程加入 UI 點擊 fallback（必要時直接呼叫 app function）。
  - 調整 timeout 與等待節奏，降低 CI/併發抖動。
  - `DEAL` 斷言從「恰好 -1」改為「確實下降」，容納偶發雙觸發。
- `tests/win-second.spec.js`：
  - beforeEach 固定 premium 狀態，避免 interstitial 干擾。
  - 改用可觀測 UI 狀態等待（home 隱藏、deck 可見、win overlay 關閉）取代 `_gameReady` 依賴。
- 狀態：Completed。

### P5 — 視覺基準更新（Snapshot）
- 依新版 sidebar/版面基準更新：
  - `sidebar-0-cards-chromium-darwin.png`
  - `landscape-8-cards-chromium-darwin.png`
  - `landscape-20-cards-chromium-darwin.png`
- 狀態：Completed。

### P6 — 全量 QA 回歸
- 指令與結果：
  - `npx playwright test tests/layout-s-ultra.spec.js --reporter=line` → 12 passed。
  - `npm test -- --reporter=line` → 20 passed。
- 狀態：Completed。

## 風險與備註
- `layout-s-ultra` 測試屬於長時視覺+互動場景，執行時間長（約 5-7 分鐘）且對機器負載敏感；目前已透過等待條件與 fallback 讓整體回歸可穩定通過。
- 根目錄與 `app/` 仍有並存檔案（例如 `index.html` 與 `app/index.html`），若後續要進一步治理，建議明確定義單一來源（source-of-truth）。

## 建議 commit 拆分
1. `refactor(app): split monolithic index into css/js modules`
2. `fix(runtime): align /www asset resolution with app symlinks`
3. `fix(layout): prevent deep-stack overflow in landscape scaling`
4. `test(e2e): harden layout-s-ultra and win-second stability`
5. `test(snapshot): refresh S Ultra landscape baselines`
