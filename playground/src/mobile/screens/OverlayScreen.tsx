import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { DemoBlock } from '../components/DemoBlock';
import { Icon } from '../../../../src/components';

function Overlay({
  visible,
  onClose,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center' }}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
          {children}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function ModalDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{ backgroundColor: '#18736A', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 16, alignSelf: 'flex-start' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Abrir Modal</Text>
      </TouchableOpacity>

      <Overlay visible={open} onClose={() => setOpen(false)}>
        <View
          style={{
            width: 320,
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 24,
            gap: 12,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
            Confirmar ação
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 22 }}>
            Você tem certeza que deseja continuar? Esta ação não pode ser desfeita.
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end', marginTop: 4 }}>
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={{ borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, borderWidth: 1, borderColor: '#e5e7eb' }}
            >
              <Text style={{ color: '#374151', fontWeight: '500' }}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={{ borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, backgroundColor: '#18736A' }}
            >
              <Text style={{ color: '#fff', fontWeight: '500' }}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    </>
  );
}

function DrawerDemo({ side }: { side: 'bottom' | 'right' }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          backgroundColor: '#f3f4f6',
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderWidth: 1,
          borderColor: '#e5e7eb',
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ color: '#374151', fontWeight: '600' }}>Drawer {side}</Text>
      </TouchableOpacity>

      <Modal visible={open} transparent animationType={side === 'bottom' ? 'slide' : 'fade'} onRequestClose={() => setOpen(false)}>
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: side === 'bottom' ? 'flex-end' : 'flex-end', alignItems: side === 'right' ? 'flex-end' : 'stretch' }}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={() => {}}>
            <View
              style={{
                backgroundColor: '#fff',
                borderTopLeftRadius: side === 'bottom' ? 20 : 0,
                borderTopRightRadius: side === 'bottom' ? 20 : 0,
                borderBottomLeftRadius: 0,
                padding: 24,
                minHeight: side === 'bottom' ? 260 : undefined,
                width: side === 'right' ? 280 : undefined,
                minWidth: side === 'right' ? 280 : undefined,
                ...(side === 'right' ? { height: '100%' } : {}),
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>
                  Drawer {side}
                </Text>
                <TouchableOpacity onPress={() => setOpen(false)}>
                  <Icon name="X" size={20} color="#374151" decorative />
                </TouchableOpacity>
              </View>
              <Text style={{ fontSize: 14, color: '#6b7280', lineHeight: 22 }}>
                Este drawer desliza pelo {side === 'bottom' ? 'inferior' : 'lado direito'} da tela. Toque fora ou no ✕ para fechar.
              </Text>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

function TooltipDemo() {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        onPress={() => setVisible((v) => !v)}
        style={{
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 14,
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Icon name="Info" size={16} color="#6b7280" decorative />
        <Text style={{ fontSize: 14, color: '#374151' }}>Toque para tooltip</Text>
      </TouchableOpacity>
      {visible && (
        <View
          style={{
            position: 'absolute',
            top: 44,
            left: 0,
            backgroundColor: '#111827',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 12,
            maxWidth: 220,
            zIndex: 10,
          }}
        >
          <Text style={{ fontSize: 12, color: '#fff', lineHeight: 18 }}>
            Dica contextual com informação extra para o usuário.
          </Text>
        </View>
      )}
    </View>
  );
}

function ContextMenuDemo() {
  const [open, setOpen] = useState(false);
  const actions = [
    { label: 'Editar', icon: 'Pencil' },
    { label: 'Duplicar', icon: 'Copy' },
    { label: 'Compartilhar', icon: 'Share2' },
    { label: 'Excluir', icon: 'Trash2' },
  ] as const;

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          backgroundColor: '#f3f4f6',
          borderRadius: 8,
          paddingVertical: 8,
          paddingHorizontal: 14,
          alignSelf: 'flex-start',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <Icon name="EllipsisVertical" size={16} color="#374151" decorative />
        <Text style={{ fontSize: 14, color: '#374151' }}>Menu contextual</Text>
      </TouchableOpacity>

      <Overlay visible={open} onClose={() => setOpen(false)}>
        <View
          style={{
            width: 220,
            backgroundColor: '#fff',
            borderRadius: 12,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          {actions.map(({ label, icon }, i) => (
            <TouchableOpacity
              key={label}
              onPress={() => setOpen(false)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderBottomWidth: i < actions.length - 1 ? 1 : 0,
                borderBottomColor: '#f3f4f6',
              }}
            >
              <Icon name={icon} size={16} color={label === 'Excluir' ? '#dc2626' : '#374151'} decorative />
              <Text style={{ fontSize: 14, color: label === 'Excluir' ? '#dc2626' : '#374151' }}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Overlay>
    </>
  );
}

export function OverlayScreen() {
  return (
    <ScreenWrapper title="Overlays">
      <SectionTitle>Modal</SectionTitle>
      <DemoBlock label="Dialog de confirmação">
        <ModalDemo />
      </DemoBlock>

      <SectionTitle>Drawer</SectionTitle>
      <DemoBlock label="Bottom sheet e side drawer">
        <View style={{ gap: 8 }}>
          <DrawerDemo side="bottom" />
          <DrawerDemo side="right" />
        </View>
      </DemoBlock>

      <SectionTitle>Tooltip</SectionTitle>
      <DemoBlock label="Dica ao toque">
        <TooltipDemo />
      </DemoBlock>

      <SectionTitle>Menu contextual</SectionTitle>
      <DemoBlock label="Lista de ações">
        <ContextMenuDemo />
      </DemoBlock>
    </ScreenWrapper>
  );
}
