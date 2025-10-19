import { htmlConverter } from './html-converter';

const html = `<span style="color:support.success.a"><b>Hello</b><i>World</i></span>`;

describe('html-converter', () => {
  it('should pass parent style to children elements', () => {
    const result = htmlConverter(html);
    expect(result).toStrictEqual([
      { as: { native: 'Text', web: 'b' }, children: 'Hello', color: 'support.success.a', fontWeight: 'bold' },
      { as: { native: 'Text', web: 'i' }, children: 'World', color: 'support.success.a', fontStyle: 'italic' },
    ]);
  });

  it('should create break line using tag br', () => {
    const result = htmlConverter('Hello<br/>World');
    expect(result).toStrictEqual([
      { children: 'Hello' },
      {
        children: '\n',
      },
      { children: 'World' },
    ]);
  });

  it('should create underline props using tag "u"', () => {
    const result = htmlConverter('<u>Hello</u>');
    expect(result).toStrictEqual([
      { as: { native: 'Text', web: 'u' }, children: 'Hello', textDecorationLine: 'underline' },
    ]);
  });

  it('should create line-through props using tag "s"', () => {
    const result = htmlConverter('<s>Hello</s>');
    expect(result).toStrictEqual([
      { as: { native: 'Text', web: 's' }, children: 'Hello', textDecorationLine: 'line-through' },
    ]);
  });

  it('should create line-through props using tag "del"', () => {
    const result = htmlConverter('<del>Hello</del>');
    expect(result).toStrictEqual([
      { as: { native: 'Text', web: 'del' }, children: 'Hello', textDecorationLine: 'line-through' },
    ]);
  });

  it('should create italic props using tag "i"', () => {
    const result = htmlConverter('<i>Hello</i>');
    expect(result).toStrictEqual([{ as: { native: 'Text', web: 'i' }, children: 'Hello', fontStyle: 'italic' }]);
  });

  it('should create bold props using tag "b"', () => {
    const result = htmlConverter('<b>Hello</b>');
    expect(result).toStrictEqual([{ as: { native: 'Text', web: 'b' }, children: 'Hello', fontWeight: 'bold' }]);
  });

  it('should create link props using tag "a"', () => {
    const result = htmlConverter('<a href="https://google.com">open the link</a>');
    expect(result).toMatchObject([
      {
        as: { native: 'Text', web: 'a' },
        children: 'open the link',
        textDecorationLine: 'underline',
      },
    ]);
  });

  it('should create text props using tag span', () => {
    const result = htmlConverter('<span style="color:support.success.a">Hello</span>');
    expect(result).toStrictEqual([
      { as: { native: 'Text', web: 'span' }, children: 'Hello', color: 'support.success.a' },
    ]);
  });

  it('should create styles using prop style', () => {
    const result = htmlConverter(
      '<span style="color:support.success.a;font-weight:bold;font-family:mediumValue">Hello</span>',
    );
    expect(result).toStrictEqual([
      {
        as: { native: 'Text', web: 'span' },
        children: 'Hello',
        color: 'support.success.a',
        fontWeight: 'bold',
        variant: 'mediumValue',
      },
    ]);
  });

  it('should create styles using inline props', () => {
    const result = htmlConverter(
      '<span variant="mediumValue" color="support.success.a" fontWeight="bold">Hello World</span>',
    );
    expect(result).toStrictEqual([
      {
        as: { native: 'Text', web: 'span' },
        variant: 'mediumValue',
        children: 'Hello World',
        color: 'support.success.a',
        fontWeight: 'bold',
      },
    ]);
  });

  it('should validate and return true to a valid html', () => {
    const html = '<b>hello world</b>';
    expect(htmlConverter.isValidHtml(html)).toBeTruthy();
  });

  it('should validate and return false to a invalid html', () => {
    const html = '<b>hello world';
    expect(htmlConverter.isValidHtml(html)).toBeFalsy();
  });
});
