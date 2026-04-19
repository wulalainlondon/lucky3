// Lucky 3 Greedy Solver
// Rules: 4 columns, 40 cards (4 suits × A-10)
// Eliminate 3 cards from one column if sum = 9/19/29 and position is legal
// Legal patterns: ① tail-3 ② head1+tail2 ③ head2+tail1
// Priority: ① > ② > ③ (prefer more top/tail cards)
// Greedy: eliminate if possible, else deal to next active column
// Win: board has 0 cards or exactly 1 card with value 3

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
    suits.forEach(s => ranks.forEach(r => {
        full.push({ val: r === 'A' ? 1 : parseInt(r), r, s });
    }));
    const rng = mulberry32(seed >>> 0);
    return shuffleWithRng(full, rng);
}

// Returns legal (indices, sum) combos for a column, sorted by priority (① first)
function legalMoves(cards) {
    const n = cards.length;
    if (n < 3) return [];
    const seen = new Set();
    const moves = [];
    const patterns = [
        [n - 3, n - 2, n - 1],  // ① tail-3
        [0, n - 2, n - 1],       // ② head1+tail2
        [0, 1, n - 1],           // ③ head2+tail1
    ];
    for (const idx of patterns) {
        const key = idx.join(',');
        if (seen.has(key)) continue;
        seen.add(key);
        const sum = idx.reduce((acc, i) => acc + cards[i].val, 0);
        if (sum === 9 || sum === 19 || sum === 29) {
            moves.push({ idx, sum });
        }
    }
    return moves;
}

function simulate(seed, debug = false) {
    const deck = buildDeck(seed);
    // 4 columns, deal 3 cards each opening (round-robin)
    const cols = [[], [], [], []];
    const active = [true, true, true, true];

    for (let round = 0; round < 3; round++) {
        for (let c = 0; c < 4; c++) {
            cols[c].push(deck.pop());
        }
    }

    let nextDealCol = 0; // round-robin index among active columns
    const MAX_MOVES = 500;

    if (debug) {
        console.log('Opening:');
        cols.forEach((c, i) => console.log(`  col${i}: [${c.map(x => x.val).join(',')}]`));
        console.log(`  deck: ${deck.length} cards remaining`);
    }

    for (let move = 0; move < MAX_MOVES; move++) {
        // Check win
        const allCards = cols.flatMap((c, i) => active[i] ? c : []);
        if (allCards.length === 0 || (allCards.length === 1 && allCards[0].val === 3)) {
            if (debug) console.log(`WIN at move ${move}! Cards left: ${allCards.map(x => x.val)}`);
            return { won: true, moves: move };
        }

        // Try to eliminate: scan active columns, pick first with legal move
        let eliminated = false;
        for (let c = 0; c < 4; c++) {
            if (!active[c]) continue;
            const moves = legalMoves(cols[c]);
            if (moves.length > 0) {
                const best = moves[0];
                if (debug) {
                    const vals = best.idx.map(i => cols[c][i].val);
                    console.log(`Move ${move}: eliminate col${c} idx[${best.idx}] vals[${vals}] sum=${best.sum}`);
                }
                // Remove in reverse order
                const sorted = [...best.idx].sort((a, b) => b - a);
                for (const i of sorted) cols[c].splice(i, 1);
                // If column emptied, mark inactive
                if (cols[c].length === 0) {
                    active[c] = false;
                    if (debug) console.log(`  col${c} cleared → inactive`);
                }
                eliminated = true;
                break;
            }
        }
        if (eliminated) continue;

        // No elimination — deal if deck has cards
        if (deck.length === 0) {
            if (debug) {
                const allCards2 = cols.flatMap((c, i) => active[i] ? c : []);
                console.log(`DEADLOCK at move ${move}. Board: ${allCards2.map(x=>x.val)}`);
            }
            return { won: false, moves: move, reason: 'deadlock' };
        }

        // Deal to next active column (round-robin)
        let dealt = false;
        for (let i = 0; i < 4; i++) {
            const c = (nextDealCol + i) % 4;
            if (active[c]) {
                const card = deck.pop();
                cols[c].push(card);
                if (debug) console.log(`Move ${move}: deal ${card.val} → col${c} (now ${cols[c].length} cards)`);
                nextDealCol = (c + 1) % 4;
                dealt = true;
                break;
            }
        }
        if (!dealt) {
            // All columns inactive but we checked win already — shouldn't happen
            return { won: false, moves: move, reason: 'no_active_cols' };
        }
    }

    return { won: false, moves: MAX_MOVES, reason: 'timeout' };
}

// 產生 3000 個通關 seed（貪心策略可通關視為合格）
const TARGET = 3000;
const SEARCH_LIMIT = 500000;
const winning = [];

for (let seed = 0; seed < SEARCH_LIMIT && winning.length < TARGET; seed++) {
    if (simulate(seed).won) winning.push(seed >>> 0);
}

console.log(`找到 ${winning.length} 個 winning seeds（掃描至 seed ${SEARCH_LIMIT}）`);
console.log('\n// 貼入 index.html 的 CURATED_SEED_POOL：');
console.log(`[${winning.join(',')}]`);
