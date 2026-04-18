// @ts-check
// Layout QA — Samsung S Ultra landscape sidebar mode
// Targets www/index.html (native Capacitor build)
// S24 Ultra landscape CSS viewport: ~915 × 393

const { test, expect } = require('@playwright/test');

const NATIVE_URL = '/www/index.html';

// S24 Ultra landscape dimensions (CSS pixels at DPR ~3.5)
const S_ULTRA_LANDSCAPE = { width: 915, height: 393 };
const S_ULTRA_PORTRAIT  = { width: 393, height: 915 };

test.describe('S Ultra — sidebar layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        });
    });

    // ── Landscape: sidebar exists and footer is positioned right ───────────
    test('landscape: footer renders as fixed right sidebar', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });

        const footer = page.locator('#footer');
        await expect(footer).toBeVisible();

        const box = await footer.boundingBox();
        expect(box).not.toBeNull();

        // Footer should be flush against the right edge
        expect(box.x + box.width).toBeGreaterThan(S_ULTRA_LANDSCAPE.width - 5);
        // Footer should be ~160px wide
        expect(box.width).toBeGreaterThanOrEqual(140);
        expect(box.width).toBeLessThanOrEqual(180);
        // Footer should span (nearly) full height
        expect(box.height).toBeGreaterThan(S_ULTRA_LANDSCAPE.height * 0.8);
    });

    // ── Landscape: board does not overflow into sidebar ────────────────────
    test('landscape: board right edge does not overlap sidebar', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });

        const boardBox  = await page.locator('#board').boundingBox();
        const footerBox = await page.locator('#footer').boundingBox();
        expect(boardBox).not.toBeNull();
        expect(footerBox).not.toBeNull();

        // Board's right edge must be to the left of footer's left edge
        expect(boardBox.x + boardBox.width).toBeLessThanOrEqual(footerBox.x + 5);
    });

    // ── Landscape: deal and undo are visible in sidebar ───────────────────
    test('landscape: DEAL pile and UNDO button visible in sidebar', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });

        await expect(page.locator('#deck-pile')).toBeVisible();
        await expect(page.locator('#btn-undo')).toBeVisible();
        await expect(page.locator('#discard-pile')).toBeVisible();
    });

    // ── Landscape: DEAL interaction works ─────────────────────────────────
    test('landscape: DEAL decrements deck count', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });

        const before = parseInt(await page.locator('#deck-num').textContent() ?? '0');
        await page.locator('#deck-pile').click();
        await expect(page.locator('#deck-num')).not.toHaveText(String(before), { timeout: 5000 });
        const after = parseInt(await page.locator('#deck-num').textContent() ?? '0');
        expect(after).toBe(before - 1);
    });

    // ── Landscape snapshot: sidebar only (stable, no random FX) ──────────
    test('landscape: sidebar snapshot', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await page.waitForTimeout(400);
        // Freeze timer and clear all intervals for screenshot stability
        await page.evaluate(() => {
            const timer = document.getElementById('timer');
            if (timer) timer.textContent = '00:00';
            const maxId = setTimeout(() => {}, 0);
            for (let i = 0; i <= maxId; i++) { clearTimeout(i); clearInterval(i); }
        });
        // Snapshot just the sidebar footer (no random FX in this element)
        await expect(page.locator('#footer')).toHaveScreenshot('s-ultra-sidebar.png', {
            threshold: 0.15,
            maxDiffPixels: 300, // allow minor emoji/font sub-pixel variation
            timeout: 15000,
        });
    });

    // ── Portrait: normal column layout intact ─────────────────────────────
    test('portrait: footer stays at bottom (no sidebar)', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_PORTRAIT);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });

        const footer  = page.locator('#footer');
        const footerBox = await footer.boundingBox();
        expect(footerBox).not.toBeNull();

        // In portrait the footer is at the bottom — its top > 60% of viewport
        expect(footerBox.y).toBeGreaterThan(S_ULTRA_PORTRAIT.height * 0.6);
        // Footer should span full width in portrait
        expect(footerBox.width).toBeGreaterThan(S_ULTRA_PORTRAIT.width * 0.9);
    });

    // ── Portrait snapshot: footer bar (stable, no random FX) ─────────────
    test('portrait: footer bar snapshot', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_PORTRAIT);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await page.waitForTimeout(400);
        // Freeze timer
        await page.evaluate(() => {
            const timer = document.getElementById('timer');
            if (timer) timer.textContent = '00:00';
            const maxId = setTimeout(() => {}, 0);
            for (let i = 0; i <= maxId; i++) { clearTimeout(i); clearInterval(i); }
        });
        await expect(page.locator('#footer')).toHaveScreenshot('s-ultra-portrait-footer.png', {
            threshold: 0.15,
            maxDiffPixels: 300,
            timeout: 15000,
        });
    });
});
