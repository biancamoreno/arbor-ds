import { forwardRef, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type CenterProps } from '../interfaces';

/**
 * @platform shared
 *
 * `Flex` pré-configurado para centralizar filhos nos dois eixos
 * (`alignItems="center"` + `justifyContent="center"`). Atalho semântico para o
 * caso recorrente de "centralizar conteúdo dentro de um bloco".
 *
 * @see {@link CenterProps}
 */
export const Center = forwardRef<HTMLElement, CenterProps>(function Center(props, ref) {
  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
  return (
    <ArborTransform
      {...props}
      innerRef={ref ?? legacyRef}
      alignItems="center"
      justifyContent="center"
      display="flex"
    />
  );
});

Center.displayName = 'Center';
