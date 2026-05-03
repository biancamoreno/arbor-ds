import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarGroup } from './avatar';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Avatar', () => {
  it('renderiza Avatar.Root', () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>AB</Avatar.Fallback>
      </Avatar.Root>,
      { wrapper }
    );
    expect(screen.getByText('AB')).toBeTruthy();
  });

  it('renderiza Avatar.Image com alt', () => {
    render(
      <Avatar.Root>
        <Avatar.Image src="img.jpg" alt="Usuário" />
      </Avatar.Root>,
      { wrapper }
    );
    expect(screen.getByAltText('Usuário')).toBeTruthy();
  });

  it('Fallback visível quando status é idle', () => {
    render(
      <Avatar.Root>
        <Avatar.Fallback>MR</Avatar.Fallback>
      </Avatar.Root>,
      { wrapper }
    );
    expect(screen.getByText('MR')).toBeTruthy();
  });

  it('aceita size xsmall — 24px', () => {
    const { container } = render(
      <Avatar.Root size="xsmall"><Avatar.Fallback>X</Avatar.Fallback></Avatar.Root>,
      { wrapper }
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.width).toBe('24px');
    expect(root.style.height).toBe('24px');
  });

  it('aceita size xlarge — 64px', () => {
    const { container } = render(
      <Avatar.Root size="xlarge"><Avatar.Fallback>X</Avatar.Fallback></Avatar.Root>,
      { wrapper }
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.width).toBe('64px');
    expect(root.style.height).toBe('64px');
  });

  it('aceita size medium — 40px (default)', () => {
    const { container } = render(
      <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>,
      { wrapper }
    );
    const root = container.firstChild as HTMLElement;
    expect(root.style.width).toBe('40px');
  });

  it('é um <span>', () => {
    const { container } = render(
      <Avatar.Root><Avatar.Fallback>AB</Avatar.Fallback></Avatar.Root>,
      { wrapper }
    );
    expect(container.firstChild?.nodeName).toBe('SPAN');
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
});
