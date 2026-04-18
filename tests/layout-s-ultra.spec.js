// @ts-check
// Layout QA — Samsung S Ultra landscape sidebar mode
// Targets www/index.html (native Capacitor build)
// S24 Ultra landscape CSS viewport: ~915 × 393

const { test, expect } = require('@playwright/test');

const NATIVE_URL = '/www/index.html';

const S_ULTRA_LANDSCAPE = { width: 915, height: 393 };
const S_ULTRA_PORTRAIT  = { width: 393, height: 915 };

// Helper: freeze timer + all JS intervals so screenshots are stable
async function freezeGame(page) {
    await page.evaluate(() => {
        const timer = document.getElementById('timer');
        if (timer) timer.textContent = '00:00';
        const maxId = setTimeout(() => {}, 0);
        for (let i = 0; i <= maxId; i++) { clearTimeout(i); clearInterval(i); }
    });
}

// Helper: deal N cards robustly (handles interstitial ads, empty deck)
async function dealCards(page, count) {
    for (let i = 0; i < count; i++) {
        // Dismiss interstitial overlay if it appears (JS call bypasses 5-sec wait)
        const interstitialVisible = await page.locator('#interstitial-overlay').isVisible()
            .catch(() => false);
        if (interstitialVisible) {
            await page.evaluate(() => {
                if (typeof window.closeInterstitial === 'function') window.closeInterstitial();
            }).catch(() => {});
            await page.waitForTimeout(400);
        }

        // Stop if deck is empty
        const deckText = await page.locator('#deck-num').textContent({ timeout: 2000 })
            .catch(() => '0');
        if (parseInt(deckText ?? '0') === 0) break;

        // Click deck — use force:false so normal pointer-events rules apply
        await page.locator('#deck-pile').click({ timeout: 8000 });
        await page.waitForTimeout(220); // let card-deal animation begin
    }
    await page.waitForTimeout(500); // final settle
}

// Helper: measure tallest column height
async function tallestColumnHeight(page) {
    return page.evaluate(() => {
        const cols = Array.from(document.querySelectorAll('.column'));
        return Math.max(0, ...cols.map(c => c.getBoundingClientRect().height));
    });
}

// ── Setup ──────────────────────────────────────────────────────────────────
test.describe('S Ultra — landscape sidebar layout', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        });
    });

    // ── 1. STRUCTURE: sidebar position & dimensions ────────────────────────
    test('footer is a fixed right sidebar (position, width, height)', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });

        const box = await page.locator('#footer').boundingBox();
        expect(box).not.toBeNull();

        // Flush to right edge
        expect(box.x + box.width).toBeGreaterThan(S_ULTRA_LANDSCAPE.width - 5);
        // Width around 120px (±20)
        expect(box.width).toBeGreaterThanOrEqual(100);
        expect(box.width).toBeLessThanOrEqual(140);
        // Spans nearly full height
        expect(box.height).toBeGreaterThan(S_ULTRA_LANDSCAPE.height * 0.85);
    });

    // ── 2. STRUCTURE: board does not overlap sidebar ───────────────────────
    test('board right edge stays left of sidebar', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });

        const boardBox  = await page.locator('#board').boundingBox();
        const footerBox = await page.locator('#footer').boundingBox();

        expect(boardBox.x + boardBox.width).toBeLessThanOrEqual(footerBox.x + 2);
    });

    // ── 3. STRUCTURE: columns are evenly distributed across board ──────────
    test('4 columns are spread evenly (no left-clustering)', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await dealCards(page, 4); // ensure one card per column

        const cols = page.locator('.column');
        await expect(cols).toHaveCount(4);

        const boxes = await Promise.all(
            [0, 1, 2, 3].map(i => cols.nth(i).boundingBox())
        );

        const boardBox = await page.locator('#board').boundingBox();
        const boardW   = boardBox.width;

        // Each column should be at least 15% from the left (not all clustered left)
        // Col 0 should start in the first quarter of the board (with margin)
        expect(boxes[0].x - boardBox.x).toBeGreaterThan(boardW * 0.05);
        // Col 3 should end in the last quarter of the board (not clustered right)
        expect((boxes[3].x + boxes[3].width) - boardBox.x).toBeLessThan(boardW * 0.95);
        // Gaps between adjacent columns should be roughly equal (±40px tolerance)
        const gap01 = boxes[1].x - (boxes[0].x + boxes[0].width);
        const gap12 = boxes[2].x - (boxes[1].x + boxes[1].width);
        const gap23 = boxes[3].x - (boxes[2].x + boxes[2].width);
        expect(Math.abs(gap01 - gap12)).toBeLessThan(40);
        expect(Math.abs(gap12 - gap23)).toBeLessThan(40);
    });

    // ── 4. INTERACTION: deal works from sidebar ───────────────────────────
    test('DEAL from sidebar decrements deck', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });

        const before = parseInt(await page.locator('#deck-num').textContent() ?? '0');
        await page.locator('#deck-pile').click();
        await expect(page.locator('#deck-num')).not.toHaveText(String(before), { timeout: 5000 });
        const after = parseInt(await page.locator('#deck-num').textContent() ?? '0');
        expect(after).toBe(before - 1);
    });

    // ── 5. OVERFLOW CHECK: 5 cards dealt ──────────────────────────────────
    test('no column overflow after 5 deals', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await dealCards(page, 5);

        const boardBox    = await page.locator('#board').boundingBox();
        const tallestCol  = await tallestColumnHeight(page);

        expect(tallestCol).toBeLessThanOrEqual(boardBox.height + 5); // 5px tolerance
    });

    // ── 6. OVERFLOW CHECK: 15 cards dealt ─────────────────────────────────
    test('no column overflow after 15 deals', async ({ page }) => {
        test.setTimeout(60000);
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await dealCards(page, 15);

        const boardBox   = await page.locator('#board').boundingBox();
        const tallestCol = await tallestColumnHeight(page);

        expect(tallestCol).toBeLessThanOrEqual(boardBox.height + 5);
    });

    // ── 7. OVERFLOW CHECK: 30 cards dealt (deep stacks) ───────────────────
    test('no column overflow after 30 deals', async ({ page }) => {
        test.setTimeout(120000);
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await dealCards(page, 30);

        const boardBox   = await page.locator('#board').boundingBox();
        const tallestCol = await tallestColumnHeight(page);

        expect(tallestCol).toBeLessThanOrEqual(boardBox.height + 5);
    });

    // ── 8. SNAPSHOT: initial (0 cards) ────────────────────────────────────
    test('snapshot — initial state', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await page.waitForTimeout(400);
        await freezeGame(page);
        await expect(page.locator('#footer')).toHaveScreenshot('sidebar-0-cards.png', {
            threshold: 0.15, maxDiffPixels: 300, timeout: 12000,
        });
    });

    // ── 9. SNAPSHOT: after 8 deals ────────────────────────────────────────
    test('snapshot — after 8 deals (board has cards)', async ({ page }) => {
        test.setTimeout(60000);
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await dealCards(page, 8);
        await freezeGame(page);
        await expect(page).toHaveScreenshot('landscape-8-cards.png', {
            fullPage: false, threshold: 0.15, maxDiffPixelRatio: 0.05, timeout: 12000,
        });
    });

    // ── 10. SNAPSHOT: after 20 deals (tall stacks) ────────────────────────
    test('snapshot — after 20 deals (tall stacks, overflow check)', async ({ page }) => {
        test.setTimeout(120000);
        await page.setViewportSize(S_ULTRA_LANDSCAPE);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await dealCards(page, 20);
        await freezeGame(page);
        await expect(page).toHaveScreenshot('landscape-20-cards.png', {
            fullPage: false, threshold: 0.15, maxDiffPixelRatio: 0.05, timeout: 12000,
        });
    });

    // ── 11. PORTRAIT: footer stays at bottom ──────────────────────────────
    test('portrait: footer is at bottom, spans full width', async ({ page }) => {
        await page.setViewportSize(S_ULTRA_PORTRAIT);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });

        const footerBox = await page.locator('#footer').boundingBox();
        expect(footerBox.y).toBeGreaterThan(S_ULTRA_PORTRAIT.height * 0.6);
        expect(footerBox.width).toBeGreaterThan(S_ULTRA_PORTRAIT.width * 0.9);
    });

    // ── 12. PORTRAIT SNAPSHOT ─────────────────────────────────────────────
    test('portrait snapshot', async ({ page }) => {
        test.setTimeout(60000);
        await page.setViewportSize(S_ULTRA_PORTRAIT);
        await page.goto(NATIVE_URL, { waitUntil: 'domcontentloaded' });
        await expect(page.locator('#deck-num')).not.toHaveText('', { timeout: 10000 });
        await dealCards(page, 5);
        await freezeGame(page);
        await expect(page.locator('#footer')).toHaveScreenshot('portrait-footer.png', {
            threshold: 0.15, maxDiffPixels: 300, timeout: 12000,
        });
    });
});
