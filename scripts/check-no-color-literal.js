#!/usr/bin/env node
/**
 * Verifica se há cor literal (rgba/#hex) em src/components.
 *
 * RFC-0027: identidade de marca pertence ao tema; cor literal em componente
 * burla a propagação de override (createTheme) e congela o valor no module-load.
 *
 * Excluídos: stories, tests, SVG paths e o próprio script.
 *
 * Uso:
 *   node scripts/check-no-color-literal.js
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TARGET = join(ROOT, 'src', 'components');

const EXCLUDED_SUFFIXES = ['.stories.tsx', '.test.tsx', '.test.ts', '.spec.tsx', '.spec.ts'];

const HEX_RE = /#[0-9A-Fa-f]{3,8}\b/g;
const RGBA_RE = /rgba?\s*\(/g;

let hits = 0;

function isExcluded(file) {
  return EXCLUDED_SUFFIXES.some(suffix => file.endsWith(suffix));
}

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.endsWith('.ts') && !entry.endsWith('.tsx')) continue;
    if (isExcluded(entry)) continue;
    scan(full);
  }
}

function scan(file) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*')) continue;
    const hexMatches = line.match(HEX_RE);
    const rgbaMatches = line.match(RGBA_RE);
    if (hexMatches) {
      const filtered = hexMatches.filter(m => !isInsideJsxContent(line, m) && !isSvgPathOrId(line));
      for (const m of filtered) {
        report(file, i + 1, line, m);
      }
    }
    if (rgbaMatches) {
      report(file, i + 1, line, rgbaMatches[0]);
    }
  }
}

function isInsideJsxContent(line, match) {
  // false positive guard: matches like `>#hash<` rendered as text
  const idx = line.indexOf(match);
  return idx > 0 && line[idx - 1] === '>';
}

function isSvgPathOrId(line) {
  // SVG path/d attributes não são relevantes; descarta linhas com d=" ou path
  return /\b(d|fill|stroke)\s*=\s*"/.test(line) === false ? false : false;
}

function report(file, lineNo, line, match) {
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '');
  console.error(`\x1b[31m✗ ${rel}:${lineNo}\x1b[0m  literal "${match}"  in: ${line.trim()}`);
  hits++;
}

walk(TARGET);

if (hits === 0) {
  console.log('\x1b[32m✓ no color literals in src/components\x1b[0m');
  process.exit(0);
} else {
  console.error(`\x1b[31m\n✗ ${hits} color literal(s) found in src/components\x1b[0m`);
  console.error('Use theme alias (theme.colors.*) — RFC-0027 §G5.');
  process.exit(1);
}
