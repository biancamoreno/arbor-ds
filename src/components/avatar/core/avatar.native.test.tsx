import React from 'react';
import { act, render, screen } from '@testing-library/react-native';
import { Avatar, AvatarGroup } from './avatar';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { createTheme, themeLight } from '../../../foundations';
import { Text } from '../../core/text';

const theme = createTheme(themeLight, {});

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={theme}>{children}</ArborProvider>
);

describe('Avatar (native)', () => {
  it('renderiza Avatar.Root com Fallback', () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback><Text>AB</Text></Avatar.Fallback>
      </Avatar.Root>,
      { wrapper },
    );
    expect(screen.getByText('AB')).toBeTruthy();
  });

  it('Avatar.Image consome <Image> do DS (alt vira accessibilityLabel)', () => {
    render(
      <Avatar.Root>
        <Avatar.Image src="https://example.com/u.jpg" alt="Usuário" />
      </Avatar.Root>,
      { wrapper },
    );
    expect(screen.getByLabelText('Usuário')).toBeTruthy();
  });

  it('Fallback respeita delayMs', () => {
    jest.useFakeTimers();
    render(
      <Avatar.Root>
        <Avatar.Fallback delayMs={120}><Text>YZ</Text></Avatar.Fallback>
      </Avatar.Root>,
      { wrapper },
    );
    expect(screen.queryByText('YZ')).toBeNull();
    act(() => { jest.advanceTimersByTime(120); });
    expect(screen.getByText('YZ')).toBeTruthy();
    jest.useRealTimers();
  });

  it('aceita SP-1 sizes sem crash', () => {
    const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(
        <Avatar.Root size={size}>
          <Avatar.Fallback><Text>{size[0].toUpperCase()}</Text></Avatar.Fallback>
        </Avatar.Root>,
        { wrapper },
      );
      unmount();
    });
  });
});

describe('AvatarGroup (native)', () => {
  const makeAvatar = (label: string) => (
    <Avatar.Root key={label}>
      <Avatar.Fallback><Text>{label}</Text></Avatar.Fallback>
    </Avatar.Root>
  );

  it('renderiza avatares e contador de overflow', () => {
    render(
      <AvatarGroup max={2}>{[makeAvatar('A'), makeAvatar('B'), makeAvatar('C')]}</AvatarGroup>,
      { wrapper },
    );
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('+1')).toBeTruthy();
  });

  it('sem max renderiza todos', () => {
    render(
      <AvatarGroup>{[makeAvatar('A'), makeAvatar('B')]}</AvatarGroup>,
      { wrapper },
    );
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
  });
});
