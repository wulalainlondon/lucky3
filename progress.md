Original prompt: 行動裝置操作區放大：RESTART、timer、上方文字偏小，建議提高字級與可點擊區，減少誤觸。結束畫面完整化：Lucky 3 勝利已有特效，建議再加統計面板（用時、總步數、連擊）與「再來一局」。先做這兩個。

## 2026-02-03
- Enlarged top header controls for mobile: deck text, title, timer pill, and restart button now have larger font sizes and larger tap targets.
- Replaced inline header styles with reusable classes for cleaner responsive tuning.
- Added narrow-landscape header tuning (`orientation: landscape` + `max-height: 430px`) so iPhone SE-like layouts keep controls readable without crowding.
- Added win overlay panel with summary stats:
  - elapsed time
  - total moves
  - max combo
  - "再來一局" button to restart immediately.
- Added runtime counters: `moveCount`, `maxCombo`, and `hasWon` guard to avoid duplicate win overlays.
- Added personal best tracking (localStorage key: `lucky3-best-stats`) and a highlighted win message when this run breaks fastest-time / fewest-moves / highest-combo records.
- Updated recycle rule: removed random recycle shuffle and now restore cards by clear-group order, with the first cleared group placed at deck top.
- Updated win condition: win now triggers when only one card remains on board and its value is 3 (deck count no longer required).
- Added "咪牌" tension moment when a column has 2 cards and is about to receive the 3rd:
  - deal animation pauses briefly,
  - flying card performs a peek/shake animation,
  - column shows a short status badge,
  - badge highlights when the incoming 3-card sum can immediately form 9/19/29.
- Fixed mii visibility bug: mii deal now flies in as a face-down card first, then reveals during the peek moment (no early rank/suit leak while landing).
- Added "cheat" opening deck rule: bottom card is now guaranteed to be a randomly selected suit of 3; the remaining 39 cards are shuffled and dealt first from the top.
- Added deadlock detection UX: when deck/recycle are empty and no legal 9/19/29 clear exists, show a modal with options to undo one step or start a new game.
- Added autosave/resume for current run (localStorage key: `lucky3-current-game`), so reopening the page restores deck/board/history/timer progress.
- Tuned stack overlap to `-18vw`, and refined mii deal landing by using measured stack geometry for fly target position plus a short landing pop animation on the dealt card.
- Improved PWA update behavior: service worker now activates immediately, claims clients, checks for updates in the background, and auto-reloads users onto the latest version when a new SW is installed.

## Notes
- `moveCount` increments on successful deal and successful clear; decrements on undo.
- `maxCombo` tracks peak combo reached during run.
- Validation: script syntax check passed with `node` (`js-ok`); Playwright client is present but local `playwright` package is missing, so full automated visual loop did not run in this pass.

## TODO / Suggestions
- Consider showing a compact running stats widget during gameplay (current combo / moves).
- Add a small sound toggle and reduced-motion setting for accessibility.
