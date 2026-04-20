import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', 'src', 'foundations', 'tokens');

function readSource(relPath) {
  return readFileSync(join(root, relPath), 'utf-8');
}

// --- Extract fontSize primitive values ---
const fontSizeSrc = readSource('primitives/typography/font-size.ts');
const fontSizeValues = new Set(
  [...fontSizeSrc.matchAll(/\d+:\s*(\d+)/g)].map(([, v]) => Number(v))
);

// --- Extract letterSpacing primitive values ---
const letterSpacingSrc = readSource('primitives/typography/letter-spacing.ts');
const letterSpacingValues = new Set(
  [...letterSpacingSrc.matchAll(/:\s*'([^']+)'/g)].map(([, v]) => v)
);

// --- Extract text component styles ---
const textSrc = readSource('components/text/text.ts');

// Capture all fontSize: <number> or fontSize: fontSize.<key>
const fontSizeTokenRefs = [...textSrc.matchAll(/fontSize\.\s*(\w+)/g)].map(([, k]) => k);
const fontSizeRawRefs = [...textSrc.matchAll(/fontSize:\s*(\d+)/g)].map(([, v]) => Number(v));

// Capture all letterSpacing: letterSpacing.<key>  or letterSpacing: <literal>
const lsTokenRefs = [...textSrc.matchAll(/letterSpacing\.\s*(\w+)/g)].map(([, k]) => k);
const lsRawRefs = [...textSrc.matchAll(/letterSpacing:\s*'([^']+)'/g)].map(([, v]) => v);

// --- Extract semantic fontSize mapping ---
const semanticFontSizeSrc = readSource('semantics/typography/font-size.ts');
const semanticFontSizeMap = {};
for (const [, key, val] of semanticFontSizeSrc.matchAll(/(\w+):\s*primitiveFontSize\[(\d+)\]/g)) {
  semanticFontSizeMap[key] = Number(val);
}

// --- Extract semantic letterSpacing mapping ---
const semanticLSSrc = readSource('semantics/typography/letter-spacing.ts');
const semanticLSMap = {};
for (const [, key, val] of semanticLSSrc.matchAll(/(\w+):\s*primitiveLetterSpacing\.(\w+)/g)) {
  semanticLSMap[key] = val;
}

const errors = [];

// Validate fontSize token refs against semantic map + primitives
for (const key of fontSizeTokenRefs) {
  const primitiveVal = semanticFontSizeMap[key];
  if (primitiveVal === undefined) {
    errors.push(`components.text uses fontSize.${key} which has no semantic mapping`);
  } else if (!fontSizeValues.has(primitiveVal)) {
    errors.push(`components.text uses fontSize.${key} (${primitiveVal}) — value not in fontSize primitives`);
  }
}

// Validate raw fontSize numbers
for (const val of fontSizeRawRefs) {
  if (!fontSizeValues.has(val)) {
    errors.push(`components.text uses hardcoded fontSize: ${val} — value not in fontSize primitives`);
  }
}

// Validate letterSpacing token refs
for (const key of lsTokenRefs) {
  const primitiveKey = semanticLSMap[key];
  if (!primitiveKey) {
    errors.push(`components.text uses letterSpacing.${key} which has no semantic mapping`);
  } else if (!letterSpacingValues.has(letterSpacingValues.has(primitiveKey) ? primitiveKey : '')) {
    // re-check: the semantic key maps to a primitive key name, validate the primitive key exists
    const allPrimitiveKeys = [...letterSpacingSrc.matchAll(/(\w+):\s*'/g)].map(([, k]) => k);
    if (!allPrimitiveKeys.includes(primitiveKey)) {
      errors.push(`components.text uses letterSpacing.${key} → primitive.${primitiveKey} — key not in letterSpacing primitives`);
    }
  }
}

// Validate raw letterSpacing strings
for (const val of lsRawRefs) {
  if (!letterSpacingValues.has(val)) {
    errors.push(`components.text uses hardcoded letterSpacing: '${val}' — value not in letterSpacing primitives`);
  }
}

if (errors.length > 0) {
  console.error('tokens:validate — orphaned token references found:\n');
  for (const err of errors) {
    console.error('  ' + err);
  }
  console.error('');
  process.exit(1);
}

console.log(`tokens:validate — OK (fontSize primitives: ${fontSizeValues.size}, letterSpacing primitives: ${letterSpacingValues.size})`);
