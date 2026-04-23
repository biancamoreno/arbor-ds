import React from 'react';
import { Text, View } from 'react-native';

type SectionTitleProps = {
  children: string;
};

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <View style={{ marginTop: 20, marginBottom: 8 }}>
      <Text
        style={{
          fontSize: 11,
          fontWeight: '600',
          color: '#9ca3af',
          letterSpacing: 0.8,
          textTransform: 'uppercase',
        }}
      >
        {children}
      </Text>
    </View>
  );
}
