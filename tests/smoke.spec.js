// @ts-check
const { test, expect } = require('@playwright/test');
test.describe.configure({ timeout: 90000 });

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    // Wait for the game to be fully initialised: omen card shown+dismissed
    // (~2150ms) and opening deal animation complete (~6455ms more). With the
    // WAAPI fallback added to runOpeningDealAnimation, window._gameReady is
    // reliably set in headless CI even without vsync.
    // This also ensures the omen card is gone before tests interact with the
    // UI — the omen card (position:fixed; inset:0) can block Playwright's
    // hit-target check even though it has pointer-events:none.
    await page.waitForFunction(() => window._gameReady === true, { timeout: 30000 });
});

// ── Test 1: Page loads correctly ───────────────────────────────────────────
test('page loads with correct title and game UI', async ({ page }) => {
    await expect(page).toHaveTitle(/Lucky 3/);
    await expect(page.locator('#board')).toBeVisible();
    await expect(page.locator('#deck-pile')).toBeVisible();
    await expect(page.locator('#btn-undo')).toBeVisible();
    await expect(page.locator('#discard-pile')).toBeVisible();
    await expect(page.locator('#timer')).toBeVisible();
});

// ── Test 2: DEAL button decrements deck counter ────────────────────────────
test('DEAL decrements deck count and adds card to board', async ({ page }) => {
    const deckBefore = parseInt(await page.locator('#deck-num').textContent() ?? '0');
    await page.locator('#deck-pile').click();
    await expect(page.locator('#deck-num')).not.toHaveText(String(deckBefore), { timeout: 3000 });
    const deckAfter = parseInt(await page.locator('#deck-num').textContent() ?? '0');
    expect(deckAfter).toBe(deckBefore - 1);
    await expect(page.locator('.card').first()).toBeVisible();
});

// ── Test 3: Card selection adds .selected class ───────────────────────────
// (Lucky 3 auto-eliminates matches; there is no manual CLEAR button)
test('clicking a card adds selected class', async ({ page }) => {
    const deckBefore = parseInt(await page.locator('#deck-num').textContent() ?? '99');
    await page.locator('#deck-pile').click();
    await expect(page.locator('#deck-num')).not.toHaveText(String(deckBefore), { timeout: 5000 });
    // Wait for the deal animation to fully finish: flying element disappears only
    // after the card is placed in its slot and isBusy is set back to false.
    // Without this wait, clicking while isBusy=true causes the game to ignore the click.
    await expect(page.locator('.flying')).toHaveCount(0, { timeout: 5000 });

    const card = page.locator('.column').first().locator('.card').last();
    await expect(card).not.toHaveClass(/selected/);
    await card.click();
    await expect(card).toHaveClass(/selected/, { timeout: 5000 });
});

// ── Test 4: Undo disabled initially, enabled after DEAL ──────────────────
test('undo button disabled initially and enabled after DEAL', async ({ page }) => {
    await expect(page.locator('#btn-undo')).toBeDisabled();
    const deckBefore = parseInt(await page.locator('#deck-num').textContent() ?? '99');
    await page.locator('#deck-pile').click();
    await expect(page.locator('#deck-num')).not.toHaveText(String(deckBefore), { timeout: 3000 });
    // Wait for deal animation to finish before attempting undo.
    // The game's undo() function checks isBusy and returns early if true.
    await expect(page.locator('.flying')).toHaveCount(0, { timeout: 5000 });
    await expect(page.locator('#btn-undo')).toBeEnabled();
    await page.locator('#btn-undo').click();
    await expect(page.locator('#btn-undo')).toBeDisabled({ timeout: 3000 });
});

// ── Test 5: Settings panel and language switching ─────────────────────────
test('settings panel opens and language switching updates UI', async ({ page }) => {
    await page.locator('.header-settings').click();
    await expect(page.locator('.settings-panel')).toBeVisible();

    // Language selector is in Profile tab (tab 1). Use JS to switch tabs
    // to avoid timing issues with animation-blocked element actionability.
    await page.evaluate(() => switchSettingsTab(1));
    // Ensure the newly active tab pane is rendered before interacting.
    await expect(page.locator('#setting-language')).toBeVisible({ timeout: 3000 });
    await page.locator('#setting-language').selectOption('en');
    await expect(page.locator('#deck-label')).toHaveText('DECK', { timeout: 3000 });

    await page.evaluate(() => window.toggleSettings(false));
    await expect(page.locator('.settings-panel')).not.toBeVisible({ timeout: 5000 });
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
