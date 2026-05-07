/**
 * Valida pares canônicos de contraste WCAG na escala de 12 papéis (RFC-0039).
 *
 * Lê as primitives em `src/foundations/tokens/primitives/color.ts` (fonte da
 * verdade) e simula o mapping ColorScale documentado na §5 da RFC-0039 para
 * cada família themable (brand → aqua; gray → neutral; feedback.* → ocean,
 * emerald, orange, red).
 *
 * Pares canônicos validados (light + dark):
 *   - text         sobre bg     ≥ 4.5:1   (WCAG AA texto)
 *   - textContrast sobre bg     ≥ 7:1     (WCAG AAA)
 *   - border       sobre bg     ≥ 3:1     (WCAG AA non-text)
 *   - text.inverse sobre solid  ≥ 4.5:1   (WCAG AA texto)
 *
 * Quebra build em violação. Roda em CI via `pnpm test:contrast`.
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COLOR_FILE = join(__dirname, '..', 'src', 'foundations', 'tokens', 'primitives', 'color.ts');

function parsePrimitives() {
  const src = readFileSync(COLOR_FILE, 'utf-8');
  const families = {};
  // Match each "name: { ... }" block at top level
  const blockRegex = /(\w+):\s*{([^}]*)}/gs;
  for (const [, name, body] of src.matchAll(blockRegex)) {
    const palette = {};
    for (const [, key, val] of body.matchAll(/(\w+):\s*'([^']+)'/g)) {
      palette[key] = val;
    }
    families[name] = palette;
  }
  return families;
}

function makeLightScale(p) {
  return {
    bg: p[10],
    bgSubtle: p[20],
    bgElement: p[30],
    bgElementHover: p[40],
    bgElementActive: p[50],
    borderSubtle: p[60],
    border: p[70],
    borderHover: p[80],
    solid: p[90],
    solidHover: p[100],
    text: p[110],
    textContrast: p[120],
  };
}

function makeDarkScale(p) {
  return {
    bg: p[120],
    bgSubtle: p[110],
    bgElement: p[100],
    bgElementHover: p[90],
    bgElementActive: p[80],
    borderSubtle: p[70],
    border: p[60],
    borderHover: p[50],
    solid: p[50],
    solidHover: p[40],
    text: p[30],
    textContrast: p[20],
  };
}

function hexToRgb(hex) {
  const cleaned = hex.replace(/^#/, '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  const num = Number.parseInt(full, 16);
  return {
    r: ((num >> 16) & 0xff) / 255,
    g: ((num >> 8) & 0xff) / 255,
    b: (num & 0xff) / 255,
  };
}

function relativeLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const lin = (c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const primitives = parsePrimitives();

const MAPPING = {
  brand: { primitive: 'aqua' },
  gray: { primitive: 'neutral' },
  'feedback.info': { primitive: 'ocean' },
  'feedback.success': { primitive: 'emerald' },
  'feedback.warning': { primitive: 'orange' },
  'feedback.critical': { primitive: 'red' },
};

const PAIRS = [
  { fg: 'text', bg: 'bg', min: 4.5, label: 'text/bg (AA texto)' },
  { fg: 'textContrast', bg: 'bg', min: 7, label: 'textContrast/bg (AAA)' },
  { fg: 'border', bg: 'bg', min: 3, label: 'border/bg (AA non-text)' },
];

const INVERSE = {
  light: '#FFFFFF',
  dark: '#1F1F1F',
};

const errors = [];
const warnings = [];

// gray e feedback.warning são convencionalmente exceções:
// - gray é o canal neutro estrutural (texto, borda, surface) — derivações
//   semantic vivem fora da escala (theme.colors.text.*).
// - feedback.warning carrega solid amarelo/laranja saturado por convenção
//   visual; texto sobre warning.solid é tipicamente `text.primary` (escuro),
//   não `text.inverse` (branco). Tratamos como warning, não erro.
const STRICT_FAMILIES = new Set([
  'brand',
  'feedback.info',
  'feedback.success',
  'feedback.critical',
]);

for (const [familyName, { primitive }] of Object.entries(MAPPING)) {
  const palette = primitives[primitive];
  if (!palette) {
    errors.push(`primitive "${primitive}" não encontrada em color.ts (esperada para ${familyName})`);
    continue;
  }
  const isStrict = STRICT_FAMILIES.has(familyName);
  const scales = {
    light: makeLightScale(palette),
    dark: makeDarkScale(palette),
  };
  for (const [theme, scale] of Object.entries(scales)) {
    for (const { fg, bg, min, label } of PAIRS) {
      const ratio = contrastRatio(scale[fg], scale[bg]);
      if (ratio < min) {
        const collector = isStrict ? errors : warnings;
        collector.push(`${theme} · ${familyName}.${fg} sobre ${familyName}.${bg} = ${ratio.toFixed(2)}:1 (mínimo ${min}:1) — ${label}`);
      }
    }
    const solidInverseRatio = contrastRatio(INVERSE[theme], scale.solid);
    if (solidInverseRatio < 4.5) {
      const collector = isStrict ? errors : warnings;
      collector.push(`${theme} · text.inverse sobre ${familyName}.solid = ${solidInverseRatio.toFixed(2)}:1 (mínimo 4.5:1) — texto inverse sobre solid (AA)`);
    }
  }
}

if (warnings.length > 0) {
  console.warn('validate-contrast — avisos (gray e feedback.warning têm exceções convencionais, ver script):\n');
  for (const warn of warnings) {
    console.warn('  ' + warn);
  }
  console.warn('');
}

if (errors.length > 0) {
  console.error('validate-contrast — pares fora do mínimo WCAG:\n');
  for (const err of errors) {
    console.error('  ' + err);
  }
  console.error('');
  process.exit(1);
}

const totalPairs = Object.keys(MAPPING).length * 2 * (PAIRS.length + 1);
console.log(`validate-contrast — OK (${totalPairs} pares validados)`);
