import React from 'react';
import { View } from 'react-native';

type FocusScopeProps = {
  children: React.ReactNode;
  trapped?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  // Paridade de tipo com a versão web (RFC-0043: API plana do Dialog
  // expõe `initialFocusRef`). Em native, foco programático é responsabilidade
  // do consumer (RN não tem trap real de DOM); a prop é aceita por paridade
  // e ignorada na implementação.
  initialFocus?: React.RefObject<unknown>;
};

export function FocusScope({ children }: FocusScopeProps): React.ReactElement {
  return <View>{children}</View>;
}
