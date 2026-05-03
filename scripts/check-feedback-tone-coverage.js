#!/usr/bin/env node
/**
 * Verifica que toda interface `*Props.ts` que declara `tone?:` usa
 * `FeedbackTone` (canônico ou subset via `Exclude<...>`/`Pick<...>`),
 * em vez de literal inline.
 *
 * RFC-0032: catálogo `FeedbackTone` cross-componente. Tone literal
 * (`tone?: 'a' | 'b'`) burla a propagação de novos tones e re-introduz
 * drift que o helper `getFeedbackToneColor` resolve.
 *
 * Uso:
 *   node scripts/check-feedback-tone-coverage.js
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const TARGET = join(ROOT, 'src', 'components');

const TONE_DECL_RE = /\btone\s*\??:\s*([^;,)]+)/g;
const ALLOWED_TOKENS = ['FeedbackTone', 'ToastTone'];

let hits = 0;

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.endsWith('Props.ts') && !entry.endsWith('Props.tsx')) continue;
    scan(full);
  }
}

function scan(file) {
  const content = readFileSync(file, 'utf-8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*')) continue;
    const matches = [...line.matchAll(TONE_DECL_RE)];
    for (const m of matches) {
      const value = m[1].trim();
      if (looksLikeAllowed(value, content)) continue;
      // Literal inline: `tone?: 'foo' | 'bar'`
      if (/^['"`]/.test(value)) {
        report(file, i + 1, line, value);
      }
    }
  }
}

function looksLikeAllowed(value, content) {
  for (const token of ALLOWED_TOKENS) {
    if (value.includes(token)) return true;
  }
  // Permite `Exclude<FeedbackTone, ...>` / `Pick<FeedbackTone, ...>` em linhas próximas
  if (/Exclude\s*<\s*FeedbackTone/.test(value)) return true;
  if (/Pick\s*<\s*FeedbackTone/.test(value)) return true;
  return false;
}

function report(file, lineNo, line, match) {
  const rel = file.replace(ROOT + '\\', '').replace(ROOT + '/', '');
  console.error(`\x1b[31m✗ ${rel}:${lineNo}\x1b[0m  tone literal "${match}"  in: ${line.trim()}`);
  hits++;
}

walk(TARGET);

if (hits === 0) {
  console.log('\x1b[32m✓ all tone? declarations consume FeedbackTone (RFC-0032)\x1b[0m');
  process.exit(0);
} else {
  console.error(`\x1b[31m\n✗ ${hits} tone literal(s) found\x1b[0m`);
  console.error('Use FeedbackTone (foundations) — RFC-0032.');
  process.exit(1);
}
