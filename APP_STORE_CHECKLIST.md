# Lucky 3 Solitaire — App Store 上架清單

## Xcode 必要設定（手動完成）

### Info.plist
- UIViewControllerBasedStatusBarAppearance = NO
- UIStatusBarStyle = UIStatusBarStyleLightContent
- UILaunchStoryboardName = LaunchScreen

### 能力設定 (Signing & Capabilities)
- Bundle ID: com.lucky3.solitaire
- Team: [填入你的 Apple Developer Team]

### App Icons
- ✅ icon-1024.png 已生成：app/icon-1024.png
- resources/icon.png 已就位，執行 `npx @capacitor/assets generate --ios` 可自動填滿 iOS 所有尺寸

## App Store Connect 設定

### 基本資訊
- 名稱: Lucky 3 Solitaire
- 副標題: 三張一組的紙牌挑戰
- 類別: 遊戲 > 紙牌遊戲
- 年齡分級: 4+（無不當內容、無真實賭博）
- 隱私權政策 URL: https://wulalainlondon.github.io/lucky3/app/privacy-policy.html

### 截圖規格
- 6.7" iPhone（1290 × 2796）
- 6.1" iPhone（1179 × 2556）
- 可選：5.5" iPhone

### App 審查備注
"This is a card solitaire game where players match groups of 3 cards that sum to 10, 20, or 30. 
No real money gambling. No in-app purchases. No ads. 
Uses localStorage for settings/scores only."

## 打包指令

```bash
# 同步 web assets 到 iOS
npx cap sync ios

# 開啟 Xcode
npx cap open ios
```

## 常見問題
- Firebase SDK apiKey 是公開金鑰，可以出現在代碼中（符合 Firebase 設計）
- ServiceWorker 在 Capacitor 中已透過 guard 停用，不會報錯
- Haptics 需要實機測試，模擬器不支援震動
