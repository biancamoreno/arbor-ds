import { useState, useCallback } from 'react';
import { Icon } from './icon';
import { iconMap } from '../internal';
import { Box } from '../../box';
import { Flex } from '../../flex';
import { Text } from '../../text';
import { Clickable } from '../../clickable';
import type { IconName } from '../internal';

const ALL_NAMES = Object.keys(iconMap) as IconName[];

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
    <Box fontFamily="sans-serif" padding="large">
      <Flex alignItems="center" gap="tiny" marginBottom="medium">
        <Box
          as="input"
          type="text"
          placeholder="Buscar ícone..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          padding="micro"
          paddingX="tiny"
          borderWidth="hairline"
          borderStyle="solid"
          borderColor="border.default"
          borderRadius="micro"
          fontSize="sm"
          width={280}
          style={{ outline: 'none' }}
        />
        <Text as="span" fontSize="xs" color="text.secondary">
          {filtered.length} de {ALL_NAMES.length} ícones
        </Text>
      </Flex>

      <Box
        display="grid"
        gap="nano"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))' }}
      >
        {filtered.map((name) => (
          <Clickable
            key={name}
            title={`Copiar <Icon name="${name}" />`}
            onClick={() => handleCopy(name)}
            flexDirection="column"
            alignItems="center"
            gap="nano"
            padding="micro"
            paddingX="micro"
            borderRadius="micro"
            backgroundColor={copied === name ? 'feedback.success.subtle' : 'transparent'}
          >
            <Icon name={name} size={size} color={color} strokeWidth={strokeWidth} decorative />
            <Text
              as="span"
              fontSize="xsmall"
              color="text.secondary"
              textAlign="center"
              lineHeight={1.3}
              style={{ wordBreak: 'break-all' }}
            >
              {copied === name ? '✓ copiado' : toKebab(name)}
            </Text>
          </Clickable>
        ))}
      </Box>
    </Box>
  );
}
