import { render, screen } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../../foundations';
import { ArborProvider } from '../../../../ecosystem/styled-system';
import { Box } from './box';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

describe('Box', () => {
  it('renders children', () => {
    render(
      <Box testID="test-box">
        <Box testID="inner">Content</Box>
      </Box>,
      { wrapper: Wrapper },
    );
    expect(screen.getByTestId('inner')).toBeTruthy();
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('forwards testID', () => {
    render(<Box testID="box-id">Hello</Box>, { wrapper: Wrapper });
    expect(screen.getByTestId('box-id')).toBeTruthy();
  });
});
