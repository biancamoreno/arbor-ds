/* eslint-disable @typescript-eslint/no-explicit-any */
export function getReactNodeText(node: any): string {
  if (!node) return '';
  if (['string', 'number'].includes(typeof node)) return node;
  if (node instanceof Array) return node.map(getReactNodeText).join('');
  if (typeof node === 'object' && node) return getReactNodeText(node.props.children);
  return '';
}
