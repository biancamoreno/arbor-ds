import React from 'react';
import { render, screen } from '@testing-library/react';
import { Badge } from './badge';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Badge', () => {
  it('renderiza o texto', () => {
    render(<Badge>Novo</Badge>, { wrapper });
    expect(screen.getByText('Novo')).toBeTruthy();
  });

  it('é um <span>', () => {
    render(<Badge>Label</Badge>, { wrapper });
    expect(screen.getByText('Label').tagName).toBe('SPAN');
  });

  it('aceita tone neutral', () => {
    render(<Badge tone="neutral">Neutro</Badge>, { wrapper });
    expect(screen.getByText('Neutro')).toBeTruthy();
  });

  it('aceita tone brand', () => {
    render(<Badge tone="brand">Brand</Badge>, { wrapper });
    expect(screen.getByText('Brand')).toBeTruthy();
  });

  it('aceita tone success', () => {
    render(<Badge tone="success">OK</Badge>, { wrapper });
    expect(screen.getByText('OK')).toBeTruthy();
  });

  it('aceita tone warning', () => {
    render(<Badge tone="warning">Atenção</Badge>, { wrapper });
    expect(screen.getByText('Atenção')).toBeTruthy();
  });

  it('aceita tone critical', () => {
    render(<Badge tone="critical">Erro</Badge>, { wrapper });
    expect(screen.getByText('Erro')).toBeTruthy();
  });

  it('aceita tone info', () => {
    render(<Badge tone="info">Info</Badge>, { wrapper });
    expect(screen.getByText('Info')).toBeTruthy();
  });

  it('aceita variant solid', () => {
    render(<Badge variant="solid">Sólido</Badge>, { wrapper });
    expect(screen.getByText('Sólido')).toBeTruthy();
  });

  it('aceita size small', () => {
    render(<Badge size="small">Small</Badge>, { wrapper });
    expect(screen.getByText('Small')).toBeTruthy();
  });

  it('Badge.Anchor posiciona badge sobre o elemento', () => {
    render(
      <Badge.Anchor badge={<Badge>3</Badge>}>
        <span>Ícone</span>
      </Badge.Anchor>,
      { wrapper }
    );
    expect(screen.getByText('Ícone')).toBeTruthy();
    expect(screen.getByText('3')).toBeTruthy();
  });

  it('passa style extras', () => {
    render(<Badge style={{ opacity: 0.5 }}>X</Badge>, { wrapper });
    expect(screen.getByText('X').style.opacity).toBe('0.5');
  });

  it('expõe displayName em Badge e Badge.Anchor', () => {
    expect(Badge.displayName).toBe('Badge');
    expect(Badge.Anchor.displayName).toBe('Badge.Anchor');
  });
});
