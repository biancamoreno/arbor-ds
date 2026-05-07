import React from 'react';
import { View, Text, Platform } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { DemoBlock } from '../components/DemoBlock';

const DS_VERSION = '1.1.0';

const tokenRows: { label: string; value: string; swatch?: string }[] = [
  { label: 'brand.solid', value: '#116754', swatch: '#116754' },
  { label: 'background.default', value: '#FFFFFF', swatch: '#FFFFFF' },
  { label: 'text.primary', value: '#111827', swatch: '#111827' },
  { label: 'feedback.success', value: '#16A34A', swatch: '#16A34A' },
  { label: 'feedback.critical', value: '#DC2626', swatch: '#DC2626' },
];

export function HomeScreen() {
  return (
    <ScreenWrapper title="Arbor DS">
      <View style={{ alignItems: 'center', paddingVertical: 24 }}>
        <Text style={{ fontSize: 48, lineHeight: 56 }}>🌳</Text>
        <Text
          style={{ fontSize: 28, fontWeight: '700', color: '#111827', marginTop: 8 }}
        >
          Arbor DS
        </Text>
        <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>
          v{DS_VERSION} · Design System cross-platform
        </Text>
      </View>

      <SectionTitle>Sobre</SectionTitle>
      <DemoBlock>
        <Text style={{ fontSize: 14, color: '#374151', lineHeight: 22 }}>
          Arbor DS é a fonte única de verdade para interfaces web e mobile. Construído com React e React Native, exporta componentes cross-platform com tokens semânticos, temas e suporte a acessibilidade.
        </Text>
      </DemoBlock>

      <SectionTitle>Ambiente</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 10 }}>
          {[
            { label: 'Plataforma', value: Platform.OS },
            { label: 'Versão OS', value: String(Platform.Version) },
            { label: 'Tema ativo', value: 'Light' },
            { label: 'Tokens', value: 'Semânticos v1' },
          ].map(({ label, value }) => (
            <View
              key={label}
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Text style={{ fontSize: 14, color: '#6b7280' }}>{label}</Text>
              <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>{value}</Text>
            </View>
          ))}
        </View>
      </DemoBlock>

      <SectionTitle>Paleta de tokens</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 8 }}>
          {tokenRows.map(({ label, value, swatch }) => (
            <View
              key={label}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              {swatch && (
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    backgroundColor: swatch,
                    borderWidth: 1,
                    borderColor: '#e5e7eb',
                  }}
                />
              )}
              <Text style={{ fontSize: 13, color: '#374151', flex: 1 }}>{label}</Text>
              <Text style={{ fontSize: 11, color: '#9ca3af', fontFamily: 'monospace' }}>{value}</Text>
            </View>
          ))}
        </View>
      </DemoBlock>

      <SectionTitle>Navegue</SectionTitle>
      <DemoBlock label="Use a TabBar abaixo para explorar">
        <View style={{ gap: 8 }}>
          {[
            { tab: 'Botões', desc: 'Button, IconButton, FAB' },
            { tab: 'Forms', desc: 'Checkbox, Switch, Field' },
            { tab: 'Feedback', desc: 'Badge, Alert, Spinner' },
            { tab: 'Overlay', desc: 'Modal, Drawer, Tooltip' },
          ].map(({ tab, desc }) => (
            <View key={tab} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#18736A',
                }}
              />
              <Text style={{ fontSize: 14, color: '#374151' }}>
                <Text style={{ fontWeight: '600' }}>{tab}</Text>
                {' — '}
                {desc}
              </Text>
            </View>
          ))}
        </View>
      </DemoBlock>
    </ScreenWrapper>
  );
}
