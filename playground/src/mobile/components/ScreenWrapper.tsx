import React from 'react';
import { View, ScrollView } from 'react-native';
import { NavBar } from '../../../../src/components';

type ScreenWrapperProps = {
  title: string;
  start?: React.ReactNode;
  end?: React.ReactNode;
  children: React.ReactNode;
};

export function ScreenWrapper({ title, start, end, children }: ScreenWrapperProps) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <NavBar title={title} start={start} end={end} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
    </View>
  );
}
