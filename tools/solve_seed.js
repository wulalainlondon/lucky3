#!/usr/bin/env node
'use strict';

const { simulate } = require('../solver');

function parseArgs(argv) {
    const out = { seed: null, maxMoves: 10000, debug: false };
    for (let i = 2; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--seed' || a === '-s') out.seed = Number(argv[++i]);
        else if (a === '--max-moves') out.maxMoves = Number(argv[++i]);
        else if (a === '--debug') out.debug = true;
        else if (a === '--help' || a === '-h') out.help = true;
    }
    return out;
}

function main() {
    const args = parseArgs(process.argv);
    if (args.help || !Number.isInteger(args.seed)) {
        console.log('Usage: node tools/solve_seed.js --seed <uint32> [--max-moves <n>] [--debug]');
        process.exit(args.help ? 0 : 1);
    }

    const result = simulate(args.seed >>> 0, {
        maxMoves: Number.isInteger(args.maxMoves) ? args.maxMoves : 10000,
        debug: !!args.debug,
    });

    console.log(JSON.stringify({ seed: args.seed >>> 0, ...result }, null, 2));
}

if (require.main === module) main();
