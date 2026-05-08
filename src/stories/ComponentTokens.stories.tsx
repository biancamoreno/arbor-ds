import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { themeLight } from '../foundations';

const meta = {
  title: 'Foundations/Component Tokens',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj;

type Leaves = Array<{ path: string; value: string | number }>;

function flatten(node: unknown, prefix: string[] = []): Leaves {
  const out: Leaves = [];
  if (node == null) return out;
  if (typeof node === 'string' || typeof node === 'number') {
    out.push({ path: prefix.join('.'), value: node });
    return out;
  }
  if (typeof node !== 'object' || Array.isArray(node)) return out;
  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    out.push(...flatten(child, [...prefix, key]));
  }
  return out;
}

const wrapper: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 32 };
const headingStyle: React.CSSProperties = { fontSize: 20, fontWeight: 700, marginBottom: 8 };
const subheadingStyle: React.CSSProperties = { fontSize: 14, color: '#666', marginBottom: 12 };
const cardStyle: React.CSSProperties = {
  border: '1px solid #eee',
  borderRadius: 8,
  padding: 16,
  background: '#fff',
};
const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 12 };
const cellPath: React.CSSProperties = { padding: '6px 8px', borderBottom: '1px solid #f5f5f5', fontFamily: 'monospace', color: '#333' };
const cellValue: React.CSSProperties = { padding: '6px 8px', borderBottom: '1px solid #f5f5f5', fontFamily: 'monospace', color: '#0066CC' };

function ComponentBlock({ name, tokens }: { name: string; tokens: unknown }) {
  const leaves = React.useMemo(() => flatten(tokens), [tokens]);
  return (
    <section style={cardStyle}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, textTransform: 'capitalize' }}>{name}</h3>
      <p style={subheadingStyle}>
        {leaves.length} chaves themable. Override via <code>{`createTheme(themeLight, { components: { ${name}: { ... } } })`}</code>.
      </p>
      <table style={tableStyle}>
        <tbody>
          {leaves.map(({ path, value }) => (
            <tr key={path}>
              <td style={cellPath}>{path}</td>
              <td style={cellValue}>{String(value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export const Index: Story = {
  render: () => {
    const components = themeLight.components as Record<string, unknown>;
    const names = Object.keys(components).sort();
    return (
      <div style={wrapper}>
        <header>
          <h1 style={headingStyle}>Component Tokens</h1>
          <p style={subheadingStyle}>
            Camada 4 da cascade de tematização (RFC-0040). Cada chave aqui é um alias por string para
            um token semantic — override em <code>createTheme()</code> propaga para todas as recipes
            que consomem essa chave.
          </p>
        </header>
        {names.map(name => (
          <ComponentBlock key={name} name={name} tokens={components[name]} />
        ))}
      </div>
    );
  },
};
