import { text } from '../src/foundations/tokens/components/text/text.ts';
import { fontSize as primitiveFontSize } from '../src/foundations/tokens/primitives/typography/font-size.ts';
import { letterSpacing as primitiveLetterSpacing } from '../src/foundations/tokens/primitives/typography/letter-spacing.ts';

type ValidationError = { style: string; field: string; value: unknown };

const errors: ValidationError[] = [];

const validFontSizes = new Set(Object.values(primitiveFontSize));
const validLetterSpacings = new Set(Object.values(primitiveLetterSpacing));

for (const [name, style] of Object.entries(text)) {
  if (style.fontSize !== undefined && !validFontSizes.has(style.fontSize)) {
    errors.push({ style: name, field: 'fontSize', value: style.fontSize });
  }
  if (style.letterSpacing !== undefined && !validLetterSpacings.has(style.letterSpacing)) {
    errors.push({ style: name, field: 'letterSpacing', value: style.letterSpacing });
  }
}

if (errors.length > 0) {
  console.error('tokens:validate — orphaned token references found:\n');
  for (const { style, field, value } of errors) {
    console.error(`  components.text.${style}.${field} = ${JSON.stringify(value)} — not found in primitives`);
  }
  console.error('');
  process.exit(1);
}

console.log(`tokens:validate — OK (${Object.keys(text).length} text styles validated)`);
