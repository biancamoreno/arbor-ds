import { systemPseudoProps } from './pseudos';

describe('systemPseudoProps', () => {
  it('should return an empty object when there are no pseudo props', () => {
    const pseudoProps = {};
    const result = systemPseudoProps(pseudoProps);

    expect(result).toEqual({});
  });

  it('should return an object with the corresponding styles for valid pseudo props', () => {
    const pseudoProps = {
      _hover: { backgroundColor: 'tomato' },
      _focus: { backgroundColor: 'red' },
    };
    const result = systemPseudoProps(pseudoProps);

    expect(result).toEqual({
      '&:hover, &[data-hover]': { backgroundColor: 'tomato' },
      '&:focus, &[data-focus]': { backgroundColor: 'red' },
    });
  });

  it('should ignore invalid pseudo props', () => {
    const pseudoProps = {
      _unknown: { backgroundColor: 'tomato' },
      _focus: { backgroundColor: 'green' },
    };
    const result = systemPseudoProps(pseudoProps);

    expect(result).toEqual({
      '&:focus, &[data-focus]': { backgroundColor: 'green' },
    });
  });

  it('should return an empty object when there are no values for valid pseudo props', () => {
    const pseudoProps = {
      _hover: '',
      _focus: null,
    };
    const result = systemPseudoProps(pseudoProps);

    expect(result).toEqual({});
  });
});
