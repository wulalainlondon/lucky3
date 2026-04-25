// @ts-check
const { test, expect } = require('@playwright/test');

test.describe.configure({ timeout: 120000 });

function getBgFileName(bg) {
    const clean = String(bg || '')
        .replace(/^url\((['"]?)/, '')
        .replace(/(['"]?)\)$/, '');
    const parts = clean.split('/').filter(Boolean);
    return parts.length ? parts[parts.length - 1] : '';
}

function card(rank, suit) {
    const val = rank === 'A' ? 1 : parseInt(rank, 10);
    const color = suit === '♥' || suit === '♦' ? 'red' : 'black';
    return { rank, suit, val, color };
}

async function waitReady(page) {
    const homeVisible = await page.locator('#home-screen').isVisible().catch(() => false);
    if (homeVisible) {
        await page.evaluate(() => {
            if (typeof window.homeNewGame === 'function') window.homeNewGame();
        });
        await expect(page.locator('#home-screen')).not.toBeVisible({ timeout: 10000 });
    }
    await expect(page.locator('#deck-pile')).toBeVisible({ timeout: 30000 });
    await waitIdle(page);
}

async function waitIdle(page) {
    await page.waitForFunction(
        () => !window.isBusy && document.querySelectorAll('.flying').length === 0,
        { timeout: 15000 }
    );
}

async function setupMiiMoment(page) {
    await page.evaluate((payload) => {
        isBusy = false;
        hasWon = false;
        selected = [];
        combo = 0;
        moveCount = 0;
        historyStack = [];
        discardPile = [];
        clearedGroups = [];
        lastCleared = null;

        settings.miiPeek = true;
        nextSlotIndex = 0;

        slots.forEach((slot, i) => {
            slot.cards = i === 0 ? payload.slotCards : [];
            slot.active = i === 0;
        });

        deck = [payload.incoming];

        render();
        if (typeof updateDiscard === 'function') updateDiscard();
    }, {
        slotCards: [card('3', '♠'), card('3', '♥')],
        incoming: card('3', '♦'),
    });
}

async function triggerMiiDeal(page) {
    await setupMiiMoment(page);
    await page.evaluate(() => {
        if (typeof dealOneCard === 'function') {
            dealOneCard();
            return;
        }
        document.getElementById('deck-pile')?.click();
    });
}

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        localStorage.setItem('lucky3-premium', 'true');
    });

    await page.goto('/app/index.html', { waitUntil: 'domcontentloaded' });
    await waitReady(page);
});

test('mii hidden flying card follows the currently selected cardback', async ({ page }) => {
    const cardbacks = ['retro_gold', 'void'];

    for (const id of cardbacks) {
        await page.evaluate((cbId) => {
            applyCardBack(cbId);
        }, id);

        await expect(page.locator('#deck-pile')).toHaveClass(new RegExp(`cb-${id}`));

        await triggerMiiDeal(page);

        await expect(page.locator('.flying.face-down.use-cardback')).toHaveCount(1, { timeout: 5000 });

        const snapshot = await page.evaluate(() => {
            const fly = document.querySelector('.flying.face-down.use-cardback');
            const deckEl = document.getElementById('deck-pile');
            if (!fly || !deckEl) return null;

            const flyClasses = Array.from(fly.classList);
            const deckClasses = Array.from(deckEl.classList);
            return {
                flyClasses,
                deckClasses,
                flyBgInline: /** @type {HTMLElement} */ (fly).style.backgroundImage,
                deckBgComputed: getComputedStyle(deckEl).backgroundImage,
            };
        });

        expect(snapshot).not.toBeNull();
        expect(snapshot.flyClasses).toContain(`cb-${id}`);
        expect(snapshot.deckClasses).toContain(`cb-${id}`);
        expect(snapshot.flyBgInline).toBeTruthy();
        expect(snapshot.flyBgInline).not.toBe('none');
        const flyBgFile = getBgFileName(snapshot.flyBgInline);
        const deckBgFile = getBgFileName(snapshot.deckBgComputed);
        expect(flyBgFile).toBeTruthy();
        expect(flyBgFile).toBe(deckBgFile);

        await waitIdle(page);
    }
});

test('mii state reflects different cardback profiles via theme and glow CSS vars', async ({ page }) => {
    const cardbacks = ['classic', 'retro_gold', 'void'];
    /** @type {Array<{id:string, theme:string|null, glow:string, hasTension:boolean, hasPeek:boolean, miiText:string}>} */
    const probes = [];

    for (const id of cardbacks) {
        await page.evaluate((cbId) => {
            applyCardBack(cbId);
        }, id);

        if (id === 'classic') {
            await expect(page.locator('#deck-pile')).not.toHaveClass(/cb-/);
        } else {
            await expect(page.locator('#deck-pile')).toHaveClass(new RegExp(`cb-${id}`));
        }

        await triggerMiiDeal(page);

        let seenMask = 0;
        let observedText = '';
        await expect.poll(async () => {
            const state = await page.evaluate(() => {
                const textEl = document.querySelector('.column .mii-text');
                return {
                    hasTension: document.querySelector('.column.mii-tension') !== null,
                    hasPeek: document.querySelector('.flying.mii-peek') !== null,
                    text: textEl && textEl.textContent ? textEl.textContent.trim() : '',
                };
            });
            if (state.hasTension) seenMask |= 1;
            if (state.hasPeek) seenMask |= 2;
            if (state.text) {
                seenMask |= 4;
                observedText = state.text;
            }
            return seenMask;
        }, { timeout: 5000 }).toBeGreaterThanOrEqual(1);

        const probe = await page.evaluate(() => {
            const root = document.documentElement;
            return {
                theme: typeof getCurrentTheme === 'function' ? getCurrentTheme() : null,
                glow: getComputedStyle(root).getPropertyValue('--mii-glow-color').trim(),
                hasTension: document.querySelector('.column.mii-tension') !== null,
                hasPeek: document.querySelector('.flying.mii-peek') !== null,
            };
        });

        probes.push({ id, ...probe, miiText: observedText });

        await waitIdle(page);
    }

    expect(new Set(probes.map((x) => x.theme)).size).toBeGreaterThanOrEqual(3);
    expect(new Set(probes.map((x) => x.glow)).size).toBeGreaterThanOrEqual(3);
});
