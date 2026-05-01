import React from 'react';
import { Pressable, Text as RNText } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';
import { FileUpload } from './file-upload.native';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('FileUpload (native)', () => {
  it('renders default placeholder with descriptive accessibility label', () => {
    render(<FileUpload />, { wrapper });
    expect(
      screen.getByLabelText(/Upload de arquivos requer integração nativa/i),
    ).toBeTruthy();
  });

  it('shows the same default copy in the visible text', () => {
    render(<FileUpload />, { wrapper });
    expect(
      screen.getByText(/Upload de arquivos requer integração nativa/i),
    ).toBeTruthy();
  });

  it('respects texts.dropZone override', () => {
    render(<FileUpload texts={{ dropZone: 'Pick a file via Expo' }} />, { wrapper });
    expect(screen.getByText('Pick a file via Expo')).toBeTruthy();
    expect(screen.getByLabelText('Pick a file via Expo')).toBeTruthy();
    expect(
      screen.queryByText(/Upload de arquivos requer integração nativa/i),
    ).toBeNull();
  });

  it('renders custom children inside the drop zone, replacing default content', () => {
    render(
      <FileUpload>
        <RNText testID="slot">custom integration</RNText>
      </FileUpload>,
      { wrapper },
    );
    expect(screen.getByTestId('slot')).toBeTruthy();
    expect(
      screen.queryByText(/Upload de arquivos requer integração nativa/i),
    ).toBeNull();
  });

  it('does NOT render any Pressable in the default placeholder (no picker capture)', () => {
    render(<FileUpload />, { wrapper });
    expect(screen.UNSAFE_queryAllByType(Pressable)).toHaveLength(0);
  });

  it('renders loading copy when loading=true', () => {
    render(<FileUpload loading texts={{ uploading: 'Subindo arquivo' }} />, { wrapper });
    expect(screen.getByText('Subindo arquivo')).toBeTruthy();
  });

  it('renders preview block when previewUrl is provided', () => {
    render(
      <FileUpload
        previewUrl="https://example.com/x.png"
        onRemove={jest.fn()}
        texts={{ previewLabel: 'Arquivo enviado', removeLabel: 'Remover' }}
      />,
      { wrapper },
    );
    expect(screen.getByText('Arquivo enviado')).toBeTruthy();
    expect(screen.getByLabelText('Remover')).toBeTruthy();
  });

  it('calls onRemove when the Remove button is pressed in preview mode', () => {
    const onRemove = jest.fn();
    render(
      <FileUpload previewUrl="https://example.com/x.png" onRemove={onRemove} />,
      { wrapper },
    );
    fireEvent.press(screen.getByLabelText('Remover'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});
