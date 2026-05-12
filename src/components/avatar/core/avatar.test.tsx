import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { Avatar, AvatarGroup } from './avatar';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Avatar', () => {
  it('renderiza Avatar.Root com Fallback', () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>,
      { wrapper }
    );
    expect(screen.getByText('AB')).toBeTruthy();
  });

  it('renderiza Avatar.Image (consumindo Image do DS) com alt', () => {
    render(
      <Avatar.Root>
        <Avatar.Image src="img.jpg" alt="Usuário" />
      </Avatar.Root>,
      { wrapper }
    );
    expect(screen.getByAltText('Usuário')).toBeTruthy();
  });

  it('Fallback visível quando status é idle (sem delay)', () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>MR</Avatar.Fallback>
      </Avatar.Root>,
      { wrapper }
    );
    expect(screen.getByText('MR')).toBeTruthy();
  });

  it('Fallback respeita delayMs antes de aparecer', () => {
    jest.useFakeTimers();
    render(
      <Avatar.Root>
        <Avatar.Fallback delayMs={100}>YZ</Avatar.Fallback>
      </Avatar.Root>,
      { wrapper }
    );
    expect(screen.queryByText('YZ')).toBeNull();
    act(() => { jest.advanceTimersByTime(100); });
    expect(screen.getByText('YZ')).toBeTruthy();
    jest.useRealTimers();
  });

  it('Root é um <span>', () => {
    const { container } = render(
      <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>,
      { wrapper }
    );
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });

  it('aceita todos os tamanhos SP-1 sem crash', () => {
    const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(
        <Avatar.Root size={size}><Avatar.Fallback>{size[0].toUpperCase()}</Avatar.Fallback></Avatar.Root>,
        { wrapper },
      );
      unmount();
    });
  });

  it('shape="square" usa borderRadius=small (não full)', () => {
    const { container } = render(
      <Avatar.Root shape="square"><Avatar.Fallback>S</Avatar.Fallback></Avatar.Root>,
      { wrapper },
    );
    expect(container.firstChild?.nodeName).toBe('SPAN');
    expect(screen.getByText('S')).toBeTruthy();
  });
});

describe('Avatar flat API (src/alt/fallback props)', () => {
  it('renderiza Image + Fallback automaticamente via props', () => {
    render(<Avatar src="img.jpg" alt="Usuário" fallback="US" />, { wrapper });
    expect(screen.getByAltText('Usuário')).toBeTruthy();
    expect(screen.getByText('US')).toBeTruthy();
  });

  it('renderiza só Fallback quando src é undefined', () => {
    render(<Avatar fallback="JD" />, { wrapper });
    expect(screen.getByText('JD')).toBeTruthy();
  });

  it('compound API continua disponível quando todas as props planas são undefined', () => {
    render(
      <Avatar>
        <Avatar.Fallback>CP</Avatar.Fallback>
      </Avatar>,
      { wrapper },
    );
    expect(screen.getByText('CP')).toBeTruthy();
  });
});

describe('AvatarGroup', () => {
  const makeAvatar = (label: string) => (
    <Avatar.Root key={label}>
      <Avatar.Fallback>{label}</Avatar.Fallback>
    </Avatar.Root>
  );

  it('renderiza todos os avatares sem max', () => {
    render(
      <AvatarGroup>{[makeAvatar('A'), makeAvatar('B'), makeAvatar('C')]}</AvatarGroup>,
      { wrapper }
    );
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByText('C')).toBeTruthy();
  });

  it('exibe contador de overflow quando max é menor que total', () => {
    render(
      <AvatarGroup max={2}>{[makeAvatar('A'), makeAvatar('B'), makeAvatar('C')]}</AvatarGroup>,
      { wrapper }
    );
    expect(screen.getByText('+1')).toBeTruthy();
  });

  it('não exibe overflow quando max >= total', () => {
    render(
      <AvatarGroup max={5}>{[makeAvatar('A'), makeAvatar('B')]}</AvatarGroup>,
      { wrapper }
    );
    expect(screen.queryByText(/\+/)).toBeNull();
  });

  it('aceita todos os tamanhos SP-1 sem crash', () => {
    const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
    sizes.forEach((size) => {
      const { unmount } = render(
        <AvatarGroup size={size} max={1}>{[makeAvatar('A'), makeAvatar('B')]}</AvatarGroup>,
        { wrapper },
      );
      unmount();
    });
  });
});
