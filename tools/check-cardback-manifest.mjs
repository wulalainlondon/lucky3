#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const mainJsPath = path.join(root, 'app/src/main.js');
const cssPath = path.join(root, 'app/styles/base.css');
const rootCardbackDir = path.join(root, 'cardback');
const appCardbackDir = path.join(root, 'app/cardback');

const mainJs = fs.readFileSync(mainJsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

const cardBackBlockMatch = mainJs.match(/const\s+CARD_BACKS\s*=\s*\[([\s\S]*?)\n\s*\];/);
if (!cardBackBlockMatch) {
    console.error('[cardback-manifest] CARD_BACKS block not found in app/src/main.js');
    process.exit(1);
}
const cardBackBlock = cardBackBlockMatch[1];
const cardBackIds = [...cardBackBlock.matchAll(/\{\s*id:\s*'([^']+)'/g)].map((m) => m[1]);
if (cardBackIds.length === 0) {
    console.error('[cardback-manifest] No CARD_BACKS ids found in app/src/main.js');
    process.exit(1);
}

const previewMap = new Map();
for (const m of css.matchAll(/\.cb-preview-([a-z0-9_]+)\s*\{[^}]*background-image:\s*url\('\.\.\/cardback\/([^']+)'\)/g)) {
    previewMap.set(m[1], m[2]);
}

const errors = [];
for (const id of cardBackIds) {
    const filename = id === 'classic' ? 'classic.png' : previewMap.get(id);
    if (!filename) {
        errors.push(`missing CSS preview mapping for cardback id: ${id}`);
        continue;
    }

    const rootFile = path.join(rootCardbackDir, filename);
    const appFile = path.join(appCardbackDir, filename);
    if (!fs.existsSync(rootFile)) errors.push(`missing file: cardback/${filename} (for ${id})`);
    if (!fs.existsSync(appFile)) errors.push(`missing file: app/cardback/${filename} (for ${id})`);

    if (id !== 'classic') {
        const deckClass = `#deck-pile.cb-${id}`;
        if (!css.includes(deckClass)) {
            errors.push(`missing deck class style: ${deckClass}`);
        }
    }
}

if (errors.length > 0) {
    console.error('[cardback-manifest] FAILED');
    errors.forEach((e) => console.error(` - ${e}`));
    process.exit(1);
}

console.log(`[cardback-manifest] OK (${cardBackIds.length} cardbacks validated)`);
