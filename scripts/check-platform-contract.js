#!/usr/bin/env node
/**
 * Verifica o contrato de plataforma do Arbor-DS.
 *
 * Vocabulário canônico de `@platform`: `shared | web | native | placeholder`.
 *
 * Semântica: `shared` cobre dois caminhos válidos para paridade cross-platform —
 * (a) o engine resolve sozinho (Box/Flex/Center, etc.) e não há `.native.tsx`;
 * (b) o componente tem especialização `.native.tsx` ao lado do `.tsx` web.
 * Por isso não exigimos `.native.tsx` para todo `shared` — o gate de paridade
 * é feito pela Regra 3 (componente apenas `web` viola RFC-0018) e pela Regra 4
 * (todo `.native.tsx` precisa do `.native.test.tsx` irmão).
 *
 * Regras:
 * 1. O entrypoint `src/native.ts` não deve importar arquivos com `@platform web`.
 * 2. Inventário de classificação por componente (informativo).
 * 3. Componentes classificados apenas como `web` (sem par nativo) violam RFC-0018.
 *    Em modo `--strict`, falha o build.
 * 4. Todo `.native.tsx` deve ter `.native.test.tsx` irmão (RFC-0016).
 *
 * Uso:
 *   node scripts/check-platform-contract.js          # warns sobre web-only
 *   node scripts/check-platform-contract.js --strict # falha em qualquer web-only (CI)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');

const STRICT = process.argv.includes('--strict');

let hasError = false;

function error(msg) {
  console.error(`\x1b[31m✗ ${msg}\x1b[0m`);
  hasError = true;
}

function ok(msg) {
  console.log(`\x1b[32m✓ ${msg}\x1b[0m`);
}

function warn(msg) {
  console.warn(`\x1b[33m⚠ ${msg}\x1b[0m`);
}

function readFile(path) {
  try {
    return readFileSync(path, 'utf-8');
  } catch {
    return null;
  }
}

function findPlatformTag(fileContent) {
  const match = fileContent.match(/@platform\s+(shared|web|native|placeholder)/);
  return match ? match[1] : null;
}

function getAllTsxFiles(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllTsxFiles(fullPath));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) && !entry.name.endsWith('.test.tsx')) {
      files.push(fullPath);
    }
  }
  return files;
}

const componentsDir = join(SRC, 'components');
const coreDir = join(componentsDir, 'core');

// ─── Regra 1: src/native.ts não deve importar @platform web ───────────────────

console.log('\n── Verificando src/native.ts não importa @platform web ──');

const nativeEntry = join(SRC, 'native.ts');
if (!existsSync(nativeEntry)) {
  error('src/native.ts não existe — entrypoint nativo ausente.');
} else {
  const nativeContent = readFile(nativeEntry);
  const importMatches = [...nativeContent.matchAll(/from\s+['"]([^'"]+)['"]/g)];

  for (const match of importMatches) {
    const importPath = match[1];
    if (!importPath.startsWith('.')) continue;

    const resolvedDir = resolve(SRC, importPath);
    const candidates = [
      resolvedDir + '.ts',
      resolvedDir + '.tsx',
      join(resolvedDir, 'index.ts'),
      join(resolvedDir, 'index.tsx'),
    ];

    let fileContent = null;
    for (const candidate of candidates) {
      const content = readFile(candidate);
      if (content) { fileContent = content; break; }
    }

    if (!fileContent) continue;

    const tag = findPlatformTag(fileContent);
    if (tag === 'web') {
      error(`[@platform web importado em native.ts] ${importPath}`);
    }
  }

  if (!hasError) {
    ok('src/native.ts não importa nenhum componente @platform web');
  }
}

// ─── Regra 2: inventário de suporte por plataforma ────────────────────────────

console.log('\n── Inventário de suporte por plataforma ──');

const allComponentDirs = [
  ...readdirSync(coreDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => ({ name: `core/${e.name}`, dir: join(coreDir, e.name) })),
  ...readdirSync(componentsDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name !== 'core')
    .map(e => ({ name: e.name, dir: join(componentsDir, e.name) })),
];

const summary = { shared: [], web: [], native: [], placeholder: [], unknown: [] };

// Para classificar o componente, preferimos a tag mais inclusiva encontrada em
// qualquer arquivo do diretório: `shared` > `web` > `native` > `placeholder`.
// Assim, um diretório com `comp.tsx` (`@platform shared`) e `comp.native.tsx`
// (`@platform native`) classifica como `shared` (contrato cross-platform), não
// como `native` por acaso de ordenação alfabética.
const TAG_PRIORITY = { shared: 4, web: 3, native: 2, placeholder: 1 };

for (const { name, dir } of allComponentDirs) {
  const files = getAllTsxFiles(dir);
  let tag = files.length === 0 ? 'placeholder' : 'unknown';
  let priority = 0;

  for (const file of files) {
    const content = readFile(file);
    if (!content) continue;
    const found = findPlatformTag(content);
    if (!found) continue;
    const p = TAG_PRIORITY[found] ?? 0;
    if (p > priority) {
      priority = p;
      tag = found;
    }
  }

  summary[tag] = summary[tag] || [];
  summary[tag].push(name);
}

for (const [platform, components] of Object.entries(summary)) {
  if (components.length > 0) {
    console.log(`\n  ${platform.toUpperCase()} (${components.length}):`);
    for (const comp of components) {
      console.log(`    - ${comp}`);
    }
  }
}

if (summary.unknown.length > 0) {
  warn(`\n${summary.unknown.length} componente(s) sem tag @platform — adicione a tag para formalizar o suporte.`);
}

// ─── Regra 3: componente exclusivamente `web` viola RFC-0018 ──────────────────
//
// Tags `web` e `native` são válidas em arquivos individuais que documentam a
// especialização por plataforma de um componente shared. O que viola RFC-0018 é
// um diretório de componente cuja única tag `@platform` encontrada seja `web`
// (i.e., sem par nativo em qualquer arquivo do diretório).

if (summary.web.length > 0) {
  const count = summary.web.length;
  const banner = '═'.repeat(72);
  console.log('');
  console.log(`\x1b[33m${banner}\x1b[0m`);
  console.log(`\x1b[33m  CONTRATO RFC-0018 VIOLADO — ${count} componente(s) sem paridade native\x1b[0m`);
  console.log(`\x1b[33m${banner}\x1b[0m`);
  warn('  Componente classificado apenas como `@platform web` (sem par `shared` nem `native`).');
  warn('  Critério da RFC-0018: todo componente do DS deve ter paridade native.');
  warn('');
  warn('  Cada item abaixo precisa de uma destas resoluções:');
  warn('    1. Adicionar `.native.tsx` correspondente + classificar como `@platform shared`.');
  warn('    2. Confirmar que o engine cobre cross-platform e re-classificar como `shared`.');
  warn('    3. Abrir RFC dedicada se exigir decisão arquitetural (ex.: peer dep RN-svg).');
  warn('');
  warn('  Inventário: docs/TECH_DEBT.md (TD-017)');
  warn('  Plano: docs/rfcs/RFC-0018-paridade-native-completa-do-ds.md');
  warn('');
  warn(`  Componentes em violação (${count}):`);
  for (const comp of summary.web) {
    warn(`    × ${comp}`);
  }
  console.log(`\x1b[33m${banner}\x1b[0m`);
  if (STRICT) {
    error('Modo --strict ativo: componente apenas `@platform web` é falha de contrato.');
  }
}

// ─── Regra 4: todo .native.tsx deve ter .native.test.tsx irmão (RFC-0016) ─────

console.log('\n── Verificando paridade .native.tsx ↔ .native.test.tsx ──');

function findNativeImplFiles(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findNativeImplFiles(fullPath));
    } else if (
      entry.isFile() &&
      entry.name.endsWith('.native.tsx') &&
      !entry.name.endsWith('.native.test.tsx')
    ) {
      files.push(fullPath);
    }
  }
  return files;
}

const nativeImplFiles = findNativeImplFiles(SRC);
let coveredCount = 0;

for (const implPath of nativeImplFiles) {
  const testPath = implPath.replace(/\.native\.tsx$/, '.native.test.tsx');
  const rel = implPath.replace(ROOT, '').replace(/\\/g, '/');
  if (!existsSync(testPath)) {
    error(`[.native.tsx sem .native.test.tsx] ${rel}`);
    error(`  → Esperado: ${testPath.replace(ROOT, '').replace(/\\/g, '/')}`);
  } else {
    coveredCount += 1;
  }
}

if (nativeImplFiles.length > 0 && coveredCount === nativeImplFiles.length) {
  ok(`Todos os ${nativeImplFiles.length} arquivos .native.tsx têm .native.test.tsx irmão.`);
}

// ─── Resultado final ──────────────────────────────────────────────────────────

console.log('');
if (hasError) {
  console.error('\x1b[31m✗ Verificação de contrato de plataforma falhou.\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32m✓ Contrato de plataforma verificado com sucesso.\x1b[0m\n');
}
