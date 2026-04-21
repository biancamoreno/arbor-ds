import { useState, useCallback } from 'react';
import { icons } from 'lucide-react';
import { Icon } from './icon';
import type { IconName } from '../interfaces/IconName';

const ALL_NAMES = Object.keys(icons) as IconName[];

function toKebab(name: string): string {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

interface ShowcaseProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function IconShowcase({ size = 20, color = 'currentColor', strokeWidth = 1.75 }: ShowcaseProps) {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = query.trim()
    ? ALL_NAMES.filter((n) => n.toLowerCase().includes(query.toLowerCase()) || toKebab(n).includes(query.toLowerCase()))
    : ALL_NAMES;

  const handleCopy = useCallback((name: IconName) => {
    navigator.clipboard.writeText(`<Icon name="${name}" />`).then(() => {
      setCopied(name);
      setTimeout(() => setCopied(null), 1500);
    });
  }, []);

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', padding: 24 }}>
      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <input
          type="text"
          placeholder="Buscar ícone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14,
            width: 280,
            outline: 'none',
          }}
        />
        <span style={{ fontSize: 13, color: '#6b7280' }}>
          {filtered.length} de {ALL_NAMES.length} ícones
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
          gap: 4,
        }}
      >
        {filtered.map((name) => (
          <button
            key={name}
            title={`Copiar <Icon name="${name}" />`}
            onClick={() => handleCopy(name)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              padding: '12px 8px',
              border: '1px solid transparent',
              borderRadius: 8,
              background: copied === name ? '#d1fae5' : 'transparent',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => {
              if (copied !== name) (e.currentTarget as HTMLElement).style.background = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              if (copied !== name) (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            <Icon name={name} size={size} color={color} strokeWidth={strokeWidth} decorative />
            <span style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', lineHeight: 1.3, wordBreak: 'break-all' }}>
              {copied === name ? '✓ copiado' : toKebab(name)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
