import { Flex, Text } from '../../core';
import { ProgressBar } from '../../progress-bar';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { NavBarProps } from '../interfaces/NavBarProps';

/**
 * @platform shared
 *
 * Top app bar — barra superior de navegação. Slots `start` (botões à
 * esquerda, ex.: voltar/menu), `center` ou `title` (conteúdo central) e
 * `end` (ações à direita). `elevated` adiciona `boxShadow`; `blurred` aplica
 * `backdropFilter` (web). `progress` (0-100) renderiza um `ProgressBar` na
 * parte inferior — útil para indicar carregamento de página.
 *
 * @see {@link NavBarProps}
 */
export function NavBar({
  start,
  end,
  title,
  progress,
  progressLabel,
  progressTone = 'brand',
  center,
  blurred = false,
  elevated = false,
  safeAreaTop = true,
  'aria-label': ariaLabel,
}: NavBarProps) {
  const theme = useTheme();

  const centerContent = (() => {
    if (center !== undefined) return center;
    if (progress !== undefined) {
      return (
        <ProgressBar
          progress={progress}
          label={progressLabel}
          tone={progressTone}
          size="sm"
          style={{ width: '100%' }}
        />
      );
    }
    if (title) {
      return (
        <Text
          as="span"
          fontSize="medium"
          fontWeight="semibold"
          color="text.primary"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
          style={{ overflow: 'hidden' }}
        >
          {title}
        </Text>
      );
    }
    return null;
  })();

  return (
    <Flex
      as="header"
      aria-label={ariaLabel}
      alignItems="center"
      zIndex="navBar"
      minHeight={56}
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderBottomColor="border.subtle"
      boxShadow={elevated ? 'sm' : undefined}
      style={{
        position: 'sticky',
        top: 0,
        gap: 8,
        paddingInline: 8,
        paddingTop: safeAreaTop ? 'env(safe-area-inset-top, 0px)' : 0,
        backgroundColor: blurred ? theme.colors.surface.translucent : theme.colors.background.default,
        backdropFilter: blurred ? 'blur(20px)' : undefined,
        WebkitBackdropFilter: blurred ? 'blur(20px)' : undefined,
        boxSizing: 'border-box',
      }}
    >
      <Flex alignItems="center" flexShrink={0} minWidth={40}>
        {start}
      </Flex>
      <Flex flex={1} alignItems="center" justifyContent="center" overflow="hidden" minWidth={0}>
        {centerContent}
      </Flex>
      <Flex alignItems="center" flexShrink={0} justifyContent="flex-end" minWidth={40}>
        {end}
      </Flex>
    </Flex>
  );
}
