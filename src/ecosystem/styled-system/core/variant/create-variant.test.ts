import { createVariant } from './create-variant';

describe('createVariant', () => {
  const variants = {
    primary: {
      color: 'white',
      backgroundColor: 'tomato',
    },
    secondary: {
      color: 'white',
      backgroundColor: 'tomato',
      padding: '24px',
    },
  } as any;

  it('should return object correctly when variant is a string', () => {
    const variant = 'primary';
    const props = { padding: '20px' };

    const result = createVariant(variant, props, variants);

    expect(result).toEqual({
      color: 'white',
      backgroundColor: 'tomato',
      padding: '20px',
    });
  });

  it('should return an empty object when variant is not found in variants', () => {
    const variant = 'tertiary';
    const props = {};

    const result = createVariant(variant, props, variants);

    expect(result).toEqual({});
  });

  it('should return object correctly when variant is an object', () => {
    const variant = { sm: 'small', lg: 'large' };
    const props = {};
    const variants = {
      small: {
        fontSize: '10px',
        lineHeight: '12px',
      },
      large: {
        fontSize: '16px',
        lineHeight: '18px',
      },
    };

    const result = createVariant(variant, props, variants);

    expect(result).toEqual({
      fontSize: { sm: '10px', lg: '16px' },
      lineHeight: { sm: '12px', lg: '18px' },
    });
  });
});
