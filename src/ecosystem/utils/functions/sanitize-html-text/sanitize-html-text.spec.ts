import { sanitizeHtmlText } from './sanitize-html-text';
describe('sanitizeHtmlText', () => {
  it('should remove HTML tags from a string', () => {
    const input = 'Hello <b><span color="content.primary">world</span></b>';
    const output = sanitizeHtmlText(input);
    expect(output).toBe('Hello world');
  });
});
