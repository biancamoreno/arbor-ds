import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../components/button';

const meta = {
  title: 'Foundations/CSS Vars',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const wrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 24 };
const cardStyle: React.CSSProperties = {
  border: '1px solid #eee',
  borderRadius: 8,
  padding: 16,
  background: '#fff',
};
const codeBlock: React.CSSProperties = {
  background: '#0b1020',
  color: '#d6deeb',
  padding: 12,
  borderRadius: 6,
  fontFamily: 'monospace',
  fontSize: 12,
  whiteSpace: 'pre',
  overflow: 'auto',
};

const subtreeStyle: React.CSSProperties & Record<string, string> = {
  ['--arbor-color-brand-9']: '#FF3366',
  ['--arbor-color-focus-ring']: '#FF3366',
};

const buttonOverrideStyle: React.CSSProperties & Record<string, string> = {
  ['--arbor-button-colors-primary-bg']: 'var(--arbor-color-brand-9)',
};

export const Overview: Story = {
  render: () => (
    <div style={wrapper}>
      <header>
        <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>CSS Vars</h1>
        <p style={{ fontSize: 14, color: '#666' }}>
          O <code>ArborProvider</code> emite todas as folhas do tema como CSS custom properties no
          <code> :root</code> (web only). Subtrees podem redeclarar essas vars sem rebuild.
        </p>
      </header>

      <section style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Override por subtree</h3>
        <p style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
          O bloco abaixo redefine <code>--arbor-color-brand-9</code> e <code>--arbor-color-focus-ring</code>
          localmente. Como o foco visível do DS já consome <code>--arbor-color-focus-ring</code>, o anel
          muda automaticamente. Para também trocar a cor do Button, redeclaramos
          <code> --arbor-button-colors-primary-bg</code>.
        </p>
        <pre style={codeBlock}>{`<div style={{
  '--arbor-color-brand-9': '#FF3366',
  '--arbor-color-focus-ring': '#FF3366',
  '--arbor-button-colors-primary-bg': 'var(--arbor-color-brand-9)',
}}>
  <Button>Subtree branding</Button>
</div>`}</pre>
        <div style={{ ...subtreeStyle, padding: 16, marginTop: 12, border: '1px dashed #ccc', borderRadius: 6 }}>
          <div style={buttonOverrideStyle}>
            <Button>Subtree branding</Button>
          </div>
        </div>
      </section>

      <section style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Convenção de nomenclatura</h3>
        <ul style={{ fontSize: 13, lineHeight: 1.7 }}>
          <li><code>--arbor-color-*</code> — escala semântica de cores (<code>brand</code>, <code>gray</code>, <code>feedback.*</code>, <code>surface</code>, etc.)</li>
          <li><code>--arbor-radii-*</code>, <code>--arbor-space-*</code>, <code>--arbor-sizes-*</code>, <code>--arbor-shadows-*</code> — escalas de fundação</li>
          <li><code>--arbor-motion-duration-*</code>, <code>--arbor-motion-easing-*</code> — motion</li>
          <li><code>--arbor-{`{component}`}-*</code> — component tokens (cada componente sob seu prefixo)</li>
        </ul>
        <p style={{ fontSize: 13, color: '#666', marginTop: 12 }}>
          camelCase de paths é convertido para kebab-case (<code>bgElement</code> →
          <code> --arbor-color-brand-bg-element</code>).
        </p>
      </section>

      <section style={cardStyle}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Limites de plataforma</h3>
        <p style={{ fontSize: 13, color: '#555' }}>
          CSS vars são escape hatch <strong>web-only</strong>. React Native não consome custom properties.
          Para paridade rigorosa entre web e native, use somente <code>createTheme()</code>.
        </p>
      </section>
    </div>
  ),
};
