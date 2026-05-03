#!/usr/bin/env node
'use strict';

// Scan seeds for winning games and track maxColLen.
// Filter for games where maxColLen < THRESHOLD and report metric distributions.

const { mulberry32, buildDeck, legalMoves } = require('../solver');

const TARGET_SUMS = new Set([9, 19, 29]);

function simulateCorrect(seed, maxMoves = 10000) {
    let deck = buildDeck(seed);
    const cols = [[], [], [], []];
    const active = [true, true, true, true];
    const clearedGroups = [];

    for (let round = 0; round < 3; round++) {
        for (let c = 0; c < 4; c++) cols[c].push(deck.pop());
    }

    let nextDealCol = 0;
    let dealCount = 0;
    let elimCount = 0;
    let recycleCount = 0;
    let currentCombo = 0;
    let maxCombo = 0;
    let comboTriggers = 0;
    let firstElimAt = -1;
    let maxColLen = 0;
    for (let c = 0; c < 4; c++) if (cols[c].length > maxColLen) maxColLen = cols[c].length;

    for (let move = 0; move < maxMoves; move++) {
        const totalCards = cols.reduce((acc, col, i) => acc + (active[i] ? col.length : 0), 0);
        if (totalCards === 0) {
            return { won: true, winType: 'zero-clear', dealCount, elimCount, recycleCount, maxCombo, comboTriggers, firstElimAt, maxColLen };
        }
        if (totalCards === 1) {
            let lone = null;
            for (let i = 0; i < 4; i++) if (active[i] && cols[i].length === 1) { lone = cols[i][0]; break; }
            if (lone && lone.val === 3) {
                return { won: true, winType: 'lucky3', dealCount, elimCount, recycleCount, maxCombo, comboTriggers, firstElimAt, maxColLen };
            }
        }

        let eliminated = false;
        for (let c = 0; c < 4; c++) {
            if (!active[c]) continue;
            const moves = legalMoves(cols[c]);
            if (moves.length === 0) continue;

            const best = moves[0];
            if (firstElimAt === -1) firstElimAt = move;
            const recycled = best.idx.map((i) => cols[c][i]);
            const sortedDesc = [...best.idx].sort((a, b) => b - a);
            for (const i of sortedDesc) cols[c].splice(i, 1);
            clearedGroups.push(recycled);

            elimCount++;
            currentCombo++;
            if (currentCombo > maxCombo) maxCombo = currentCombo;
            if (currentCombo >= 2) comboTriggers++;
            if (cols[c].length === 0) active[c] = false;
            eliminated = true;
            break;
        }
        if (eliminated) continue;

        if (deck.length === 0) {
            if (clearedGroups.length === 0) {
                return { won: false, reason: 'deadlock', dealCount, elimCount, recycleCount, maxCombo, comboTriggers, firstElimAt, maxColLen };
            }
            const rebuilt = [];
            for (let i = clearedGroups.length - 1; i >= 0; i--) rebuilt.push(...clearedGroups[i]);
            deck = rebuilt;
            clearedGroups.length = 0;
            recycleCount++;
            currentCombo = 0;
            continue;
        }

        let dealt = false;
        for (let i = 0; i < 4; i++) {
            const c = (nextDealCol + i) % 4;
            if (!active[c]) continue;
            cols[c].push(deck.pop());
            if (cols[c].length > maxColLen) maxColLen = cols[c].length;
            nextDealCol = (c + 1) % 4;
            dealCount++;
            currentCombo = 0;
            dealt = true;
            break;
        }
        if (!dealt) {
            return { won: false, reason: 'no_active', dealCount, elimCount, recycleCount, maxCombo, comboTriggers, firstElimAt, maxColLen };
        }
    }

    return { won: false, reason: 'timeout', dealCount, elimCount, recycleCount, maxCombo, comboTriggers, firstElimAt, maxColLen };
}

function parseArgs(argv) {
    const out = { samples: 1000000, threshold: 15, masterSeed: 0xDEADBEEF >>> 0, all: false, dump: null };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--samples' || a === '-n') out.samples = Number(argv[++i]);
        else if (a === '--threshold' || a === '-t') out.threshold = Number(argv[++i]);
        else if (a === '--master-seed') out.masterSeed = Number(argv[++i]) >>> 0;
        else if (a === '--all') out.all = true; // include non-wins
        else if (a === '--dump') out.dump = argv[++i];
    }
    return out;
}

function pct(arr, p) {
    if (arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)));
    return sorted[idx];
}

function summarize(label, arr) {
    if (arr.length === 0) {
        console.log(`  ${label}: (no data)`);
        return;
    }
    let sum = 0, min = Infinity, max = -Infinity;
    for (const v of arr) { sum += v; if (v < min) min = v; if (v > max) max = v; }
    const mean = sum / arr.length;
    const p50 = pct(arr, 0.5);
    const p90 = pct(arr, 0.9);
    const p99 = pct(arr, 0.99);
    console.log(`  ${label.padEnd(14)} min=${String(min).padStart(4)}  p50=${String(p50).padStart(4)}  mean=${mean.toFixed(2).padStart(7)}  p90=${String(p90).padStart(4)}  p99=${String(p99).padStart(4)}  max=${String(max).padStart(5)}`);
}

function main() {
    const args = parseArgs(process.argv);
    console.log(`scan: samples=${args.samples} threshold(maxColLen<)=${args.threshold} master-seed=0x${args.masterSeed.toString(16)} all=${args.all}`);

    const rng = mulberry32(args.masterSeed);
    let totalWins = 0;
    let totalGames = 0;
    const filtered = [];

    const t0 = Date.now();
    for (let i = 0; i < args.samples; i++) {
        const seed = Math.floor(rng() * 0x100000000) >>> 0;
        const r = simulateCorrect(seed);
        totalGames++;
        if (r.won) totalWins++;
        const include = args.all ? true : r.won;
        if (include && r.maxColLen < args.threshold) {
            filtered.push({ seed, ...r });
        }
    }
    const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

    console.log(`\nresult: total=${totalGames}  wins=${totalWins} (${(totalWins / totalGames * 100).toFixed(2)}%)  elapsed=${elapsed}s`);
    console.log(`filtered (${args.all ? 'all games' : 'wins only'} & maxColLen<${args.threshold}): ${filtered.length}`);
    if (filtered.length === 0) return;
    console.log(`  win rate within filter (in pool): ${(filtered.filter(x => x.won).length / filtered.length * 100).toFixed(2)}%`);

    console.log('\n指標分布 (在 maxColLen<' + args.threshold + ' 的勝局中):');
    summarize('dealCount',     filtered.map(x => x.dealCount));
    summarize('elimCount',     filtered.map(x => x.elimCount));
    summarize('recycleCount',  filtered.map(x => x.recycleCount));
    summarize('maxCombo',      filtered.map(x => x.maxCombo));
    summarize('comboTriggers', filtered.map(x => x.comboTriggers));
    summarize('firstElimAt',   filtered.map(x => x.firstElimAt));
    summarize('maxColLen',     filtered.map(x => x.maxColLen));

    // winType breakdown
    const lucky3 = filtered.filter(x => x.winType === 'lucky3').length;
    const zero = filtered.filter(x => x.winType === 'zero-clear').length;
    console.log(`\nwinType: lucky3=${lucky3}  zero-clear=${zero}`);

    // Sample seeds at extremes within the filter
    function topBy(key, n = 5, asc = false) {
        const sorted = [...filtered].sort((a, b) => asc ? (a[key] - b[key]) : (b[key] - a[key]));
        return sorted.slice(0, n).map(x => `seed=${x.seed} ${key}=${x[key]} maxColLen=${x.maxColLen}`);
    }
    console.log('\n極端 seed (在篩選池中):');
    console.log('  最多 dealCount:'); topBy('dealCount').forEach(s => console.log('   ' + s));
    console.log('  最多 recycleCount:'); topBy('recycleCount').forEach(s => console.log('   ' + s));
    console.log('  最高 maxCombo:'); topBy('maxCombo').forEach(s => console.log('   ' + s));
    console.log('  最晚 firstElimAt:'); topBy('firstElimAt').forEach(s => console.log('   ' + s));
    console.log('  最少 dealCount:'); topBy('dealCount', 5, true).forEach(s => console.log('   ' + s));

    // Recycle histogram
    console.log('\nrecycleCount 分布:');
    const buckets = [[0,0],[1,1],[2,2],[3,3],[4,5],[6,10],[11,15],[16,20],[21,30],[31,40],[41,99]];
    for (const [lo, hi] of buckets) {
        const c = filtered.filter(x => x.recycleCount >= lo && x.recycleCount <= hi).length;
        if (c === 0) continue;
        const pct = (c / filtered.length * 100).toFixed(2);
        const label = lo === hi ? String(lo) : `${lo}-${hi}`;
        const bar = '█'.repeat(Math.min(50, Math.round(c / filtered.length * 200)));
        console.log(`  ${label.padEnd(6)} ${String(c).padStart(7)} (${pct.padStart(5)}%)  ${bar}`);
    }

    // Top 20 by recycle
    console.log('\n最多 recycle 的 20 個 seed:');
    const topRecycle = [...filtered].sort((a, b) => b.recycleCount - a.recycleCount).slice(0, 20);
    for (const x of topRecycle) {
        console.log(`  seed=${String(x.seed).padStart(10)}  recycle=${String(x.recycleCount).padStart(3)}  deal=${String(x.dealCount).padStart(4)}  elim=${String(x.elimCount).padStart(3)}  combo=${x.maxCombo}  colLen=${x.maxColLen}  win=${x.winType}`);
    }

    if (args.dump) {
        const fs = require('fs');
        fs.writeFileSync(args.dump, JSON.stringify({ meta: { samples: args.samples, threshold: args.threshold, masterSeed: args.masterSeed, totalGames, totalWins }, records: filtered }));
        console.log(`\ndumped ${filtered.length} records to ${args.dump}`);
    }
}

if (require.main === module) main();
