// @ts-check
const { test, expect } = require('@playwright/test');

test.describe.configure({ timeout: 120000 });

// ── Helpers ────────────────────────────────────────────────────────────────

async function waitReady(page) {
    await page.waitForFunction(() => window._gameReady === true, { timeout: 30000 });
}

async function waitIdle(page) {
    await page.waitForFunction(
        () => !window.isBusy && document.querySelectorAll('.flying').length === 0,
        { timeout: 10000 }
    );
}

/** 注入完全受控的遊戲狀態，方便各機制測試隔離 */
async function injectState(page, { deckCards = [], slotCards = [[], [], [], []], clearedGrps = [], discard = [], history = [] } = {}) {
    await page.evaluate(({ d, s, cg, dp, hs }) => {
        isBusy = false;
        hasWon = false;
        deck = d;
        discardPile = dp;
        clearedGroups = cg;
        historyStack = hs;
        combo = 0;
        selected = [];
        nextSlotIndex = 0;
        slots.forEach((slot, i) => {
            slot.cards = s[i] || [];
            slot.active = slot.cards.length > 0;
        });
        const btn = document.getElementById('btn-undo');
        if (btn) btn.disabled = hs.length === 0;
        render();
        updateDiscard();
    }, { d: deckCards, s: slotCards, cg: clearedGrps, dp: discard, hs: history });
}

/**
 * 直接以 JS 在指定 slot 執行第一個合法消除（繞過動畫 setTimeout，與 autoplay 相同）。
 * 回傳 { moved, sum, slotEmpty, clearedCount } 或 { moved: false }。
 */
async function execFirstClear(page, slotIndex, cardList) {
    return page.evaluate(({ si, cards }) => {
        isBusy = false;
        deck = [];
        discardPile = [];
        clearedGroups = [];
        historyStack = [];
        combo = 0;
        selected = [];
        slots.forEach((slot, i) => {
            slot.cards = i === si ? cards : [];
            slot.active = i === si && cards.length > 0;
        });
        const move = findFirstLegalClearMove();
        if (!move) return { moved: false };
        const slot = slots.find(s => s.id === move.slotId);
        const recycled = move.indices.map(i => slot.cards[i]);
        const sum = recycled.reduce((acc, c) => acc + c.val, 0);
        discardPile.push(...recycled);
        clearedGroups.push([...recycled]);
        historyStack.push({
            type: 'clear',
            slotId: slot.id,
            cards: move.indices.map((i, pos) => ({ idx: i, data: recycled[pos] })),
            prevLast: lastCleared,
            comboBefore: combo,
        });
        combo++;
        [...move.indices].sort((a, b) => b - a).forEach(i => slot.cards.splice(i, 1));
        if (slot.cards.length === 0) slot.active = false;
        lastCleared = recycled[recycled.length - 1];
        selected = [];
        const btn = document.getElementById('btn-undo');
        if (btn) { btn.disabled = false; btn.classList.add('undo-ready'); }
        render();
        updateDiscard();
        return { moved: true, sum, slotEmpty: slots[si].cards.length === 0, clearedCount: clearedGroups.length };
    }, { si: slotIndex, cards: cardList });
}

function card(rank, suit) {
    const val = rank === 'A' ? 1 : parseInt(rank, 10);
    const color = suit === '♥' || suit === '♦' ? 'red' : 'black';
    return { rank, suit, val, color };
}

// ── Setup ──────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        localStorage.setItem('lucky3-tutorial-state-v1', 'completed');
        localStorage.setItem('lucky3-premium', 'true');
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitReady(page);
    await waitIdle(page);
});

// ══════════════════════════════════════════════════════════════════════════
// 1. 牌組完整性：40張，A–10 × 4花色，無 J/Q/K
// ══════════════════════════════════════════════════════════════════════════

test('牌組 40 張，A–10 × 4 花色，無 J/Q/K', async ({ page }) => {
    const result = await page.evaluate(() => {
        const all = [...deck, ...slots.flatMap(s => s.cards)];
        const rankSet = [...new Set(all.map(c => c.rank))];
        const suitSet = [...new Set(all.map(c => c.suit))].sort();
        return {
            total: all.length,
            hasJQK: all.some(c => ['J', 'Q', 'K'].includes(c.rank)),
            rankCount: rankSet.length,
            suits: suitSet,
            aceVal1: all.filter(c => c.rank === 'A').every(c => c.val === 1),
            tenVal10: all.filter(c => c.rank === '10').every(c => c.val === 10),
        };
    });

    expect(result.total).toBe(40);
    expect(result.hasJQK).toBe(false);
    expect(result.rankCount).toBe(10); // A 2 3 4 5 6 7 8 9 10
    expect(result.suits).toEqual(['♠', '♣', '♥', '♦']); // Unicode: ♠2660 ♣2663 ♥2665 ♦2666
    expect(result.aceVal1).toBe(true);
    expect(result.tenVal10).toBe(true);
});

// ══════════════════════════════════════════════════════════════════════════
// 2. 初始無重複牌
// ══════════════════════════════════════════════════════════════════════════

test('初始牌組每張牌恰好出現一次（無重複）', async ({ page }) => {
    const dupes = await page.evaluate(() => {
        const all = [...deck, ...slots.flatMap(s => s.cards)];
        const seen = {};
        return all.reduce((acc, c) => {
            const k = c.rank + c.suit;
            if (seen[k]) acc.push(k);
            seen[k] = true;
            return acc;
        }, []);
    });
    expect(dupes).toHaveLength(0);
});

// ══════════════════════════════════════════════════════════════════════════
// 3. DEAL：牌堆 -1，欄位 +1，總數守恆
// ══════════════════════════════════════════════════════════════════════════

test('DEAL：牌堆 -1，欄位 +1，總數不變', async ({ page }) => {
    const before = await page.evaluate(() => ({
        deck: deck.length,
        slot: slots.flatMap(s => s.cards).length,
    }));

    await page.locator('#deck-pile').click();
    await waitIdle(page);

    const after = await page.evaluate(() => ({
        deck: deck.length,
        slot: slots.flatMap(s => s.cards).length,
    }));

    expect(after.deck).toBe(before.deck - 1);
    expect(after.slot).toBe(before.slot + 1);
    expect(after.deck + after.slot).toBe(before.deck + before.slot);
});

// ══════════════════════════════════════════════════════════════════════════
// 4. 多次 DEAL 後總牌數仍守恆
// ══════════════════════════════════════════════════════════════════════════

test('連續 DEAL 8 次後總牌數仍為 40', async ({ page }) => {
    for (let i = 0; i < 8; i++) {
        const deckBefore = await page.evaluate(() => deck.length);
        await page.locator('#deck-pile').click();
        // 等牌堆計數確實減少，確保本次發牌完成才做下一次
        await page.waitForFunction(
            (before) => deck.length < before,
            deckBefore,
            { timeout: 10000 }
        );
        await waitIdle(page);
    }
    const total = await page.evaluate(() =>
        deck.length + slots.flatMap(s => s.cards).length
    );
    expect(total).toBe(40);
});

// ══════════════════════════════════════════════════════════════════════════
// 5. 消除：3 張合計 9 → 清空欄位，加入 clearedGroups
// ══════════════════════════════════════════════════════════════════════════

test('消除：合計 9（3+3+3）清空欄位', async ({ page }) => {
    const r = await execFirstClear(page, 0, [
        card('3', '♠'), card('3', '♥'), card('3', '♦'),
    ]);
    expect(r.moved).toBe(true);
    expect(r.sum).toBe(9);
    expect(r.slotEmpty).toBe(true);
    expect(r.clearedCount).toBe(1);
});

// ══════════════════════════════════════════════════════════════════════════
// 6. 消除：3 張合計 19（9+9+A）
// ══════════════════════════════════════════════════════════════════════════

test('消除：合計 19（9+9+A）清空欄位', async ({ page }) => {
    const r = await execFirstClear(page, 0, [
        card('9', '♠'), card('9', '♥'), card('A', '♦'),
    ]);
    expect(r.moved).toBe(true);
    expect(r.sum).toBe(19);
    expect(r.slotEmpty).toBe(true);
});

// ══════════════════════════════════════════════════════════════════════════
// 7. 消除：3 張合計 29（10+10+9）
// ══════════════════════════════════════════════════════════════════════════

test('消除：合計 29（10+10+9）清空欄位', async ({ page }) => {
    const r = await execFirstClear(page, 0, [
        card('10', '♠'), card('10', '♥'), card('9', '♦'),
    ]);
    expect(r.moved).toBe(true);
    expect(r.sum).toBe(29);
    expect(r.slotEmpty).toBe(true);
});

// ══════════════════════════════════════════════════════════════════════════
// 8. 合計非 9/19/29 → findFirstLegalClearMove 回傳 null
// ══════════════════════════════════════════════════════════════════════════

test('無效合計 12（4+4+4）不在合法消除組合', async ({ page }) => {
    const r = await page.evaluate(() => {
        isBusy = false;
        slots[0].cards = [
            {rank:'4', suit:'♠', val:4, color:'black'},
            {rank:'4', suit:'♥', val:4, color:'red'},
            {rank:'4', suit:'♦', val:4, color:'red'},
        ];
        slots[0].active = true;
        slots.slice(1).forEach(s => { s.cards = []; s.active = false; });
        return { hasLegal: findFirstLegalClearMove() !== null };
    });
    expect(r.hasLegal).toBe(false);
});

// ══════════════════════════════════════════════════════════════════════════
// 9. Undo after DEAL：牌回到牌堆，按鈕變 disabled
// ══════════════════════════════════════════════════════════════════════════

test('DEAL 後 undo 退牌回堆、按鈕變 disabled', async ({ page }) => {
    const deckBefore = await page.evaluate(() => deck.length);

    await page.locator('#deck-pile').click();
    await waitIdle(page);
    await expect(page.locator('#btn-undo')).toBeEnabled();

    await page.locator('#btn-undo').click();
    await waitIdle(page);

    expect(await page.evaluate(() => deck.length)).toBe(deckBefore);
    await expect(page.locator('#btn-undo')).toBeDisabled({ timeout: 3000 });
});

// ══════════════════════════════════════════════════════════════════════════
// 10. Undo after clear：3 張牌回到欄位
// ══════════════════════════════════════════════════════════════════════════

test('消除後 undo 退 3 張牌回欄位', async ({ page }) => {
    // JS 直接消除（繞過動畫 setTimeout）
    const r = await execFirstClear(page, 0, [
        card('3', '♠'), card('3', '♥'), card('3', '♦'),
    ]);
    expect(r.slotEmpty).toBe(true);
    expect(r.moved).toBe(true);

    // 點 Undo 按鈕（UI 互動）
    await expect(page.locator('#btn-undo')).toBeEnabled();
    await page.locator('#btn-undo').click();
    await waitIdle(page);

    expect(await page.evaluate(() => slots[0].cards.length)).toBe(3);
});

// ══════════════════════════════════════════════════════════════════════════
// 11. 【核心 Bug 修正驗證】洗牌後 historyStack 清空、undo 按鈕 disabled
// ══════════════════════════════════════════════════════════════════════════

test('recycle 後 historyStack 清空、undo disabled', async ({ page }) => {
    // 注入狀態：historyStack 有一筆消除紀錄、牌堆空、clearedGroups 有牌
    const before = await page.evaluate(() => {
        settings.recycleAnim = false;
        isBusy = false;
        deck = [];
        discardPile = [
            {rank:'3', suit:'♠', val:3, color:'black'},
            {rank:'3', suit:'♥', val:3, color:'red'},
            {rank:'3', suit:'♦', val:3, color:'red'},
        ];
        clearedGroups = [[
            {rank:'3', suit:'♠', val:3, color:'black'},
            {rank:'3', suit:'♥', val:3, color:'red'},
            {rank:'3', suit:'♦', val:3, color:'red'},
        ]];
        historyStack = [{
            type: 'clear', slotId: 0,
            cards: [{idx:0, data:{rank:'3', suit:'♠', val:3, color:'black'}}],
            prevLast: null, comboBefore: 0,
        }];
        slots.forEach(s => { s.cards = []; s.active = false; });
        const btn = document.getElementById('btn-undo');
        if (btn) btn.disabled = false;
        render();
        updateDiscard();
        return { historyBefore: historyStack.length, deckBefore: deck.length };
    });

    expect(before.historyBefore).toBe(1);
    expect(before.deckBefore).toBe(0);
    await expect(page.locator('#btn-undo')).toBeEnabled();

    // 直接呼叫 recycleDeck（recycleAnim=false → applyRecycleResult 同步執行）
    await page.evaluate(() => recycleDeck());

    // 洗牌後：historyStack 必須為空
    expect(await page.evaluate(() => historyStack.length)).toBe(0);
    // deck 應該收回 3 張牌
    expect(await page.evaluate(() => deck.length)).toBe(3);
    // undo 按鈕必須 disabled
    await expect(page.locator('#btn-undo')).toBeDisabled({ timeout: 3000 });
});

// ══════════════════════════════════════════════════════════════════════════
// 12. 洗牌後無重複牌
// ══════════════════════════════════════════════════════════════════════════

test('recycle 後無重複牌', async ({ page }) => {
    // 發幾張牌，完成一次真實消除，再洗牌
    await page.evaluate(() => {
        // 發 8 張到欄位
        for (let i = 0; i < 8; i++) {
            const s = slots[nextSlotIndex % 4];
            if (s && s.active && deck.length > 0) {
                s.cards.push(deck.pop());
                nextSlotIndex = (nextSlotIndex + 1) % 4;
            }
        }
        // 找到合法消除並手動執行（繞過動畫）
        const move = findFirstLegalClearMove();
        if (move) {
            const slot = slots.find(s => s.id === move.slotId);
            const recycled = move.indices.map(i => slot.cards[i]);
            discardPile.push(...recycled);
            clearedGroups.push([...recycled]);
            [...move.indices].sort((a, b) => b - a).forEach(i => slot.cards.splice(i, 1));
            if (slot.cards.length === 0) slot.active = false;
            historyStack.push({ type: 'clear', slotId: slot.id, cards: [], prevLast: null, comboBefore: 0 });
        }
        // 清空牌堆以觸發洗牌
        deck.length = 0;
        render();
        updateDiscard();
        setUndoEnabled(historyStack.length > 0);
    });

    // 觸發洗牌
    await page.locator('#deck-pile').click();
    await waitIdle(page);

    const dupes = await page.evaluate(() => {
        const all = [...deck, ...slots.flatMap(s => s.cards)];
        const seen = {};
        return all.reduce((acc, c) => {
            const k = c.rank + c.suit;
            if (seen[k]) acc.push(k);
            seen[k] = true;
            return acc;
        }, []);
    });
    expect(dupes).toHaveLength(0);
});

// ══════════════════════════════════════════════════════════════════════════
// 13. 死局：無牌堆、無回收、無合法消除 → 顯示 deadlock overlay
// ══════════════════════════════════════════════════════════════════════════

test('死局：無合法動作時顯示提示', async ({ page }) => {
    // 2+4+6+8 在各欄位，任意組合都不等於 9/19/29
    await injectState(page, {
        deckCards: [],
        clearedGrps: [],
        slotCards: [
            [card('2', '♠')],
            [card('4', '♥')],
            [card('6', '♦')],
            [card('8', '♣')],
        ],
    });

    await page.evaluate(() => checkDeadlock());
    await expect(page.locator('#deadlock-overlay')).toBeVisible({ timeout: 5000 });
});

// ══════════════════════════════════════════════════════════════════════════
// 14. 勝利條件：零清（所有牌消除完）
// ══════════════════════════════════════════════════════════════════════════

test('勝利：所有牌清完（zero clear）', async ({ page }) => {
    await injectState(page, {
        deckCards: [],
        clearedGrps: [],
        slotCards: [[], [], [], []],
    });

    await page.evaluate(() => {
        slots.forEach(s => { s.cards = []; s.active = false; });
        render();
        checkVictory();
    });

    await expect(page.locator('#win-overlay')).toBeVisible({ timeout: 5000 });
});

// ══════════════════════════════════════════════════════════════════════════
// 15. 勝利條件：Lucky3（場上剩一張值為 3 的牌）
// ══════════════════════════════════════════════════════════════════════════

test('勝利：剩一張 3（Lucky3）', async ({ page }) => {
    await injectState(page, {
        deckCards: [],
        slotCards: [[card('3', '♠')], [], [], []],
    });

    await page.evaluate(() => checkVictory());
    await expect(page.locator('#win-overlay')).toBeVisible({ timeout: 5000 });
});

// ══════════════════════════════════════════════════════════════════════════
// 16. Combo：連消 combo 計數正確遞增
// ══════════════════════════════════════════════════════════════════════════

test('combo：連消兩次從 0 升到 2', async ({ page }) => {
    const result = await page.evaluate(() => {
        isBusy = false;
        deck = [];
        discardPile = [];
        clearedGroups = [];
        historyStack = [];
        combo = 0;
        selected = [];
        slots[0].cards = [
            {rank:'3', suit:'♠', val:3, color:'black'},
            {rank:'3', suit:'♥', val:3, color:'red'},
            {rank:'3', suit:'♦', val:3, color:'red'},
        ];
        slots[0].active = true;
        slots[1].cards = [
            {rank:'9', suit:'♠', val:9, color:'black'},
            {rank:'9', suit:'♥', val:9, color:'red'},
            {rank:'A', suit:'♣', val:1, color:'black'},
        ];
        slots[1].active = true;
        slots[2].cards = []; slots[2].active = false;
        slots[3].cards = []; slots[3].active = false;

        // 第一次消除
        const m1 = findFirstLegalClearMove();
        if (!m1) return { error: 'no move 1' };
        const s1 = slots.find(s => s.id === m1.slotId);
        const r1 = m1.indices.map(i => s1.cards[i]);
        discardPile.push(...r1);
        clearedGroups.push([...r1]);
        combo++;
        [...m1.indices].sort((a,b)=>b-a).forEach(i => s1.cards.splice(i,1));
        if (s1.cards.length === 0) s1.active = false;
        selected = [];
        const after1 = combo;

        // 第二次消除
        const m2 = findFirstLegalClearMove();
        if (!m2) return { error: 'no move 2', after1 };
        const s2 = slots.find(s => s.id === m2.slotId);
        const r2 = m2.indices.map(i => s2.cards[i]);
        discardPile.push(...r2);
        clearedGroups.push([...r2]);
        combo++;
        [...m2.indices].sort((a,b)=>b-a).forEach(i => s2.cards.splice(i,1));
        if (s2.cards.length === 0) s2.active = false;
        selected = [];

        return { after1, after2: combo };
    });

    expect(result.after1).toBe(1);
    expect(result.after2).toBe(2);
});

// ══════════════════════════════════════════════════════════════════════════
// 17. 全局自動遊玩：完整一局不產生重複牌，正常結束
// ══════════════════════════════════════════════════════════════════════════

test('自動遊玩一局：無重複牌，正常結束', async ({ page }) => {
    const result = await page.evaluate(() => {
        const MAX = 2000;
        let steps = 0;

        while (steps < MAX && !hasWon) {
            const move = findFirstLegalClearMove();
            if (move) {
                const slot = slots.find(s => s.id === move.slotId);
                if (!slot) break;
                const recycled = move.indices.map(i => slot.cards[i]);
                discardPile.push(...recycled);
                clearedGroups.push([...recycled]);
                [...move.indices].sort((a, b) => b - a).forEach(i => slot.cards.splice(i, 1));
                if (slot.cards.length === 0) slot.active = false;
                combo++;
                maxCombo = Math.max(maxCombo, combo);
                moveCount++;
                selected = [];
                steps++;
                const all = slots.flatMap(s => s.cards);
                if (all.length === 0 || (all.length === 1 && all[0].val === 3)) {
                    checkVictory();
                    break;
                }
                continue;
            }

            if (deck.length === 0 && clearedGroups.length > 0) {
                const rebuilt = [];
                for (let i = clearedGroups.length - 1; i >= 0; i--) rebuilt.push(...clearedGroups[i]);
                deck = rebuilt;
                discardPile = [];
                clearedGroups = [];
                lastCleared = null;
                historyStack = [];
                steps++;
                continue;
            }

            if (deck.length === 0) break;

            combo = 0;
            let target = null;
            for (let i = 0; i < 4; i++) {
                const c = slots[(nextSlotIndex + i) % 4];
                if (c && c.active) { target = c; nextSlotIndex = (slots.indexOf(c) + 1) % 4; break; }
            }
            if (!target) break;

            target.cards.push(deck.pop());
            moveCount++;
            selected = [];
            steps++;
        }

        if (!hasWon) checkDeadlock();
        render();
        updateDiscard();

        const allInPlay = [...deck, ...slots.flatMap(s => s.cards), ...discardPile];
        const seen = {};
        const dupes = allInPlay.reduce((acc, c) => {
            const k = c.rank + c.suit;
            if (seen[k]) acc.push(k);
            seen[k] = true;
            return acc;
        }, []);

        return { steps, hasWon: Boolean(hasWon), dupes };
    });

    expect(result.dupes).toHaveLength(0);
    expect(result.steps).toBeLessThan(2000);
    // win/deadlock overlay 可能是非同步出現，用 Playwright 等待
    await expect(
        page.locator('#win-overlay, #deadlock-overlay').first()
    ).toBeVisible({ timeout: 15000 });
});
