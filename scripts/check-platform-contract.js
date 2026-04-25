#!/usr/bin/env node
/**
 * Verifica o contrato de plataforma do Arbor-DS.
 *
 * Regras:
 * 1. Componentes marcados como `native-ready` devem ter arquivo `.native.tsx` correspondente.
 * 2. O entrypoint `src/native.ts` não deve importar arquivos que contenham `@platform web-only`.
 * 3. Componentes `shared` e `native-ready` devem estar presentes em `src/native.ts`.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const SRC = join(ROOT, 'src');

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
  const match = fileContent.match(/@platform\s+(shared|native-ready|web-only|placeholder)/);
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

// ─── Regra 1: native-ready deve ter .native.tsx ───────────────────────────────

console.log('\n── Verificando componentes @platform native-ready ──');

const componentsDir = join(SRC, 'components');
const coreDir = join(componentsDir, 'core');

function checkNativeReadyComponents(baseDir) {
  if (!existsSync(baseDir)) return;

  for (const entry of readdirSync(baseDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const compDir = join(baseDir, entry.name);
    const tsxFiles = getAllTsxFiles(compDir);

    for (const file of tsxFiles) {
      const content = readFile(file);
      if (!content) continue;

      const tag = findPlatformTag(content);
      if (tag !== 'native-ready') continue;

      // Encontrou native-ready — verifica se existe .native.tsx no diretório core
      const coreComponentDir = join(compDir, 'core');
      if (!existsSync(coreComponentDir)) continue;

      const nativeFiles = readdirSync(coreComponentDir).filter(f => f.endsWith('.native.tsx'));
      if (nativeFiles.length === 0) {
        error(`[native-ready sem .native.tsx] ${file.replace(ROOT, '').replace(/\\/g, '/')}`);
        error(`  → Componente marcado como native-ready mas sem arquivo .native.tsx em ${coreComponentDir.replace(ROOT, '').replace(/\\/g, '/')}`);
      } else {
        ok(`${entry.name}: native-ready com ${nativeFiles.join(', ')}`);
      }
      break;
    }
  }
}

checkNativeReadyComponents(coreDir);

// ─── Regra 2: src/native.ts não deve importar web-only ────────────────────────

console.log('\n── Verificando src/native.ts não importa web-only ──');

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
    if (tag === 'web-only') {
      error(`[web-only importado em native.ts] ${importPath}`);
    }
  }

  if (!hasError) {
    ok('src/native.ts não importa nenhum componente web-only');
  }
}

// ─── Regra 3: inventário de suporte por plataforma ────────────────────────────

console.log('\n── Inventário de suporte por plataforma ──');

const allComponentDirs = [
  ...readdirSync(coreDir, { withFileTypes: true })
    .filter(e => e.isDirectory())
    .map(e => ({ name: `core/${e.name}`, dir: join(coreDir, e.name) })),
  ...readdirSync(componentsDir, { withFileTypes: true })
    .filter(e => e.isDirectory() && e.name !== 'core')
    .map(e => ({ name: e.name, dir: join(componentsDir, e.name) })),
];

const summary = { shared: [], 'native-ready': [], 'web-only': [], placeholder: [], unknown: [] };

for (const { name, dir } of allComponentDirs) {
  const files = getAllTsxFiles(dir);
  let tag = files.length === 0 ? 'placeholder' : 'unknown';

  for (const file of files) {
    const content = readFile(file);
    if (!content) continue;
    const found = findPlatformTag(content);
    if (found) { tag = found; break; }
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

// ─── Regra 3.5: web-only é classificação inválida (RFC-0018 + TD-017) ─────────

if (summary['web-only'] && summary['web-only'].length > 0) {
  console.log('');
  warn(`${summary['web-only'].length} componente(s) marcado(s) @platform web-only — classificação inválida pela RFC-0018.`);
  warn('   Cada um precisa de .native.tsx ou re-classificação para @platform shared.');
  warn('   Inventário em docs/TECH_DEBT.md (TD-017). Plano em docs/rfcs/RFC-0018-paridade-native-completa-do-ds.md.');
  for (const comp of summary['web-only']) {
    warn(`   - ${comp}`);
  }
}

// ─── Regra 4: todo .native.tsx deve ter .native.test.tsx irmão (RFC-0016) ────

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
