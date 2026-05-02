/**
 * @platform web
 *
 * Gate de paridade do catálogo de ícones (RFC-0028).
 * Web e native devem expor exatamente o mesmo conjunto de chaves; toda alteração
 * em `icon-map.ts` precisa ser replicada em `icon-map.native.ts` e vice-versa.
 */
import { iconMap as webIconMap } from '../internal/icon-map';
import { iconMap as nativeIconMap } from '../internal/icon-map.native';

describe('icon-map parity', () => {
  it('web and native expose the exact same icon names', () => {
    const webKeys = Object.keys(webIconMap).sort();
    const nativeKeys = Object.keys(nativeIconMap).sort();
    expect(webKeys).toEqual(nativeKeys);
  });

  it('every entry resolves to a defined component', () => {
    for (const [name, Component] of Object.entries(webIconMap)) {
      if (!Component) {
        throw new Error(`web iconMap.${name} is undefined`);
      }
    }
    for (const [name, Component] of Object.entries(nativeIconMap)) {
      if (!Component) {
        throw new Error(`native iconMap.${name} is undefined`);
      }
    }
  });
});
