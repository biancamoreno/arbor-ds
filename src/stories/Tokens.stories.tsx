import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { color } from '../foundations/tokens/primitives/color';
import { spacing } from '../foundations/tokens/primitives/spacing';
import { fontSize } from '../foundations/tokens/primitives/typography/font-size';
import { borderRadius } from '../foundations/tokens/primitives/borders/border-radius';
import { themeLightColors } from '../foundations/tokens/semantics/color/themeLightColors';
import { themeDarkColors } from '../foundations/tokens/semantics/color/themeDarkColors';
import type { ColorScale } from '../foundations/tokens/semantics/color/scale';

function hexToRgb(hex: string) {
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

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function contrastRatio(fg: string, bg: string) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const meta = {
  title: 'Foundations/Tokens',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, borderBottom: '1px solid #eee', paddingBottom: 8 }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

function ColorSwatch({ name, value }: { name: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div
        style={{ width: 48, height: 48, borderRadius: 8, background: value, border: '1px solid rgba(0,0,0,0.1)' }}
        title={value}
      />
      <span style={{ fontSize: 11, color: '#666', textAlign: 'center', maxWidth: 60, wordBreak: 'break-all' }}>
        {name}
      </span>
      <span style={{ fontSize: 10, color: '#999' }}>{value}</span>
    </div>
  );
}

function ColorPalette({ name, shades }: { name: string; shades: Record<string | number, string> }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'capitalize' }}>{name}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {Object.entries(shades).map(([shade, value]) => (
          <ColorSwatch key={shade} name={shade} value={value} />
        ))}
      </div>
    </div>
  );
}

export const PrimitiveColors: Story = {
  name: 'Primitive Colors',
  render: () => (
    <div>
      <Section title="Escala de Cores Primitivas">
        {Object.entries(color).map(([name, shades]) => (
          <ColorPalette key={name} name={name} shades={shades as Record<string | number, string>} />
        ))}
      </Section>
    </div>
  ),
};

export const SemanticColors: Story = {
  name: 'Semantic Colors',
  render: () => (
    <div>
      <Section title="Cores Semânticas (Light Theme)">
        {Object.entries(themeLightColors).map(([category, tokens]) => (
          <div key={category} style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, textTransform: 'capitalize' }}>{category}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {Object.entries(tokens as Record<string, string | Record<string, string>>).flatMap(([key, value]) =>
                typeof value === 'string'
                  ? [<ColorSwatch key={key} name={key} value={value} />]
                  : Object.entries(value as Record<string, string>).map(([subKey, subValue]) => (
                      <ColorSwatch key={`${key}.${subKey}`} name={`${key}.${subKey}`} value={subValue} />
                    ))
              )}
            </div>
          </div>
        ))}
      </Section>
    </div>
  ),
};

const CANONICAL_ROLES: Array<keyof ColorScale> = [
  'bg',
  'bgSubtle',
  'bgElement',
  'bgElementHover',
  'bgElementActive',
  'borderSubtle',
  'border',
  'borderHover',
  'solid',
  'solidHover',
  'text',
  'textContrast',
];

function ScaleRow({ scale, themeMode }: { scale: ColorScale; themeMode: 'light' | 'dark' }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 4 }}>
      {CANONICAL_ROLES.map((role, idx) => {
        const value = scale[role];
        return (
          <div key={role} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div
              style={{
                width: '100%',
                aspectRatio: '1 / 1',
                background: value,
                borderRadius: 6,
                border: themeMode === 'light' ? '1px solid rgba(0,0,0,0.08)' : '1px solid rgba(255,255,255,0.12)',
              }}
              title={value}
            />
            <span style={{ fontSize: 10, color: '#666', fontWeight: 600 }}>{idx + 1}</span>
            <span style={{ fontSize: 9, color: '#888', textAlign: 'center', wordBreak: 'break-word' }}>{role}</span>
            <span style={{ fontSize: 9, color: '#aaa' }}>{value}</span>
          </div>
        );
      })}
    </div>
  );
}

function ContrastBadge({ ratio, target, label }: { ratio: number; target: number; label: string }) {
  const passes = ratio >= target;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '2px 6px',
        borderRadius: 4,
        background: passes ? '#e6f4ea' : '#fde7e7',
        color: passes ? '#137333' : '#8a1f11',
        fontSize: 11,
        fontWeight: 500,
      }}
    >
      {label}: {ratio.toFixed(2)}:1 {passes ? '✓' : '✗'}
    </span>
  );
}

function ContrastRow({ scale }: { scale: ColorScale }) {
  const pairs = [
    { fg: scale.text, bg: scale.bg, target: 4.5, label: 'text/bg AA' },
    { fg: scale.textContrast, bg: scale.bg, target: 7, label: 'textContrast/bg AAA' },
    { fg: scale.border, bg: scale.bg, target: 3, label: 'border/bg AA' },
  ];
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
      {pairs.map((p) => (
        <ContrastBadge
          key={p.label}
          ratio={contrastRatio(p.fg, p.bg)}
          target={p.target}
          label={p.label}
        />
      ))}
    </div>
  );
}

function FamilyBlock({
  title,
  light,
  dark,
}: {
  title: string;
  light: ColorScale;
  dark: ColorScale;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, textTransform: 'capitalize' }}>{title}</p>
      <div style={{ marginBottom: 12 }}>
        <p style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>light</p>
        <ScaleRow scale={light} themeMode="light" />
        <ContrastRow scale={light} />
      </div>
      <div style={{ background: '#1f1f1f', padding: 12, borderRadius: 6 }}>
        <p style={{ fontSize: 11, color: '#aaa', marginBottom: 6 }}>dark</p>
        <ScaleRow scale={dark} themeMode="dark" />
        <ContrastRow scale={dark} />
      </div>
    </div>
  );
}

export const ColorScales12Roles: Story = {
  name: 'Color Scales · 12 papéis (RFC-0039)',
  render: () => (
    <div>
      <Section title="Famílias themable — 12 papéis canônicos">
        <p style={{ fontSize: 12, color: '#666', marginBottom: 24 }}>
          Cada família themable expõe 12 steps (numérico + alias nominal Radix-style).
          Light/dark mapeiam intensidades distintas — em dark, `solid` desce uma intensidade
          para preservar legibilidade sobre fundo escuro. Os badges abaixo de cada escala
          mostram contraste WCAG calculado nos pares canônicos.
        </p>
        <FamilyBlock title="brand" light={themeLightColors.brand} dark={themeDarkColors.brand} />
        <FamilyBlock title="gray" light={themeLightColors.gray} dark={themeDarkColors.gray} />
        <FamilyBlock
          title="feedback.info"
          light={themeLightColors.feedback.info}
          dark={themeDarkColors.feedback.info}
        />
        <FamilyBlock
          title="feedback.success"
          light={themeLightColors.feedback.success}
          dark={themeDarkColors.feedback.success}
        />
        <FamilyBlock
          title="feedback.warning"
          light={themeLightColors.feedback.warning}
          dark={themeDarkColors.feedback.warning}
        />
        <FamilyBlock
          title="feedback.critical"
          light={themeLightColors.feedback.critical}
          dark={themeDarkColors.feedback.critical}
        />
      </Section>
    </div>
  ),
};

export const Spacing: Story = {
  name: 'Spacing Scale',
  render: () => (
    <Section title="Escala de Espaçamento">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {Object.entries(spacing).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 12, color: '#666', width: 40, textAlign: 'right' }}>{key}px</span>
            <div style={{ width: value, height: 20, background: '#4a90e2', borderRadius: 2, minWidth: 2 }} />
            <span style={{ fontSize: 12, color: '#999' }}>{value}px</span>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const Typography: Story = {
  name: 'Typography Scale',
  render: () => (
    <Section title="Escala Tipográfica">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {Object.entries(fontSize).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'baseline', gap: 16, borderBottom: '1px solid #f0f0f0', paddingBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#666', width: 60 }}>fontSize.{key}</span>
            <span style={{ fontSize: value, lineHeight: 1.2 }}>Arbor Design System</span>
            <span style={{ fontSize: 11, color: '#999' }}>{value}px</span>
          </div>
        ))}
      </div>
    </Section>
  ),
};

export const BorderRadius: Story = {
  name: 'Border Radius Scale',
  render: () => (
    <Section title="Escala de Border Radius">
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        {Object.entries(borderRadius).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 64,
                height: 64,
                background: '#4a90e2',
                borderRadius: value === 1000 ? '50%' : value,
              }}
            />
            <span style={{ fontSize: 11, color: '#666' }}>{key}px</span>
          </div>
        ))}
      </div>
    </Section>
  ),
};
