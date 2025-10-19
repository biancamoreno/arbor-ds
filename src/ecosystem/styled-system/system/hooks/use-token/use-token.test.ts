import { useTheme } from '../../../adapters';
import { useToken } from './use-token';

jest.mock('../../adapters', () => ({
  useTheme: jest.fn(),
}));

describe('useToken', () => {
  let theme;

  beforeEach(() => {
    theme = {
      colors: {
        primary: '#ff0000',
        secondary: '#00ff00',
      },
    };
    (useTheme as jest.Mock).mockReturnValue(theme);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return token value from theme', () => {
    const tokenValue = useToken('colors', 'primary');

    expect(tokenValue).toBe('#ff0000');
    expect(useTheme).toHaveBeenCalled();
  });

  it('should return token value from theme when token is an array', () => {
    const tokenValue = useToken('colors', ['primary']);

    expect(tokenValue).toEqual(['#ff0000']);
    expect(useTheme).toHaveBeenCalled();
  });

  it('should return undefined if token value is not found in theme', () => {
    const tokenValue = useToken('colors', 'background');

    expect(tokenValue).toBeUndefined();
    expect(useTheme).toHaveBeenCalled();
  });

  it('should return undefined if token value is empty', () => {
    const tokenValue = useToken('colors', '');

    expect(tokenValue).toBeUndefined();
    expect(useTheme).toHaveBeenCalled();
  });

  it('should return resolved token value for an array of tokens', () => {
    const tokenValue = useToken('colors', ['primary', 'secondary']);

    expect(tokenValue).toEqual(['#ff0000', '#00ff00']);
    expect(useTheme).toHaveBeenCalled();
  });

  it('should return undefined if tokenValue is null', () => {
    const tokenValue = useToken<any>('colors', null);

    expect(tokenValue).toBeNull();
    expect(useTheme).toHaveBeenCalled();
  });
});
