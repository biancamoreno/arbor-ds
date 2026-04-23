import { useState, useCallback } from 'react';
import { icons } from 'lucide-react';
import { Icon } from './icon';
import { Box } from '../../box';
import { Flex } from '../../flex';
import { Text } from '../../text';
import { Clickable } from '../../clickable';
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
    <Box fontFamily="sans-serif" padding="24px">
      <Flex alignItems="center" gap="12px" marginBottom="20px">
        <Box
          as="input"
          type="text"
          placeholder="Buscar ícone..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 6,
            fontSize: 14,
            width: 280,
            outline: 'none',
          }}
        />
        <Text as="span" fontSize={13} color="#6b7280">
          {filtered.length} de {ALL_NAMES.length} ícones
        </Text>
      </Flex>

      <Box
        display="grid"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: 4 }}
      >
        {filtered.map((name) => (
          <Clickable
            key={name}
            title={`Copiar <Icon name="${name}" />`}
            onClick={() => handleCopy(name)}
            flexDirection="column"
            alignItems="center"
            gap="6px"
            padding="12px 8px"
            borderRadius="8px"
            backgroundColor={copied === name ? '#d1fae5' : 'transparent'}
            transition="background 0.15s"
          >
            <Icon name={name} size={size} color={color} strokeWidth={strokeWidth} decorative />
            <Text
              as="span"
              fontSize={10}
              color="#6b7280"
              textAlign="center"
              style={{ lineHeight: 1.3, wordBreak: 'break-all' }}
            >
              {copied === name ? '✓ copiado' : toKebab(name)}
            </Text>
          </Clickable>
        ))}
      </Box>
    </Box>
  );
}
