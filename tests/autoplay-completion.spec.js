// @ts-check
const { test, expect } = require('@playwright/test');

test.setTimeout(120000);

async function waitGameReady(page) {
    await page.waitForFunction(() => window._gameReady === true, { timeout: 20000 });
}

async function runAutoPlay(page) {
    return page.evaluate(() => {
        const maxSteps = 3000;
        let steps = 0;

        const getAllCards = () => slots.flatMap((s) => (s.active ? s.cards : []));
        const isTerminal = () => {
            const all = getAllCards();
            return all.length === 0 || (all.length === 1 && all[0].val === 3);
        };

        while (steps < maxSteps && !isTerminal()) {
            const move = findFirstLegalClearMove();
            if (move) {
                const slot = slots.find((s) => s.id === move.slotId);
                if (!slot) break;
                const sorted = [...move.indices].sort((a, b) => b - a);
                const recycled = move.indices.map((i) => slot.cards[i]);
                discardPile.push(...recycled);
                clearedGroups.push([...recycled]);
                sorted.forEach((i) => slot.cards.splice(i, 1));
                if (slot.cards.length === 0) slot.active = false;
                combo++;
                maxCombo = Math.max(maxCombo, combo);
                moveCount++;
                selected = [];
                steps++;
                continue;
            }

            if (deck.length === 0 && clearedGroups.length > 0) {
                const groupsInReturnOrder = [];
                for (let i = clearedGroups.length - 1; i >= 0; i--) {
                    groupsInReturnOrder.push([...clearedGroups[i]]);
                }
                const rebuiltDeck = [];
                groupsInReturnOrder.forEach((group) => rebuiltDeck.push(...group));
                deck = rebuiltDeck;
                discardPile = [];
                clearedGroups = [];
                lastCleared = null;
                steps++;
                continue;
            }

            if (deck.length === 0) break;

            const activeSlots = slots.filter((s) => s.active);
            if (activeSlots.length === 0) break;

            combo = 0;
            let target = null;
            for (let i = 0; i < 4; i++) {
                const c = slots[(nextSlotIndex + i) % 4];
                if (c && c.active) {
                    target = c;
                    nextSlotIndex = (slots.indexOf(c) + 1) % 4;
                    break;
                }
            }
            if (!target) break;

            target.cards.push(deck.pop());
            moveCount++;
            selected = [];
            steps++;
        }

        const allCards = slots.flatMap((s) => s.cards);
        const isZeroClear = allCards.length === 0;
        const isLucky3 = allCards.length === 1 && allCards[0].val === 3;
        const finished = isZeroClear || isLucky3;
        if (finished) {
            checkVictory();
        } else {
            checkDeadlock();
        }
        render();
        updateDiscard();
        updateDeckWarnState();

        return {
            steps,
            maxSteps,
            hasWon: Boolean(hasWon),
            finished,
            isZeroClear,
            isLucky3,
            deadlockVisible: Boolean(document.getElementById('deadlock-overlay')),
            winVisible: Boolean(document.getElementById('win-overlay')),
            cardsLeft: allCards.length,
            deckLeft: deck.length
        };
    });
}

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        localStorage.setItem('lucky3-premium', 'true');
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitGameReady(page);
});

test('autoplay can finish a full run to Lucky3 or Zero Clear', async ({ page }) => {
    const result = await runAutoPlay(page);

    expect(result.steps).toBeLessThan(result.maxSteps);
    expect(result.deadlockVisible).toBeFalsy();
    expect(result.finished).toBeTruthy();
    expect(result.hasWon).toBeTruthy();

    await expect(page.locator('#win-overlay')).toBeVisible({ timeout: 10000 });
});
