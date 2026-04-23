import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavBar } from './nav-bar';
import { IconButton } from '../../button';
import { Icon } from '../../core';

const meta = {
  title: 'Components/NavBar',
  component: NavBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    title: { control: 'text' },
    progress: { control: { type: 'range', min: 0, max: 100, step: 1 } },
    progressTone: {
      control: { type: 'select' },
      options: ['brand', 'success', 'warning', 'critical'],
    },
    blurred: { control: 'boolean' },
    elevated: { control: 'boolean' },
    safeAreaTop: { control: 'boolean' },
  },
} satisfies Meta<typeof NavBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const pageStyle = {
  background: '#f9fafb',
  minHeight: '100vh',
};

const contentStyle = {
  padding: '24px 16px',
};

export const WithTitle: Story = {
  render: () => (
    <div style={pageStyle}>
      <NavBar
        title="Detalhes do produto"
        start={
          <IconButton aria-label="Voltar" variant="ghost" size="sm">
            <Icon name="ArrowLeft" size={20} decorative />
          </IconButton>
        }
        end={
          <IconButton aria-label="Mais opções" variant="ghost" size="sm">
            <Icon name="EllipsisVertical" size={20} decorative />
          </IconButton>
        }
      />
      <div style={contentStyle}>
        <h2 style={{ margin: 0, fontSize: 18, color: '#111' }}>Conteúdo da página</h2>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Lorem ipsum dolor sit amet</p>
      </div>
    </div>
  ),
};

export const WithProgress: Story = {
  render: () => {
    function ProgressStory() {
      const [step, setStep] = useState(1);
      const totalSteps = 4;
      const progress = (step / totalSteps) * 100;

      return (
        <div style={pageStyle}>
          <NavBar
            progress={progress}
            progressLabel={`Etapa ${step} de ${totalSteps}`}
            start={
              step > 1 ? (
                <IconButton
                  aria-label="Etapa anterior"
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep((s) => s - 1)}
                >
                  <Icon name="ArrowLeft" size={20} decorative />
                </IconButton>
              ) : (
                <IconButton aria-label="Fechar" variant="ghost" size="sm">
                  <Icon name="X" size={20} decorative />
                </IconButton>
              )
            }
          />
          <div style={contentStyle}>
            <h2 style={{ margin: 0, fontSize: 18, color: '#111' }}>Etapa {step}</h2>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Preencha os dados desta etapa.</p>
            {step < totalSteps && (
              <button onClick={() => setStep((s) => s + 1)} style={{ marginTop: 12 }}>
                Próxima etapa →
              </button>
            )}
          </div>
        </div>
      );
    }
    return <ProgressStory />;
  },
};

export const StartOnly: Story = {
  render: () => (
    <div style={pageStyle}>
      <NavBar
        title="Carrinho"
        start={
          <IconButton aria-label="Voltar" variant="ghost" size="sm">
            <Icon name="ArrowLeft" size={20} decorative />
          </IconButton>
        }
      />
      <div style={contentStyle}>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Apenas slot start + título</p>
      </div>
    </div>
  ),
};

export const EndOnly: Story = {
  render: () => (
    <div style={pageStyle}>
      <NavBar
        title="Notificações"
        end={
          <IconButton aria-label="Marcar todas como lidas" variant="ghost" size="sm">
            <Icon name="CheckCheck" size={20} decorative />
          </IconButton>
        }
      />
      <div style={contentStyle}>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Apenas slot end + título</p>
      </div>
    </div>
  ),
};

export const Elevated: Story = {
  render: () => (
    <div style={pageStyle}>
      <NavBar
        title="Com elevação"
        elevated
        start={
          <IconButton aria-label="Voltar" variant="ghost" size="sm">
            <Icon name="ArrowLeft" size={20} decorative />
          </IconButton>
        }
      />
      <div style={contentStyle}>
        <p style={{ color: '#6b7280', fontSize: 14 }}>Elevação visível com box-shadow</p>
      </div>
    </div>
  ),
};

export const Blurred: Story = {
  parameters: { backgrounds: { default: 'gradient' } },
  render: () => (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
      }}
    >
      <NavBar
        title="Glass effect"
        blurred
        start={
          <IconButton aria-label="Voltar" variant="ghost" size="sm">
            <Icon name="ArrowLeft" size={20} decorative />
          </IconButton>
        }
      />
      <div style={{ ...contentStyle, color: '#fff' }}>
        <p style={{ fontSize: 14 }}>Fundo com blur (backdrop-filter)</p>
      </div>
    </div>
  ),
};

export const TitleOnly: Story = {
  args: {
    title: 'Apenas título',
  },
};

export const NoContent: Story = {
  render: () => (
    <div style={pageStyle}>
      <NavBar />
      <div style={contentStyle}>
        <p style={{ color: '#6b7280', fontSize: 14 }}>NavBar vazio — todos os slots opcionais</p>
      </div>
    </div>
  ),
};
