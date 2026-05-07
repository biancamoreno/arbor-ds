#!/usr/bin/env node
/**
 * Valida que todo `$<token>.<path>` em base-theme.ts resolve em
 * src/foundations/tokens/components/, e detecta tokens órfãos (sem consumidor).
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const baseTheme = readFileSync(resolve(ROOT, 'src/foundations/theme/base-theme.ts'), 'utf-8');
const aliasesUsed = new Set(
  [...baseTheme.matchAll(/\$([a-zA-Z]+)\.([a-zA-Z0-9.]+)/g)].map(m => `${m[1]}.${m[2]}`),
);

const componentsDir = resolve(ROOT, 'src/foundations/tokens/components');
const tokenFiles = [
  'accordion','alert','avatar','badge','button','card','carousel','checkbox',
  'chip','dialog','drawer','field','input','radio','select','switch','tabs','tag','toast','tooltip',
];

const tokens = {};
for (const name of tokenFiles) {
  const src = readFileSync(resolve(componentsDir, `${name}.ts`), 'utf-8');
  const match = src.match(/export const \w+ = (\{[\s\S]*?\n\});/);
  if (!match) { console.error(`✗ falha ao parsear ${name}.ts`); process.exit(1); }
  tokens[name] = eval(`(${match[1]})`);
}

// 1. Aliases usados resolvem?
let missing = 0;
for (const alias of aliasesUsed) {
  const [tokenName, ...path] = alias.split('.');
  let cur = tokens[tokenName];
  if (!cur) { console.error(`✗ $${alias} → token "${tokenName}" não existe`); missing++; continue; }
  for (const seg of path) {
    if (cur == null || typeof cur !== 'object' || !(seg in cur)) {
      console.error(`✗ $${alias} → caminho parou em "${seg}"`); missing++; cur = undefined; break;
    }
    cur = cur[seg];
  }
}

// 2. Tokens órfãos — folhas (string/number) que NÃO são consumidas por nenhum alias
function leaves(obj, prefix = []) {
  if (obj === null || typeof obj !== 'object') return [[prefix.join('.'), obj]];
  return Object.entries(obj).flatMap(([k, v]) => leaves(v, [...prefix, k]));
}

const orphans = [];
for (const [tokenName, tokenObj] of Object.entries(tokens)) {
  for (const [path] of leaves(tokenObj)) {
    const fullPath = `${tokenName}.${path}`;
    if (!aliasesUsed.has(fullPath)) orphans.push(fullPath);
  }
}

console.log(`\n${aliasesUsed.size} aliases consumidos`);
console.log(`${orphans.length} folhas órfãs em tokens/components/\n`);
if (orphans.length) {
  for (const o of orphans) console.log(`  · $${o}`);
}
console.log();
if (missing === 0) console.log(`\x1b[32m✓ todos os aliases consumidos resolvem\x1b[0m`);
else { console.error(`\x1b[31m✗ ${missing} aliases órfãos sem destino\x1b[0m`); process.exit(1); }
