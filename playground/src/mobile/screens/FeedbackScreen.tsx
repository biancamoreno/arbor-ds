import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { DemoBlock } from '../components/DemoBlock';
import { Icon } from '../../../../src/components';

type BadgeTone = 'brand' | 'success' | 'warning' | 'critical' | 'neutral';

const BADGE_COLORS: Record<BadgeTone, { bg: string; text: string }> = {
  brand:    { bg: '#dceee4', text: '#18736A' },
  success:  { bg: '#dcfce7', text: '#16a34a' },
  warning:  { bg: '#fef9c3', text: '#ca8a04' },
  critical: { bg: '#fee2e2', text: '#dc2626' },
  neutral:  { bg: '#f3f4f6', text: '#374151' },
};

type AlertTone = 'info' | 'success' | 'warning' | 'critical';

const ALERT_CONFIG: Record<AlertTone, { icon: string; bg: string; border: string; text: string }> = {
  info:     { icon: 'Info',          bg: '#eff6ff', border: '#bfdbfe', text: '#1d4ed8' },
  success:  { icon: 'CheckCircle',   bg: '#f0fdf4', border: '#bbf7d0', text: '#16a34a' },
  warning:  { icon: 'AlertTriangle', bg: '#fffbeb', border: '#fde68a', text: '#d97706' },
  critical: { icon: 'XCircle',       bg: '#fef2f2', border: '#fecaca', text: '#dc2626' },
};

function NativeBadge({ tone, label }: { tone: BadgeTone; label: string }) {
  const { bg, text } = BADGE_COLORS[tone];
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 3,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: '600', color: text }}>{label}</Text>
    </View>
  );
}

function NativeAlert({ tone, title, description }: { tone: AlertTone; title: string; description?: string }) {
  const { icon, bg, border, text } = ALERT_CONFIG[tone];
  return (
    <View
      style={{
        backgroundColor: bg,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: border,
        padding: 12,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'flex-start',
      }}
    >
      <Icon name={icon as 'Info'} size={18} color={text} decorative />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '600', color: text }}>{title}</Text>
        {description && (
          <Text style={{ fontSize: 13, color: text, marginTop: 2, opacity: 0.85 }}>{description}</Text>
        )}
      </View>
    </View>
  );
}

function NativeSpinner({ size = 24, color = '#18736A' }: { size?: number; color?: string }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2,
        borderColor: `${color}33`,
        borderTopColor: color,
      }}
    />
  );
}

function NativeSkeleton({ width, height = 16, radius = 8 }: { width: number | string; height?: number; radius?: number }) {
  return (
    <View
      style={{
        width: width as number,
        height,
        borderRadius: radius,
        backgroundColor: '#e5e7eb',
      }}
    />
  );
}

export function FeedbackScreen() {
  const [badgeCount, setBadgeCount] = useState(3);
  const [toastVisible, setToastVisible] = useState(false);

  function showToast() {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  }

  return (
    <ScreenWrapper title="Feedback">
      <SectionTitle>Badge</SectionTitle>
      <DemoBlock label="Tons semânticos">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {(Object.keys(BADGE_COLORS) as BadgeTone[]).map((tone) => (
            <NativeBadge key={tone} tone={tone} label={tone} />
          ))}
        </View>
      </DemoBlock>
      <DemoBlock label={`Contador: ${badgeCount}`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <NativeBadge tone="critical" label={String(badgeCount)} />
          <TouchableOpacity
            onPress={() => setBadgeCount((c) => c + 1)}
            style={{
              backgroundColor: '#f3f4f6',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 14, color: '#374151' }}>+1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setBadgeCount(0)}
            style={{
              backgroundColor: '#f3f4f6',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Text style={{ fontSize: 14, color: '#374151' }}>Reset</Text>
          </TouchableOpacity>
        </View>
      </DemoBlock>

      <SectionTitle>Alert</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 8 }}>
          <NativeAlert tone="info"     title="Informação"   description="Dica útil para o usuário." />
          <NativeAlert tone="success"  title="Sucesso!"     description="Operação concluída." />
          <NativeAlert tone="warning"  title="Atenção"      description="Verifique antes de continuar." />
          <NativeAlert tone="critical" title="Erro"         description="Algo deu errado. Tente novamente." />
        </View>
      </DemoBlock>

      <SectionTitle>Spinner</SectionTitle>
      <DemoBlock label="Indicador de carregamento">
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
          <NativeSpinner size={16} />
          <NativeSpinner size={24} />
          <NativeSpinner size={40} />
          <NativeSpinner size={24} color="#7c3aed" />
          <NativeSpinner size={24} color="#dc2626" />
        </View>
      </DemoBlock>

      <SectionTitle>Skeleton</SectionTitle>
      <DemoBlock label="Placeholder de carregamento">
        <View style={{ gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <NativeSkeleton width={40} height={40} radius={20} />
            <View style={{ flex: 1, gap: 6 }}>
              <NativeSkeleton width="80%" height={14} />
              <NativeSkeleton width="60%" height={12} />
            </View>
          </View>
          <NativeSkeleton width="100%" height={100} radius={10} />
          <NativeSkeleton width="90%" height={14} />
          <NativeSkeleton width="70%" height={14} />
        </View>
      </DemoBlock>

      <SectionTitle>Toast</SectionTitle>
      <DemoBlock label="Notificação temporária">
        <TouchableOpacity
          onPress={showToast}
          style={{
            backgroundColor: '#18736A',
            borderRadius: 10,
            paddingVertical: 10,
            paddingHorizontal: 16,
            alignSelf: 'flex-start',
          }}
        >
          <Text style={{ color: '#fff', fontWeight: '600' }}>Mostrar Toast</Text>
        </TouchableOpacity>
      </DemoBlock>

      {toastVisible && (
        <View
          style={{
            position: 'absolute',
            bottom: 130,
            left: 16,
            right: 16,
            backgroundColor: '#111827',
            borderRadius: 12,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
          }}
        >
          <Icon name="CircleCheck" size={18} color="#4ade80" decorative />
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '500', flex: 1 }}>
            Operação realizada com sucesso!
          </Text>
        </View>
      )}
    </ScreenWrapper>
  );
}
