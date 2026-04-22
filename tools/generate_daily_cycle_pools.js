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

const TARGET_G2 = 500;
const TARGET_G3 = 500;
const TARGET_G3_LUCKY3 = 425;
const TARGET_G3_ZERO_CLEAR = 75;
const MAX_TRIES = 2500000;
const RNG_SEED = 0x20260421;

function passesG2Hard(s) {
    return (
        s.won === true &&
        s.winType === 'lucky3' &&
        s.longestColumnLen <= 12 &&
        s.recycleCount >= 2 && s.recycleCount <= 4 &&
        s.maxCombo >= 3 && s.maxCombo <= 4 &&
        s.dealCount >= 95 && s.dealCount <= 140
    );
}

function passesG3Hard(s) {
    return (
        s.won === true &&
        s.longestColumnLen <= 14 &&
        s.recycleCount >= 3 && s.recycleCount <= 5 &&
        s.maxCombo >= 3 && s.maxCombo <= 5 &&
        s.dealCount >= 110 && s.dealCount <= 165
    );
}

function generate() {
    const rng = mulberry32(RNG_SEED);
    const seen = new Set();
    const g2 = [];
    const g3Lucky3 = [];
    const g3ZeroClear = [];
    let tries = 0;

    while (
        tries < MAX_TRIES &&
        (g2.length < TARGET_G2 || g3Lucky3.length < TARGET_G3_LUCKY3 || g3ZeroClear.length < TARGET_G3_ZERO_CLEAR)
    ) {
        tries++;
        const seed = (rng() * 0x100000000) >>> 0;
        if (seen.has(seed)) continue;
        seen.add(seed);

        const s = simulate(seed);

        if (g2.length < TARGET_G2 && passesG2Hard(s)) {
            g2.push(seed);
        }
        if (passesG3Hard(s)) {
            if (s.winType === 'lucky3' && g3Lucky3.length < TARGET_G3_LUCKY3) {
                g3Lucky3.push(seed);
            } else if (s.winType === 'zero-clear' && g3ZeroClear.length < TARGET_G3_ZERO_CLEAR) {
                g3ZeroClear.push(seed);
            }
        }
    }

    const g3 = g3Lucky3.concat(g3ZeroClear);
    return {
        tries,
        g2,
        g3,
        g3Lucky3: g3Lucky3.length,
        g3ZeroClear: g3ZeroClear.length,
    };
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
    const outG2 = path.resolve(__dirname, 'seed_pool_g2_flow_500.json');
    const outG3 = path.resolve(__dirname, 'seed_pool_g3_soft_challenge_500.json');
    const outMerged = path.resolve(__dirname, 'seed_pool_daily_cycle_v1_1500.json');
    const ezFile = path.resolve(__dirname, 'seed_pool_ez_first_500.json');

    const startAt = new Date().toISOString();
    const result = generate();
    const doneAt = new Date().toISOString();

    const g2Meta = {
        generatedAt: doneAt,
        startedAt: startAt,
        tries: result.tries,
        found: result.g2.length,
        target: TARGET_G2,
        criteria: {
            won: true,
            winType: 'lucky3',
            longestColumnLenMax: 12,
            recycleCountMin: 2,
            recycleCountMax: 4,
            maxComboMin: 3,
            maxComboMax: 4,
            dealCountMin: 95,
            dealCountMax: 140,
        },
    };

    const g3Meta = {
        generatedAt: doneAt,
        startedAt: startAt,
        tries: result.tries,
        found: result.g3.length,
        target: TARGET_G3,
        split: {
            lucky3: TARGET_G3_LUCKY3,
            zeroClear: TARGET_G3_ZERO_CLEAR,
            actualLucky3: result.g3Lucky3,
            actualZeroClear: result.g3ZeroClear,
        },
        criteria: {
            won: true,
            longestColumnLenMax: 14,
            recycleCountMin: 3,
            recycleCountMax: 5,
            maxComboMin: 3,
            maxComboMax: 5,
            dealCountMin: 110,
            dealCountMax: 165,
        },
    };

    writeJson(outG2, { meta: g2Meta, seeds: result.g2 });
    writeJson(outG3, { meta: g3Meta, seeds: result.g3 });

    let ezSeeds = [];
    if (fs.existsSync(ezFile)) {
        try {
            const ez = JSON.parse(fs.readFileSync(ezFile, 'utf8'));
            if (Array.isArray(ez.seeds)) ezSeeds = ez.seeds.map((x) => x >>> 0);
        } catch (_) {
            ezSeeds = [];
        }
    }
    const merged = ezSeeds.concat(result.g2, result.g3);
    writeJson(outMerged, {
        meta: {
            generatedAt: doneAt,
            from: {
                g1EasyFirst: ezSeeds.length,
                g2Flow: result.g2.length,
                g3SoftChallenge: result.g3.length,
            },
            total: merged.length,
            version: 'daily-cycle-v1',
        },
        seeds: merged,
    });

    const ok = result.g2.length === TARGET_G2 && result.g3.length === TARGET_G3;
    console.log(JSON.stringify({
        ok,
        tries: result.tries,
        g2: result.g2.length,
        g3: result.g3.length,
        g3Lucky3: result.g3Lucky3,
        g3ZeroClear: result.g3ZeroClear,
        outG2,
        outG3,
        outMerged,
    }, null, 2));
    if (!ok) process.exitCode = 1;
}

if (require.main === module) {
    main();
}

