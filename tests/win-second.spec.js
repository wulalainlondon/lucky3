const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        localStorage.removeItem('lucky3-current-game');
        localStorage.setItem('lucky3-premium', 'true');
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

test('second win shows win panel and has no JS errors', async ({ page }) => {
    const errors = [];
    const ignorablePatterns = [
        /Failed to load resource: the server responded with a status of 400/i,
        /Anonymous auth failed:/i,
        /auth\/too-many-requests/i,
    ];
    page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
    });

    // 第一局勝利
    await page.evaluate(() => {
        slots.forEach(s => { s.cards = []; });
        slots[0].cards = [{ rank: '3', suit: '♠', val: 3, color: 'black' }];
        deck.length = 0;
        hasWon = false;
        winCardSuit = '';
        checkVictory();
    });
    await expect(page.locator('#win-overlay')).toBeVisible({ timeout: 10000 });

    // 點 Play Again → 第二局
    await page.locator('.win-play-again').click();
    await expect(page.locator('#win-overlay')).not.toBeVisible({ timeout: 15000 });
    await expect(page.locator('#deck-pile')).toBeVisible({ timeout: 30000 });

    // 第二局勝利
    await page.evaluate(() => {
        slots.forEach(s => { s.cards = []; });
        slots[0].cards = [{ rank: '3', suit: '♥', val: 3, color: 'red' }];
        deck.length = 0;
        hasWon = false;
        winCardSuit = '';
        checkVictory();
    });

    // 第二局 win panel 必須出現
    await expect(page.locator('#win-overlay')).toBeVisible({ timeout: 10000 });

    // 必須沒有產品內 JS 錯誤（排除外部 Firebase 匿名登入節流噪音）
    const productErrors = errors.filter((text) => !ignorablePatterns.some((re) => re.test(text)));
    expect(productErrors, 'JS errors: ' + productErrors.join('; ')).toHaveLength(0);
});
