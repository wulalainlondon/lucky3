const { test, expect } = require('@playwright/test');

test.setTimeout(60000);

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        localStorage.removeItem('lucky3-current-game');
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForFunction(() => window._gameReady === true, { timeout: 45000 });
});

test('second win shows win panel and has no JS errors', async ({ page }) => {
    const errors = [];
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
    await page.waitForFunction(() => window._gameReady === true, { timeout: 30000 });

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

    // 必須沒有 JS 錯誤
    expect(errors, 'JS errors: ' + errors.join('; ')).toHaveLength(0);
});
