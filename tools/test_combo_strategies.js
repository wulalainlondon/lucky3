#!/usr/bin/env node
'use strict';

// Test seed 1267428763 (星爆關卡) across many column-selection strategies
// Goal: find minimum maxCombo achievable while still winning (Lucky3)

const { buildDeck, legalMoves } = require('../solver');

const TARGET_SEED = 1267428763;
const RANDOM_RUNS = 2000;
const RANDOM_RNG_SEED = 0xABCD1234;

function mulberry32(a) {
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

// Core simulation with pluggable column selection
// colPicker(cols, active): returns column index to eliminate from
// If no return (or null), falls back to deal
function simulateFlex(seed, colPicker, patternPicker = null) {
    let deck = buildDeck(seed);
    const cols = [[], [], [], []];
    const active = [true, true, true, true];
    const clearedGroups = [];

    for (let round = 0; round < 3; round++)
        for (let c = 0; c < 4; c++) cols[c].push(deck.pop());

    let nextDealCol = 0;
    const MAX_MOVES = 3000;
    let dealCount = 0, elimCount = 0, recycleCount = 0;
    let currentCombo = 0, maxCombo = 0, comboTriggers = 0;
    let firstElimAt = -1;

    for (let move = 0; move < MAX_MOVES; move++) {
        // Check win
        const allCards = cols.flatMap((c, i) => active[i] ? c : []);
        if (allCards.length === 0 || (allCards.length === 1 && allCards[0].val === 3)) {
            const winType = allCards.length === 0 ? 'zero-clear' : 'lucky3';
            return { won: true, winType, dealCount, elimCount, recycleCount, maxCombo, comboTriggers, firstElimAt };
        }

        // Find all columns with legal moves
        const validCols = [];
        for (let c = 0; c < 4; c++) {
            if (!active[c]) continue;
            const moves = legalMoves(cols[c]);
            if (moves.length > 0) validCols.push({ c, moves });
        }

        if (validCols.length > 0) {
            // Let strategy pick which column
            const chosen = colPicker(validCols, cols, active);
            if (chosen !== null && chosen !== undefined) {
                const { c, moves } = chosen;
                const best = patternPicker ? patternPicker(moves) : moves[0];
                const sorted = [...best.idx].sort((a, b) => b - a);
                const recycled = best.idx.map(i => cols[c][i]);
                for (const i of sorted) cols[c].splice(i, 1);
                clearedGroups.push(recycled);
                elimCount++;
                if (firstElimAt === -1) firstElimAt = move;
                currentCombo++;
                if (currentCombo > maxCombo) maxCombo = currentCombo;
                if (currentCombo >= 2) comboTriggers++;
                if (cols[c].length === 0) active[c] = false;
                continue;
            }
        }

        // Deal
        if (deck.length === 0) {
            if (clearedGroups.length === 0)
                return { won: false, reason: 'deadlock', dealCount, elimCount, recycleCount, maxCombo, comboTriggers };
            const rebuilt = [];
            for (let i = clearedGroups.length - 1; i >= 0; i--) rebuilt.push(...clearedGroups[i]);
            deck = rebuilt;
            clearedGroups.length = 0;
            recycleCount++;
            continue;
        }

        for (let i = 0; i < 4; i++) {
            const c = (nextDealCol + i) % 4;
            if (active[c]) {
                cols[c].push(deck.pop());
                nextDealCol = (c + 1) % 4;
                dealCount++;
                currentCombo = 0;
                break;
            }
        }
    }
    return { won: false, reason: 'timeout', dealCount, elimCount, recycleCount, maxCombo, comboTriggers };
}

// --- Strategy builders ---

// Fixed column order (e.g., [0,1,2,3] = greedy, [3,2,1,0] = reverse)
function strategyFixedOrder(order) {
    return (validCols) => {
        for (const c of order) {
            const found = validCols.find(v => v.c === c);
            if (found) return found;
        }
        return validCols[0];
    };
}

// Shortest column first (fewest cards)
function strategyShortestCol(validCols, cols) {
    return validCols.reduce((best, v) =>
        cols[v.c].length < cols[best.c].length ? v : best, validCols[0]);
}

// Longest column first (most cards)
function strategyLongestCol(validCols, cols) {
    return validCols.reduce((best, v) =>
        cols[v.c].length > cols[best.c].length ? v : best, validCols[0]);
}

// Random among valid columns
function makeStrategyRandom(rng) {
    return (validCols) => validCols[Math.floor(rng() * validCols.length)];
}

// Pattern: prefer higher sum (29 > 19 > 9)
function patternHighSum(moves) {
    return moves.reduce((best, m) => m.sum > best.sum ? m : best, moves[0]);
}

// Pattern: prefer lower sum (9 > 19 > 29)
function patternLowSum(moves) {
    return moves.reduce((best, m) => m.sum < best.sum ? m : best, moves[0]);
}

// Generate all permutations of [0,1,2,3]
function permutations(arr) {
    if (arr.length <= 1) return [arr];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const rest = permutations([...arr.slice(0, i), ...arr.slice(i + 1)]);
        rest.forEach(p => result.push([arr[i], ...p]));
    }
    return result;
}

function pct(arr, p) {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.floor(s.length * p / 100)];
}

function report(label, results) {
    const won = results.filter(r => r.won);
    const combos = won.map(r => r.maxCombo);
    if (combos.length === 0) {
        console.log(`${label}: 0 wins / ${results.length} runs`);
        return;
    }
    combos.sort((a, b) => a - b);
    console.log(`${label.padEnd(30)} wins=${won.length}/${results.length}  maxCombo min=${combos[0]} p10=${pct(combos,10)} p25=${pct(combos,25)} med=${pct(combos,50)} p75=${pct(combos,75)} max=${combos[combos.length-1]}`);
}

// ---
console.log(`=== 星爆 seed ${TARGET_SEED} 多策略 maxCombo 分析 ===\n`);

// 1. All 24 column permutations (deterministic)
console.log('-- 全排列（24 種固定欄序） --');
const perms = permutations([0, 1, 2, 3]);
const permResults = [];
let minComboWin = Infinity;
for (const order of perms) {
    const r = simulateFlex(TARGET_SEED, strategyFixedOrder(order));
    if (r.won) {
        permResults.push(r);
        if (r.maxCombo < minComboWin) minComboWin = r.maxCombo;
    }
}
report('24 permutations (all)', permResults);
console.log(`  → 贏的路徑中最低 maxCombo = ${minComboWin}\n`);

// Show which permutations produce low combos
console.log('  低 combo 路徑（maxCombo < 5）:');
for (const order of perms) {
    const r = simulateFlex(TARGET_SEED, strategyFixedOrder(order));
    if (r.won && r.maxCombo < 5) {
        console.log(`    order=${order.join('')} → maxCombo=${r.maxCombo} deals=${r.dealCount}`);
    }
}
console.log();

// 2. Pattern variations with greedy column order
console.log('-- Pattern 選擇變化（固定 col0→3） --');
const baseOrder = strategyFixedOrder([0, 1, 2, 3]);
const pHighR = simulateFlex(TARGET_SEED, baseOrder, patternHighSum);
const pLowR  = simulateFlex(TARGET_SEED, baseOrder, patternLowSum);
console.log(`  高sum優先: won=${pHighR.won} maxCombo=${pHighR.maxCombo} deals=${pHighR.dealCount}`);
console.log(`  低sum優先: won=${pLowR.won}  maxCombo=${pLowR.maxCombo} deals=${pLowR.dealCount}`);
console.log();

// 3. Structural strategies
console.log('-- 結構性策略 --');
const structResults = [
    ['Shortest col first', simulateFlex(TARGET_SEED, strategyShortestCol)],
    ['Longest col first',  simulateFlex(TARGET_SEED, strategyLongestCol)],
    ['Reverse col (3210)', simulateFlex(TARGET_SEED, strategyFixedOrder([3, 2, 1, 0]))],
    ['Col 1,3,0,2',        simulateFlex(TARGET_SEED, strategyFixedOrder([1, 3, 0, 2]))],
];
for (const [label, r] of structResults) {
    console.log(`  ${label.padEnd(22)}: won=${r.won} maxCombo=${r.maxCombo} deals=${r.dealCount} triggers=${r.comboTriggers}`);
}
console.log();

// 4. Monte Carlo random col selection
console.log(`-- Monte Carlo 隨機欄選（${RANDOM_RUNS} 次）--`);
const rng = mulberry32(RANDOM_RNG_SEED);
const randomResults = [];
for (let i = 0; i < RANDOM_RUNS; i++) {
    const r = simulateFlex(TARGET_SEED, makeStrategyRandom(rng));
    randomResults.push(r);
}
report('Random col selection', randomResults);
const wonRandom = randomResults.filter(r => r.won);
const below5 = wonRandom.filter(r => r.maxCombo < 5);
const below3 = wonRandom.filter(r => r.maxCombo < 3);
console.log(`  → maxCombo < 5 的贏局: ${below5.length}/${wonRandom.length} (${(100*below5.length/wonRandom.length).toFixed(1)}%)`);
console.log(`  → maxCombo < 3 的贏局: ${below3.length}/${wonRandom.length} (${(100*below3.length/wonRandom.length).toFixed(1)}%)`);
console.log();

// 5. Summary verdict
console.log('=== 結論 ===');
const allWinCombos = [
    ...permResults.map(r => r.maxCombo),
    ...wonRandom.map(r => r.maxCombo),
];
allWinCombos.sort((a, b) => a - b);
console.log(`整體最低 maxCombo（贏局）: ${allWinCombos[0]}`);
console.log(`整體 p5 maxCombo（贏局）: ${pct(allWinCombos, 5)}`);
console.log(`target ≥5 安全嗎: ${allWinCombos[0] >= 5 ? '✓ 安全' : `✗ 有 ${allWinCombos.filter(c => c < 5).length} 條贏局路徑 maxCombo < 5`}`);
console.log(`target ≥3 安全嗎: ${allWinCombos[0] >= 3 ? '✓ 安全' : `✗ 有 ${allWinCombos.filter(c => c < 3).length} 條贏局路徑 maxCombo < 3`}`);
