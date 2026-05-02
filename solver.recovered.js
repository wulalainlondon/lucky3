'use strict';

// Lucky3 deterministic solver module
// - 40 cards (A..10 x 4 suits)
// - Deal from deck tail (pop)
// - Opening: 3 cards to each of 4 columns (round-robin)
// - Legal clear patterns (priority): tail3, head1+tail2, head2+tail1
// - Legal sums: 9 / 19 / 29
// - Recycle: when deck empty and clearedGroups non-empty, rebuild deck by
//   reverse clearedGroups order (first cleared group returns to top-of-deck)

const TARGET_SUMS = new Set([9, 19, 29]);

function mulberry32(a) {
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function shuffleWithRng(arr, rng) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function buildDeck(seed) {
    const suits = ['S', 'H', 'D', 'C'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const full = [];
    suits.forEach((s) => ranks.forEach((r) => {
        full.push({ val: r === 'A' ? 1 : parseInt(r, 10), r, s });
    }));
    const rng = mulberry32(seed >>> 0);
    return shuffleWithRng(full, rng);
}

// Returns legal clear moves for a column in deterministic priority order.
// Each item: { idx: [i,j,k], sum }
function legalMoves(cards) {
    const n = cards.length;
    if (n < 3) return [];

    const patterns = [
        [n - 3, n - 2, n - 1], // tail3
        [0, n - 2, n - 1], // head1+tail2
        [0, 1, n - 1], // head2+tail1
    ];

    const seen = new Set();
    const out = [];
    for (const raw of patterns) {
        const idx = [...raw].sort((a, b) => a - b);
        const key = idx.join(',');
        if (seen.has(key)) continue;
        seen.add(key);

        const sum = idx[0] >= 0
            ? idx.reduce((acc, i) => acc + cards[i].val, 0)
            : NaN;
        if (TARGET_SUMS.has(sum)) out.push({ idx, sum });
    }
    return out;
}

function simulate(seed, options = {}) {
    const debug = !!options.debug;
    const maxMoves = Number.isInteger(options.maxMoves) ? options.maxMoves : 10000;

    let deck = buildDeck(seed);
    const cols = [[], [], [], []];
    const active = [true, true, true, true];
    const clearedGroups = [];

    for (let round = 0; round < 3; round++) {
        for (let c = 0; c < 4; c++) {
            cols[c].push(deck.pop());
        }
    }

    let nextDealCol = 0;
    let dealCount = 0;
    let elimCount = 0;
    let recycleCount = 0;
    let currentCombo = 0;
    let maxCombo = 0;
    let comboTriggers = 0;
    let firstElimAt = -1;
    const columnClearEvents = []; // [{ col, dealCount, move, elimCount }]

    for (let move = 0; move < maxMoves; move++) {
        const allCards = cols.flatMap((c, i) => active[i] ? c : []);
        if (allCards.length === 0 || (allCards.length === 1 && allCards[0].val === 3)) {
            const winType = allCards.length === 0 ? 'zero-clear' : 'lucky3';
            return {
                won: true,
                winType,
                moves: move,
                dealCount,
                elimCount,
                recycleCount,
                maxCombo,
                comboTriggers,
                firstElimAt,
                columnClearEvents,
            };
        }

        let eliminated = false;
        for (let c = 0; c < 4; c++) {
            if (!active[c]) continue;
            const moves = legalMoves(cols[c]);
            if (moves.length === 0) continue;

            const best = moves[0];
            if (firstElimAt === -1) firstElimAt = move;

            const sortedDesc = [...best.idx].sort((a, b) => b - a);
            const recycled = best.idx.map((i) => cols[c][i]);
            for (const i of sortedDesc) cols[c].splice(i, 1);
            clearedGroups.push(recycled);

            elimCount++;
            currentCombo++;
            if (currentCombo > maxCombo) maxCombo = currentCombo;
            if (currentCombo >= 2) comboTriggers++;

            if (cols[c].length === 0) {
                active[c] = false;
                columnClearEvents.push({ col: c, dealCount, move, elimCount });
            }

            if (debug) {
                const vals = recycled.map((x) => x.val).join('+');
                console.log(`move=${move} clear col=${c} sum=${best.sum} vals=${vals}`);
            }

            eliminated = true;
            break;
        }
        if (eliminated) continue;

        if (deck.length === 0) {
            if (clearedGroups.length === 0) {
                return {
                    won: false,
                    reason: 'deadlock',
                    moves: move,
                    dealCount,
                    elimCount,
                    recycleCount,
                    maxCombo,
                    comboTriggers,
                    firstElimAt,
                    columnClearEvents,
                };
            }

            const rebuilt = [];
            for (let i = clearedGroups.length - 1; i >= 0; i--) {
                rebuilt.push(...clearedGroups[i]);
            }
            deck = rebuilt;
            clearedGroups.length = 0;
            recycleCount++;
            currentCombo = 0;
            if (debug) console.log(`move=${move} recycle deck=${deck.length}`);
            continue;
        }

        let dealt = false;
        for (let i = 0; i < 4; i++) {
            const c = (nextDealCol + i) % 4;
            if (!active[c]) continue;
            cols[c].push(deck.pop());
            nextDealCol = (c + 1) % 4;
            dealCount++;
            currentCombo = 0;
            dealt = true;
            if (debug) console.log(`move=${move} deal -> col=${c}`);
            break;
        }

        if (!dealt) {
            return {
                won: false,
                reason: 'no_active_cols',
                moves: move,
                dealCount,
                elimCount,
                recycleCount,
                maxCombo,
                comboTriggers,
                firstElimAt,
                columnClearEvents,
            };
        }
    }

    return {
        won: false,
        reason: 'timeout',
        moves: maxMoves,
        dealCount,
        elimCount,
        recycleCount,
        maxCombo,
        comboTriggers,
        firstElimAt,
        columnClearEvents,
    };
}

function findWinningSeeds(target = 3000, searchLimit = 500000) {
    const winning = [];
    for (let seed = 0; seed < searchLimit && winning.length < target; seed++) {
        if (simulate(seed).won) winning.push(seed >>> 0);
    }
    return winning;
}

module.exports = {
    mulberry32,
    shuffleWithRng,
    buildDeck,
    legalMoves,
    simulate,
    findWinningSeeds,
};
