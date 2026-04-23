import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { DemoBlock } from '../components/DemoBlock';
import { FloatingActionButton, Icon } from '../../../../src/components';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANTS: Variant[] = ['primary', 'secondary', 'ghost', 'danger'];

const VARIANT_STYLE: Record<Variant, { bg: string; text: string; border?: string }> = {
  primary:   { bg: '#18736A', text: '#ffffff' },
  secondary: { bg: '#e5f4f3', text: '#18736A', border: '#b2d9d5' },
  ghost:     { bg: 'transparent', text: '#18736A', border: 'transparent' },
  danger:    { bg: '#dc2626', text: '#ffffff' },
};

type Size = 'sm' | 'md' | 'lg';
const SIZES: Size[] = ['sm', 'md', 'lg'];
const SIZE_PY: Record<Size, number> = { sm: 6, md: 10, lg: 14 };
const SIZE_PX: Record<Size, number> = { sm: 12, md: 16, lg: 20 };
const SIZE_FS: Record<Size, number> = { sm: 13, md: 14, lg: 16 };

function NativeButton({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onPress,
}: {
  label: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
}) {
  const { bg, text, border } = VARIANT_STYLE[variant];
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
      style={{
        backgroundColor: bg,
        paddingVertical: SIZE_PY[size],
        paddingHorizontal: SIZE_PX[size],
        borderRadius: 10,
        borderWidth: border !== undefined ? 1 : 0,
        borderColor: border,
        opacity: disabled || loading ? 0.5 : 1,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color: text, fontSize: SIZE_FS[size], fontWeight: '600' }}>
        {loading ? 'Carregando…' : label}
      </Text>
    </TouchableOpacity>
  );
}

export function ButtonsScreen() {
  const [count, setCount] = useState(0);
  const [fabVisible, setFabVisible] = useState(false);

  return (
    <ScreenWrapper title="Botões">
      <SectionTitle>Variantes</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 8 }}>
          {VARIANTS.map((v) => (
            <NativeButton key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} variant={v} />
          ))}
        </View>
      </DemoBlock>

      <SectionTitle>Tamanhos</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 8, alignItems: 'flex-start' }}>
          {SIZES.map((s) => (
            <NativeButton key={s} label={`Size ${s}`} size={s} />
          ))}
        </View>
      </DemoBlock>

      <SectionTitle>Estados</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 8 }}>
          <NativeButton label="Loading…" loading />
          <NativeButton label="Desabilitado" disabled />
        </View>
      </DemoBlock>

      <SectionTitle>Com ícone</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 8 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#18736A',
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
              alignSelf: 'flex-start',
            }}
          >
            <Icon name="Plus" size={16} color="#ffffff" decorative />
            <Text style={{ color: '#fff', fontWeight: '600' }}>Adicionar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#e5f4f3',
              paddingVertical: 10,
              paddingHorizontal: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#b2d9d5',
              alignSelf: 'flex-start',
            }}
          >
            <Icon name="Download" size={16} color="#18736A" decorative />
            <Text style={{ color: '#18736A', fontWeight: '600' }}>Download</Text>
          </TouchableOpacity>
        </View>
      </DemoBlock>

      <SectionTitle>Contador interativo</SectionTitle>
      <DemoBlock label={`Total de cliques: ${count}`}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <NativeButton label="+1" onPress={() => setCount((c) => c + 1)} />
          <NativeButton label="Reset" variant="ghost" onPress={() => setCount(0)} />
        </View>
      </DemoBlock>

      <SectionTitle>FAB in-page (position=none)</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 8, alignItems: 'flex-start' }}>
          <FloatingActionButton
            icon="Plus"
            label="Criar item"
            position="none"
            onPress={() => setFabVisible((v) => !v)}
          />
          {fabVisible && (
            <Text style={{ fontSize: 13, color: '#18736A', marginTop: 4 }}>
              FAB acionado!
            </Text>
          )}
        </View>
      </DemoBlock>

      <SectionTitle>IconButton</SectionTitle>
      <DemoBlock label="Botões de ação circular">
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {(['Search', 'Bell', 'Settings', 'Heart'] as const).map((iconName) => (
            <TouchableOpacity
              key={iconName}
              accessibilityRole="button"
              accessibilityLabel={iconName}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: '#f3f4f6',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon name={iconName} size={18} color="#374151" decorative />
            </TouchableOpacity>
          ))}
        </View>
      </DemoBlock>
    </ScreenWrapper>
  );
}
