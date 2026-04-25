const { test, expect } = require('@playwright/test');

test.describe.configure({ timeout: 60000 });

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        localStorage.removeItem('lucky3-current-game');
        localStorage.setItem('lucky3-premium', 'true');
        localStorage.removeItem('lucky3-daily-wins-v2'); // 每個測試從 0 勝開始
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const homeVisible = await page.locator('#home-screen').isVisible().catch(() => false);
    if (homeVisible) {
        await page.evaluate(() => {
            if (typeof window.homeNewGame === 'function') window.homeNewGame();
        });
        await expect(page.locator('#home-screen')).not.toBeVisible({ timeout: 10000 });
    }
    await expect(page.locator('#deck-pile')).toBeVisible({ timeout: 30000 });
});

test('第一勝後 win panel 顯示 1 個 filled dot 和 70% 提示', async ({ page }) => {
    await page.evaluate(() => {
        slots.forEach(s => { s.cards = []; });
        slots[0].cards = [{ rank: '3', suit: '♠', val: 3, color: 'black' }];
        deck.length = 0;
        hasWon = false;
        winCardSuit = '';
        checkVictory();
    });

    await expect(page.locator('#win-overlay')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.win-today-progress')).toBeVisible();
    await expect(page.locator('.today-dot.filled')).toHaveCount(1);
    await expect(page.locator('.win-today-hint')).toContainText('70%');
});

test('zero-clear 勝利也顯示進度帶和 70% 提示', async ({ page }) => {
    await page.evaluate(() => {
        slots.forEach(s => { s.cards = []; });
        deck.length = 0;
        hasWon = false;
        winCardSuit = '';
        checkVictory();
    });

    await expect(page.locator('#win-overlay')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('.win-today-progress')).toBeVisible();
    await expect(page.locator('.today-dot.filled')).toHaveCount(1);
    await expect(page.locator('.win-today-hint')).toContainText('70%');
});
