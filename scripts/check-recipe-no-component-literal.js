#!/usr/bin/env node
/**
 * Verifica se as recipes em `src/foundations/theme/base-theme.ts` estão
 * livres de literais estruturais (px, cor hex/rgba, timing ms/s).
 *
 * RFC-0040: recipes consomem alias semantic (`'small'`, `'border.default'`)
 * ou alias de component token (`'$input.padding.medium.inline'`). Literal
 * estrutural na recipe burla a cascata de override do tema.
 *
 * Whitelist:
 *   - linhas com `transform:` (ex: `translateY(-2px)`) — convencional motion
 *   - linhas com `outline:` ou `outlineOffset:` — anatomia do focus ring é
 *     decisão estrutural com default WCAG (skill arch §Theming)
 *   - bloco `breakpoints` (640px/768px/...) — valores estruturais
 *   - `inset: '0'`, `width: '100%'`, `padding: 0` etc. — keywords/zero
 *
 * Uso:
 *   node scripts/check-recipe-no-component-literal.js
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TARGET = resolve(ROOT, 'src', 'foundations', 'theme', 'base-theme.ts');

const PX_RE = /\b\d+(?:\.\d+)?px\b/;
const HEX_RE = /#[0-9A-Fa-f]{3,8}\b/;
const RGBA_RE = /rgba?\s*\(/;
const TIMING_RE = /\b\d+(?:\.\d+)?\s*(?:ms|s)\b/;

const PROP_WHITELIST = /\b(transform|outline|outlineOffset|breakpoints)\s*[:=]/;

let hits = 0;
let inBreakpoints = false;

function scan(file) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

    if (/breakpoints\s*:\s*createBreakpoints/.test(line)) inBreakpoints = true;
    if (inBreakpoints && /^\s*\}\)\s*,?\s*$/.test(line)) {
      inBreakpoints = false;
      continue;
    }
    if (inBreakpoints) continue;

    if (PROP_WHITELIST.test(line)) continue;

    if (HEX_RE.test(line)) report(file, i + 1, line, 'cor hex literal');
    if (RGBA_RE.test(line)) report(file, i + 1, line, 'rgba literal');
    if (TIMING_RE.test(line)) report(file, i + 1, line, 'timing literal (ms/s)');
    if (PX_RE.test(line)) report(file, i + 1, line, 'px literal estrutural em recipe');
  }
}

function report(file, lineNo, line, reason) {
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '');
  console.error(`\x1b[31m✗ ${rel}:${lineNo}\x1b[0m  ${reason}\n  ${line.trim()}`);
  hits++;
}

scan(TARGET);

if (hits === 0) {
  console.log('\x1b[32m✓ recipes in base-theme.ts use alias only (no structural literals)\x1b[0m');
  process.exit(0);
} else {
  console.error(`\x1b[31m\n✗ ${hits} literal(s) found in recipes\x1b[0m`);
  console.error('Use alias semantic ("small") ou alias de component token ("$input.padding.medium.inline") — RFC-0040.');
  process.exit(1);
}
