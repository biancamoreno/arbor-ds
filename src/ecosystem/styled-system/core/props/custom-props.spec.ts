import { createCustomProps } from './custom-props';
import { type CustomPropsConfig } from './types';

test('should return a function', () => {
  const customProps = createCustomProps({});

  expect(typeof customProps).toBe('function');
});

test('should return a function that takes an object', () => {
  const customProps = createCustomProps({});

  expect(typeof customProps({})).toBe('object');
});

test('should return a function that takes an object pre config', () => {
  const config = {
    bgColor: { property: 'backgroundColor', scale: 'colors' },
    textColor: { property: 'color', scale: 'colors' },
  } as CustomPropsConfig;
  const customProps = createCustomProps(config);
  const result = customProps({ bgColor: 'tomato', textColor: 'white' });

  expect(result).toEqual({
    backgroundColor: 'tomato',
    color: 'white',
  });
});

test('should transform to properties correctly', () => {
  const config = {
    margin: { property: 'margin', transform: value => `${value}px` },
    padding: { property: 'padding', transform: value => `${value}px` },
  } as CustomPropsConfig;
  const customProps = createCustomProps(config);
  const result = customProps({ margin: 10, padding: 20 });

  expect(result).toEqual({
    margin: '10px',
    padding: '20px',
  });
});
