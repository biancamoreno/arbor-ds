import { createStyledComponent } from '../../styled-system/core/styled';

type StyledFactory = Record<string, ReturnType<typeof createStyledComponent>>;

export const styled = new Proxy({} as StyledFactory, {
  get: (_target, tag: string) => createStyledComponent(tag),
});
