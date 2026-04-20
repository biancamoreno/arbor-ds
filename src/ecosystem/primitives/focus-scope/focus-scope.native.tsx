import React from 'react';
import { View } from 'react-native';

type FocusScopeProps = {
  children: React.ReactNode;
  trapped?: boolean;
  autoFocus?: boolean;
  restoreFocus?: boolean;
};

export function FocusScope({ children }: FocusScopeProps): React.ReactElement {
  return <View>{children}</View>;
}
