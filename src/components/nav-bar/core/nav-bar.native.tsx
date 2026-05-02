import { Platform } from 'react-native';
import { Flex, Text } from '../../core';
import type { NavBarProps } from '../interfaces/NavBarProps';

function getSafeAreaTop(): number {
  if (Platform.OS === 'ios') return 44;
  if (Platform.OS === 'android') return 24;
  return 0;
}

/**
 * @platform native
 *
 * `NavBar` em React Native — top app bar com padding-top derivado da safe
 * area por plataforma (`44` em iOS, `24` em Android). Sem `backdropFilter`
 * (RN não suporta) — `blurred` é no-op aqui. Mesmos slots do equivalente
 * web (`start`/`center`/`title`/`end`).
 *
 * @see {@link NavBarProps}
 */
export function NavBar({
  start,
  end,
  title,
  center,
  safeAreaTop = true,
}: NavBarProps) {
  const topInset = safeAreaTop ? getSafeAreaTop() : 0;

  const titleContent = center ?? (
    title ? (
      <Text
        as="span"
        numberOfLines={1}
        fontSize="md"
        fontWeight="semibold"
        color="text.primary"
      >
        {title}
      </Text>
    ) : null
  );

  return (
    <Flex
      as="header"
      alignItems="center"
      minHeight={56}
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderBottomColor="border.subtle"
      backgroundColor="surface.default"
      style={{
        paddingTop: topInset,
        paddingHorizontal: 8,
        gap: 8,
      }}
    >
      <Flex alignItems="center" minWidth={40} justifyContent="flex-start">
        {start}
      </Flex>
      <Flex flex={1} alignItems="center" justifyContent="center" overflow="hidden">
        {titleContent}
      </Flex>
      <Flex alignItems="center" minWidth={40} justifyContent="flex-end">
        {end}
      </Flex>
    </Flex>
  );
}
