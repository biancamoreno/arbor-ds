import React from 'react';
import { View, Text } from 'react-native';

type DemoBlockProps = {
  label?: string;
  children: React.ReactNode;
};

export function DemoBlock({ label, children }: DemoBlockProps) {
  return (
    <View style={{ marginBottom: 10 }}>
      {label !== undefined && (
        <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>{label}</Text>
      )}
      <View
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 12,
          padding: 16,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        }}
      >
        {children}
      </View>
    </View>
  );
}
