/**
 * Remove HTML tags from a string to create a sanitized version for accessibility labels
 * @param text - The text that may contain HTML tags
 * @returns The sanitized text without HTML tags
 */
export function sanitizeHtmlText(text: string): string {
  return typeof text === 'string' ? text.replace(/<[^>]*>/g, '') : text;
}
