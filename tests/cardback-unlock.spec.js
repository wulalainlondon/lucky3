// @ts-check
const { test, expect } = require('@playwright/test');

test.describe.configure({ timeout: 300000 });

const ACH_KEY = 'lucky3-achievements-v1';
const UNLOCK_KEY = 'lucky3-card-back-unlocked-v1';

const ACH_DEFAULTS = {
    wins: 0,
    zeroClearWins: 0,
    streakShield: 0,
    maxCombo: 0,
    bestMoves: null,
    bestTimeSec: null,
    currentStreak: 0,
    longestStreak: 0,
    lastWinDate: '',
    noUndoWins: 0,
    suitWins: { spade: false, heart: false, diamond: false, club: false },
    fullSweepWins: 0,
    dailyWins: 0,
    comboGameWins: 0,
};

async function boot(page) {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const homeVisible = await page.locator('#home-screen').isVisible().catch(() => false);
    if (homeVisible) {
        await page.evaluate(() => {
            if (typeof window.homeNewGame === 'function') window.homeNewGame();
        });
        await expect(page.locator('#home-screen')).not.toBeVisible({ timeout: 10000 });
    }
    await expect(page.locator('#deck-pile')).toBeVisible({ timeout: 30000 });
    await expect(page.locator('.flying')).toHaveCount(0, { timeout: 15000 });
    await page.waitForFunction(
        () => typeof window.syncCardBackUnlocks === 'function' && typeof window.unlockPremium === 'function',
        { timeout: 30000 }
    );
}

async function runUnlockScenario(page, patch) {
    return page.evaluate(({ ACH_KEY, UNLOCK_KEY, ACH_DEFAULTS, patch }) => {
        localStorage.removeItem(UNLOCK_KEY);
        localStorage.setItem(ACH_KEY, JSON.stringify({ ...ACH_DEFAULTS, ...patch }));
        // Reload in-memory achievements from localStorage before checking unlocks
        if (typeof loadAchievements === 'function') {
            achievements = loadAchievements();
        }
        window.syncCardBackUnlocks({ showToast: false });
        return JSON.parse(localStorage.getItem(UNLOCK_KEY) || '[]');
    }, { ACH_KEY, UNLOCK_KEY, ACH_DEFAULTS, patch });
}

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        localStorage.setItem('lucky3-premium', 'true');
    });
    await boot(page);
});

test('achievement milestones unlock corresponding cardbacks', async ({ page }) => {
    const cases = [
        { id: 'combo5', patch: { maxCombo: 5 } },
        { id: 'speed18', patch: { bestMoves: 18 } },
        { id: 'ironwill', patch: { noUndoWins: 1 } },
        { id: 'suitcollector', patch: { suitWins: { spade: true, heart: true, diamond: true, club: true } } },
        { id: 'luckydraw', patch: { suitWins: { spade: true, heart: false, diamond: false, club: false } } },
        { id: 'fullsweep', patch: { fullSweepWins: 1 } },
        { id: 'dailyregular', patch: { dailyWins: 7 } },
        { id: 'chainreaction', patch: { comboGameWins: 1 } },
        { id: 'crimson', patch: { currentStreak: 7 } },
    ];

    for (const c of cases) {
        const unlocked = await runUnlockScenario(page, c.patch);
        expect(unlocked, `expected ${c.id} to unlock`).toContain(c.id);
    }
});
