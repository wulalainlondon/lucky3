// @ts-check
const { test, expect } = require('@playwright/test');

test.describe.configure({ timeout: 90000 });

async function waitReady(page) {
    const homeVisible = await page.locator('#home-screen').isVisible().catch(() => false);
    if (homeVisible) {
        await page.evaluate(() => {
            if (typeof window.homeNewGame === 'function') window.homeNewGame();
        });
        await expect(page.locator('#home-screen')).not.toBeVisible({ timeout: 10000 });
    }
    await expect(page.locator('#deck-pile')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('.flying')).toHaveCount(0, { timeout: 15000 });
}

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        localStorage.setItem('lucky3-premium', 'true');
    });
    await page.goto('/app/index.html', { waitUntil: 'domcontentloaded' });
    await waitReady(page);
});

test('cardback selection persists and updates deck class', async ({ page }) => {
    await page.locator('.header-settings').click();
    await page.evaluate(() => {
        switchSettingsTab(3);
        if (typeof window.renderCardBackGrid === 'function') window.renderCardBackGrid();
    });

    const retro = page.locator('.cb-item', { has: page.locator('.cb-preview-retro_gold') });
    await expect(retro).not.toHaveClass(/cb-locked/);
    await retro.click();

    await expect(page.locator('#deck-pile')).toHaveClass(/cb-retro_gold/);
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('lucky3-card-back-v1'))).toBe('retro_gold');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await waitReady(page);
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('lucky3-card-back-v1'))).toBe('retro_gold');
    await page.evaluate(() => {
        if (typeof window.loadCardBack === 'function') window.loadCardBack();
    });
    await expect(page.locator('#deck-pile')).toHaveClass(/cb-retro_gold/);

    await page.locator('.header-settings').click();
    await page.evaluate(() => {
        switchSettingsTab(3);
        if (typeof window.renderCardBackGrid === 'function') window.renderCardBackGrid();
    });
    const classic = page.locator('.cb-item', { has: page.locator('.cb-preview-classic') });
    await classic.click();

    await expect(page.locator('#deck-pile')).not.toHaveClass(/cb-retro_gold/);
    await expect.poll(async () => page.evaluate(() => localStorage.getItem('lucky3-card-back-v1'))).toBe('classic');
});
