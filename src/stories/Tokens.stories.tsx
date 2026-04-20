import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { color } from '../foundations/tokens/primitives/color';
import { spacing } from '../foundations/tokens/primitives/spacing';
import { fontSize } from '../foundations/tokens/primitives/typography/font-size';
import { borderRadius } from '../foundations/tokens/primitives/borders/border-radius';
import { themeLightColors } from '../foundations/tokens/semantics/color/themeLightColors';

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
