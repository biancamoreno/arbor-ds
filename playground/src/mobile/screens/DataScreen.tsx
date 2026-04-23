import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { DemoBlock } from '../components/DemoBlock';
import { Icon } from '../../../../src/components';

const AVATAR_INITIALS = ['AB', 'CD', 'EF', 'GH'];
const AVATAR_COLORS = ['#18736A', '#7c3aed', '#d97706', '#dc2626'];

function NativeAvatar({ initials, color, size = 40 }: { initials: string; color: string; size?: number }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: size * 0.36, fontWeight: '700' }}>{initials}</Text>
    </View>
  );
}

function NativeCard({
  title,
  description,
  trailing,
  onPress,
}: {
  title: string;
  description?: string;
  trailing?: React.ReactNode;
  onPress?: () => void;
}) {
  const Inner = (
    <View
      style={{
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: '#111827' }}>{title}</Text>
        {description && (
          <Text style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>{description}</Text>
        )}
      </View>
      {trailing}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {Inner}
      </TouchableOpacity>
    );
  }
  return Inner;
}

function AccordionItem({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
      <TouchableOpacity
        onPress={() => setOpen((v) => !v)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 14,
          paddingHorizontal: 2,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', flex: 1 }}>{title}</Text>
        <Icon name={open ? 'ChevronUp' : 'ChevronDown'} size={18} color="#6b7280" decorative />
      </TouchableOpacity>
      {open && (
        <View style={{ paddingBottom: 14, paddingHorizontal: 2 }}>
          <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 22 }}>{content}</Text>
        </View>
      )}
    </View>
  );
}

const TABS = ['Visão geral', 'Detalhes', 'Histórico'];

function TabsDemo() {
  const [active, setActive] = useState(0);

  return (
    <View>
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActive(i)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 14,
              borderBottomWidth: 2,
              borderBottomColor: active === i ? '#18736A' : 'transparent',
              marginBottom: -1,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: active === i ? '600' : '400',
                color: active === i ? '#18736A' : '#6b7280',
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ paddingVertical: 16 }}>
        <Text style={{ fontSize: 14, color: '#374151', lineHeight: 22 }}>
          {active === 0 && 'Conteúdo da aba Visão geral. Mostra informações resumidas do item.'}
          {active === 1 && 'Conteúdo de Detalhes. Exibe especificações técnicas e atributos.'}
          {active === 2 && 'Histórico de alterações. Lista de eventos ordenados por data.'}
        </Text>
      </View>
    </View>
  );
}

export function DataScreen() {
  return (
    <ScreenWrapper title="Dados">
      <SectionTitle>Card</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 8 }}>
          <NativeCard title="Card padrão" description="Informações do item com descrição." />
          <NativeCard
            title="Card clicável"
            description="Toque para abrir os detalhes."
            trailing={<Icon name="ChevronRight" size={18} color="#9ca3af" decorative />}
            onPress={() => console.log('card pressed')}
          />
          <NativeCard
            title="Card com badge"
            description="Status atualizado."
            trailing={
              <View style={{ backgroundColor: '#dcfce7', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#16a34a' }}>Ativo</Text>
              </View>
            }
          />
        </View>
      </DemoBlock>

      <SectionTitle>Avatar</SectionTitle>
      <DemoBlock>
        <View style={{ gap: 12 }}>
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            {AVATAR_INITIALS.map((initials, i) => (
              <NativeAvatar key={initials} initials={initials} color={AVATAR_COLORS[i]} />
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <NativeAvatar initials="AB" color="#18736A" size={32} />
            <NativeAvatar initials="AB" color="#18736A" size={40} />
            <NativeAvatar initials="AB" color="#18736A" size={56} />
            <NativeAvatar initials="AB" color="#18736A" size={72} />
          </View>
        </View>
      </DemoBlock>

      <SectionTitle>Accordion</SectionTitle>
      <DemoBlock>
        <View>
          <AccordionItem
            title="O que é o Arbor DS?"
            content="Arbor DS é um design system cross-platform construído com React e React Native, com foco em consistência visual, acessibilidade e performance."
          />
          <AccordionItem
            title="Como instalar?"
            content="Execute `npm install arbor-ds` ou `pnpm add arbor-ds` no seu projeto. Em seguida, envolva sua aplicação com <ArborProvider>."
          />
          <AccordionItem
            title="Suporta dark mode?"
            content="Sim. O Arbor DS possui `themeLight` e `themeDark` built-in, e suporta criação de temas customizados via `createTheme()`."
          />
        </View>
      </DemoBlock>

      <SectionTitle>Tabs</SectionTitle>
      <DemoBlock>
        <TabsDemo />
      </DemoBlock>
    </ScreenWrapper>
  );
}
