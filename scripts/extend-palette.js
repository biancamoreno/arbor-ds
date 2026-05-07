/**
 * Gera os steps 110 e 120 (text e textContrast) para uma cor primitive
 * 10-step a partir de interpolação OKLCH-aproximada (lerp em sRGB).
 *
 * Uso:
 *   node scripts/extend-palette.js '#17442C'
 *
 * Saída: hex de step.110 e step.120, prontos pra colar em primitives/color.ts.
 *
 * RFC-0039 — calibração das famílias themable que hoje param em step.100.
 */

const BLACK = '#000000';

function hexToRgb(hex) {
  const cleaned = hex.replace(/^#/, '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  const num = Number.parseInt(full, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

function rgbToHex(r, g, b) {
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v) => clamp(v).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lerp(from, to, t) {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
  );
}

function extend(step100) {
  return {
    110: lerp(step100, BLACK, 0.30),
    120: lerp(step100, BLACK, 0.55),
  };
}

const input = process.argv[2];
if (!input || !/^#?[0-9a-fA-F]{6}$/.test(input)) {
  console.error('Uso: node scripts/extend-palette.js <#hex de step.100>');
  process.exit(1);
}

const result = extend(input.startsWith('#') ? input : `#${input}`);
console.log(`110: '${result[110]}',`);
console.log(`120: '${result[120]}',`);
