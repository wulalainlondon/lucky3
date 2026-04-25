#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { simulate } = require('../solver');

function mulberry32(a) {
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const TARGET_G1 = 500;
const TARGET_G2 = 500;
const TARGET_G3 = 500;
const MAX_TRIES = 1000000;
const RNG_SEED = 0x20260421;

// G1: 每日第一局，輕鬆爽快 ~2分鐘
function passesG1(s) {
    return (
        s.won === true &&
        s.dealCount >= 30 && s.dealCount <= 60 &&
        s.recycleCount === 1 &&
        s.maxCombo >= 2 &&
        s.firstElimAt <= 1 &&
        s.longestColumnLen <= 11
    );
}

// G2: 舒適局 ~4分鐘
function passesG2(s) {
    return (
        s.won === true &&
        s.dealCount >= 80 && s.dealCount <= 100 &&
        s.recycleCount >= 2 && s.recycleCount <= 3 &&
        s.maxCombo >= 3 &&
        s.firstElimAt <= 2 &&
        s.longestColumnLen <= 12
    );
}

// G3: 有挑戰局 ~5分鐘
function passesG3(s) {
    return (
        s.won === true &&
        s.dealCount >= 101 && s.dealCount <= 120 &&
        s.recycleCount >= 3 && s.recycleCount <= 6 &&
        s.maxCombo >= 3 &&
        s.firstElimAt <= 4 &&
        s.longestColumnLen <= 13
    );
}

function generate() {
    const rng = mulberry32(RNG_SEED);
    const seen = new Set();
    const g1 = [];
    const g2 = [];
    const g3 = [];
    let tries = 0;

    while (tries < MAX_TRIES && (g1.length < TARGET_G1 || g2.length < TARGET_G2 || g3.length < TARGET_G3)) {
        tries++;
        const seed = (rng() * 0x100000000) >>> 0;
        if (seen.has(seed)) continue;
        seen.add(seed);

        const s = simulate(seed);

        if (g1.length < TARGET_G1 && passesG1(s)) g1.push(seed);
        if (g2.length < TARGET_G2 && passesG2(s)) g2.push(seed);
        if (g3.length < TARGET_G3 && passesG3(s)) g3.push(seed);
    }

    return { tries, g1, g2, g3 };
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
    const outG1     = path.resolve(__dirname, 'seed_pool_ez_first_500.json');
    const outG2     = path.resolve(__dirname, 'seed_pool_g2_flow_500.json');
    const outG3     = path.resolve(__dirname, 'seed_pool_g3_soft_challenge_500.json');
    const outMerged = path.resolve(__dirname, 'seed_pool_daily_cycle_v1_1500.json');

    const startAt = new Date().toISOString();
    const result  = generate();
    const doneAt  = new Date().toISOString();

    const g1Meta = {
        generatedAt: doneAt,
        startedAt: startAt,
        tries: result.tries,
        found: result.g1.length,
        target: TARGET_G1,
        criteria: {
            won: true,
            dealCountMin: 30,
            dealCountMax: 60,
            recycleCount: 1,
            maxComboMin: 2,
            firstElimAtMax: 1,
            longestColumnLenMax: 11,
        },
    };

    const g2Meta = {
        generatedAt: doneAt,
        startedAt: startAt,
        tries: result.tries,
        found: result.g2.length,
        target: TARGET_G2,
        criteria: {
            won: true,
            dealCountMin: 80,
            dealCountMax: 100,
            recycleCountMin: 2,
            recycleCountMax: 3,
            maxComboMin: 3,
            firstElimAtMax: 2,
            longestColumnLenMax: 12,
        },
    };

    const g3Meta = {
        generatedAt: doneAt,
        startedAt: startAt,
        tries: result.tries,
        found: result.g3.length,
        target: TARGET_G3,
        criteria: {
            won: true,
            dealCountMin: 101,
            dealCountMax: 120,
            recycleCountMin: 3,
            recycleCountMax: 6,
            maxComboMin: 3,
            firstElimAtMax: 4,
            longestColumnLenMax: 13,
        },
    };

    writeJson(outG1, { meta: g1Meta, seeds: result.g1 });
    writeJson(outG2, { meta: g2Meta, seeds: result.g2 });
    writeJson(outG3, { meta: g3Meta, seeds: result.g3 });

    const merged = result.g1.concat(result.g2, result.g3);
    writeJson(outMerged, {
        meta: {
            generatedAt: doneAt,
            from: {
                g1EasyFirst: result.g1.length,
                g2Flow: result.g2.length,
                g3SoftChallenge: result.g3.length,
            },
            total: merged.length,
            version: 'daily-cycle-v1',
        },
        seeds: merged,
    });

    const ok = result.g1.length === TARGET_G1 && result.g2.length === TARGET_G2 && result.g3.length === TARGET_G3;
    console.log(JSON.stringify({
        ok,
        tries: result.tries,
        g1: result.g1.length,
        g2: result.g2.length,
        g3: result.g3.length,
        outG1,
        outG2,
        outG3,
        outMerged,
    }, null, 2));
    if (!ok) process.exitCode = 1;
}

if (require.main === module) {
    main();
}
