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

const TARGET   = 500;
const MAX_TRIES = 3000000;
const RNG_SEED  = 0x20260421;

// T1 閃電：開場儀式，極快拿籤詩
function passesT1(s) {
    return s.won && s.dealCount >= 28 && s.dealCount <= 33 &&
           s.recycleCount === 1 && s.maxCombo >= 2 && s.firstElimAt <= 0;
}

// T2 暖身：同 recycle=1，首次 combo 3
function passesT2(s) {
    return s.won && s.dealCount >= 42 && s.dealCount <= 58 &&
           s.recycleCount === 1 && s.maxCombo >= 3 && s.firstElimAt <= 1;
}

// T3 銜接：首次 recycle=2，局短讓玩家消化新機制
function passesT3(s) {
    return s.won && s.dealCount >= 55 && s.dealCount <= 72 &&
           s.recycleCount === 2 && s.maxCombo >= 3 && s.firstElimAt <= 2;
}

// T4 流動：熟悉 recycle 後拉長，舒適挑戰區
function passesT4(s) {
    return s.won && s.dealCount >= 78 && s.dealCount <= 98 &&
           s.recycleCount >= 2 && s.recycleCount <= 3 &&
           s.maxCombo >= 3 && s.firstElimAt <= 2;
}

// T5 挑戰：多次反轉，給想要更多的玩家
function passesT5(s) {
    return s.won && s.dealCount >= 100 && s.dealCount <= 125 &&
           s.recycleCount >= 3 && s.recycleCount <= 6 &&
           s.maxCombo >= 3 && s.firstElimAt <= 4;
}

function generate() {
    const rng  = mulberry32(RNG_SEED);
    const seen = new Set();
    const t1 = [], t2 = [], t3 = [], t4 = [], t5 = [];
    let tries = 0;

    while (tries < MAX_TRIES &&
           (t1.length < TARGET || t2.length < TARGET || t3.length < TARGET ||
            t4.length < TARGET || t5.length < TARGET)) {
        tries++;
        const seed = (rng() * 0x100000000) >>> 0;
        if (seen.has(seed)) continue;
        seen.add(seed);

        const s = simulate(seed);

        if (t1.length < TARGET && passesT1(s)) t1.push(seed);
        if (t2.length < TARGET && passesT2(s)) t2.push(seed);
        if (t3.length < TARGET && passesT3(s)) t3.push(seed);
        if (t4.length < TARGET && passesT4(s)) t4.push(seed);
        if (t5.length < TARGET && passesT5(s)) t5.push(seed);
    }

    return { tries, t1, t2, t3, t4, t5 };
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
    const out = {
        t1: path.resolve(__dirname, 'seed_pool_t1_lightning_500.json'),
        t2: path.resolve(__dirname, 'seed_pool_t2_warmup_500.json'),
        t3: path.resolve(__dirname, 'seed_pool_t3_bridge_500.json'),
        t4: path.resolve(__dirname, 'seed_pool_t4_flow_500.json'),
        t5: path.resolve(__dirname, 'seed_pool_t5_challenge_500.json'),
        merged: path.resolve(__dirname, 'seed_pool_daily_cycle_v3_2500.json'),
    };

    const startAt = new Date().toISOString();
    const result  = generate();
    const doneAt  = new Date().toISOString();

    const makeMeta = (tier, found, criteria) => ({
        generatedAt: doneAt, startedAt: startAt,
        tries: result.tries, found, target: TARGET,
        tier, criteria,
    });

    writeJson(out.t1, { meta: makeMeta('T1-lightning', result.t1.length, {
        won: true, dealCount: '28-33', recycleCount: 1, maxComboMin: 2, firstElimAtMax: 0,
    }), seeds: result.t1 });

    writeJson(out.t2, { meta: makeMeta('T2-warmup', result.t2.length, {
        won: true, dealCount: '42-58', recycleCount: 1, maxComboMin: 3, firstElimAtMax: 1,
    }), seeds: result.t2 });

    writeJson(out.t3, { meta: makeMeta('T3-bridge', result.t3.length, {
        won: true, dealCount: '55-72', recycleCount: 2, maxComboMin: 3, firstElimAtMax: 2,
    }), seeds: result.t3 });

    writeJson(out.t4, { meta: makeMeta('T4-flow', result.t4.length, {
        won: true, dealCount: '78-98', recycleCountRange: '2-3', maxComboMin: 3, firstElimAtMax: 2,
    }), seeds: result.t4 });

    writeJson(out.t5, { meta: makeMeta('T5-challenge', result.t5.length, {
        won: true, dealCount: '100-125', recycleCountRange: '3-6', maxComboMin: 3, firstElimAtMax: 4,
    }), seeds: result.t5 });

    const merged = result.t1.concat(result.t2, result.t3, result.t4, result.t5);
    writeJson(out.merged, {
        meta: {
            generatedAt: doneAt, version: 'daily-cycle-v3',
            from: { t1: result.t1.length, t2: result.t2.length, t3: result.t3.length,
                    t4: result.t4.length, t5: result.t5.length },
            total: merged.length,
        },
        seeds: merged,
    });

    const ok = [result.t1, result.t2, result.t3, result.t4, result.t5].every(p => p.length === TARGET);
    console.log(JSON.stringify({ ok, tries: result.tries,
        t1: result.t1.length, t2: result.t2.length, t3: result.t3.length,
        t4: result.t4.length, t5: result.t5.length }, null, 2));
    if (!ok) process.exitCode = 1;
}

if (require.main === module) main();
