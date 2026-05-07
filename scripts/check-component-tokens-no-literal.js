#!/usr/bin/env node
/**
 * Verifica se há cor literal (hex/rgba) ou tempo literal (ms/s) em
 * `src/foundations/tokens/components/`.
 *
 * RFC-0040: tokens de componente carregam aliases (strings) que resolvem
 * em runtime via theme. Cor literal e timing literal vazam identidade da
 * marca / decisões de motion para fora do canal themable.
 *
 * Tamanhos físicos (px/rem) são aceitos quando representam dimensões
 * intrínsecas do componente sem alias semantic correspondente (ex:
 * checkbox.size.small = '16px'). Migração para tokens semantic é evolução,
 * não bloqueio.
 *
 * Uso:
 *   node scripts/check-component-tokens-no-literal.js
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TARGET = join(ROOT, 'src', 'foundations', 'tokens', 'components');

const HEX_RE = /#[0-9A-Fa-f]{3,8}\b/;
const RGBA_RE = /rgba?\s*\(/;
const TIMING_RE = /\b\d+(?:\.\d+)?\s*(?:ms|s)\b/;

let hits = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.endsWith('.ts')) continue;
    if (entry === 'index.ts') continue;
    scan(full);
  }
}

function scan(file) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trimStart();
    if (trimmed.startsWith('//') || trimmed.startsWith('*')) continue;

    if (HEX_RE.test(line)) report(file, i + 1, line, 'cor hex literal');
    if (RGBA_RE.test(line)) report(file, i + 1, line, 'rgba literal');
    if (TIMING_RE.test(line)) report(file, i + 1, line, 'timing literal (ms/s)');
  }
}

function report(file, lineNo, line, reason) {
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '');
  console.error(`\x1b[31m✗ ${rel}:${lineNo}\x1b[0m  ${reason}\n  ${line.trim()}`);
  hits++;
}

walk(TARGET);

if (hits === 0) {
  console.log('\x1b[32m✓ component tokens have no color or timing literals\x1b[0m');
  process.exit(0);
} else {
  console.error(`\x1b[31m\n✗ ${hits} literal(s) found in src/foundations/tokens/components/\x1b[0m`);
  console.error('Use alias semantic (RFC-0040 §2.3): tokens carregam strings, não valores.');
  process.exit(1);
}
