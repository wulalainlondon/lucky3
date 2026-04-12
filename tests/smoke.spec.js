// @ts-check
const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
});

// ── Test 1: Page loads correctly ───────────────────────────────────────────
test('page loads with correct title and game UI', async ({ page }) => {
    // Title is translated per locale; just verify "Lucky 3" prefix
    await expect(page).toHaveTitle(/Lucky 3/);
    await expect(page.locator('#board')).toBeVisible();
    await expect(page.locator('#deck-pile')).toBeVisible();
    await expect(page.locator('#btn-clear')).toBeVisible();
    await expect(page.locator('#btn-undo')).toBeVisible();
    await expect(page.locator('#timer')).toBeVisible();
});

// ── Test 2: DEAL button decrements deck counter ────────────────────────────
test('DEAL decrements deck count and adds card to board', async ({ page }) => {
    const deckBefore = parseInt(await page.locator('#deck-num').textContent() ?? '0');
    await page.locator('#deck-pile').click();
    // Wait for deck-num to actually change rather than a fixed timeout
    await expect(page.locator('#deck-num')).not.toHaveText(String(deckBefore), { timeout: 3000 });
    const deckAfter = parseInt(await page.locator('#deck-num').textContent() ?? '0');
    expect(deckAfter).toBe(deckBefore - 1);
    await expect(page.locator('.card').first()).toBeVisible();
});

// ── Test 3: Card selection updates MATCH 3 button state ───────────────────
test('selecting cards changes MATCH 3 button visual state', async ({ page }) => {
    // One deal is enough to have a card to click
    const deckBefore = parseInt(await page.locator('#deck-num').textContent() ?? '99');
    await page.locator('#deck-pile').click();
    await expect(page.locator('#deck-num')).not.toHaveText(String(deckBefore), { timeout: 5000 });
    // Wait for isBusy to clear (card animation done)
    await expect(page.locator('.card').first()).toBeVisible({ timeout: 5000 });

    const btnClear = page.locator('#btn-clear');
    await expect(btnClear).not.toHaveClass(/match-partial|match-ready/);

    // Click first card → partial state
    await page.locator('.card').first().click();
    await expect(btnClear).toHaveClass(/match-partial/, { timeout: 3000 });
});

// ── Test 4: Undo disabled initially, enabled after DEAL ──────────────────
test('undo button disabled initially and enabled after DEAL', async ({ page }) => {
    await expect(page.locator('#btn-undo')).toBeDisabled();
    const deckBefore = parseInt(await page.locator('#deck-num').textContent() ?? '99');
    await page.locator('#deck-pile').click();
    await expect(page.locator('#deck-num')).not.toHaveText(String(deckBefore), { timeout: 3000 });
    await expect(page.locator('#btn-undo')).toBeEnabled();
    await page.locator('#btn-undo').click();
    await expect(page.locator('#btn-undo')).toBeDisabled({ timeout: 3000 });
});

// ── Test 5: Settings panel and language switching ─────────────────────────
test('settings panel opens and language switching updates UI', async ({ page }) => {
    await page.locator('.header-settings').click();
    await expect(page.locator('.settings-panel')).toBeVisible();

    // Switch to English
    await page.locator('#setting-language').selectOption('en');
    await expect(page.locator('#deck-label')).toHaveText('DECK', { timeout: 3000 });

    // Close: panel is taller than mobile viewport, call via JS
    await page.evaluate(() => window.toggleSettings(false));
    await expect(page.locator('.settings-panel')).not.toBeVisible({ timeout: 3000 });
});

// ── Test 6: manifest.json is valid PWA manifest ───────────────────────────
test('manifest.json is a valid PWA manifest', async ({ page }) => {
    const response = await page.request.get('/manifest.json');
    expect(response.status()).toBe(200);
    const manifest = await response.json();
    expect(manifest.name).toBe('Lucky 3 Solitaire');
    expect(manifest.display).toBe('fullscreen');
    expect(manifest.theme_color).toBe('#051d0e');
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
});
