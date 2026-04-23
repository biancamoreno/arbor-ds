import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { SectionTitle } from '../components/SectionTitle';
import { DemoBlock } from '../components/DemoBlock';
import { Checkbox, Switch, Field } from '../../../../src/components';

export function FormsScreen() {
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(true);
  const [checked3, setChecked3] = useState(false);
  const [switchOn, setSwitchOn] = useState(false);
  const [switchNotifs, setSwitchNotifs] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [selected, setSelected] = useState<string | null>(null);

  function validateName() {
    setNameError(name.trim().length < 3 ? 'Nome precisa ter ao menos 3 caracteres.' : '');
  }

  return (
    <ScreenWrapper title="Formulários">
      <SectionTitle>Input de texto</SectionTitle>
      <DemoBlock label="TextInput nativo">
        <View style={{ gap: 12 }}>
          <View>
            <Text style={{ fontSize: 13, color: '#374151', marginBottom: 4, fontWeight: '500' }}>
              Nome
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              onBlur={validateName}
              placeholder="Seu nome completo"
              placeholderTextColor="#9ca3af"
              style={{
                borderWidth: 1,
                borderColor: nameError ? '#dc2626' : '#d1d5db',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                color: '#111827',
                backgroundColor: '#fff',
              }}
            />
            {nameError ? (
              <Text style={{ fontSize: 12, color: '#dc2626', marginTop: 4 }}>{nameError}</Text>
            ) : null}
          </View>
          <View>
            <Text style={{ fontSize: 13, color: '#374151', marginBottom: 4, fontWeight: '500' }}>
              E-mail
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor="#9ca3af"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                borderWidth: 1,
                borderColor: '#d1d5db',
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                color: '#111827',
                backgroundColor: '#fff',
              }}
            />
          </View>
        </View>
      </DemoBlock>

      <SectionTitle>Checkbox</SectionTitle>
      <DemoBlock label="Componente Arbor — Checkbox.native.tsx">
        <View style={{ gap: 12 }}>
          <Checkbox.Root checked={checked1} onChange={setChecked1}>
            <Checkbox.Indicator />
            <Checkbox.Label>Aceitar termos de uso</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root checked={checked2} onChange={setChecked2}>
            <Checkbox.Indicator />
            <Checkbox.Label>Receber newsletter</Checkbox.Label>
          </Checkbox.Root>
          <Checkbox.Root checked={checked3} onChange={setChecked3} disabled>
            <Checkbox.Indicator />
            <Checkbox.Label>Opção desabilitada</Checkbox.Label>
          </Checkbox.Root>
        </View>
      </DemoBlock>

      <SectionTitle>Switch</SectionTitle>
      <DemoBlock label="Componente Arbor — Switch.native.tsx">
        <View style={{ gap: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>Modo escuro</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Alterna o tema da interface</Text>
            </View>
            <Switch.Root checked={switchOn} onChange={setSwitchOn} aria-label="Modo escuro" />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 14, color: '#111827', fontWeight: '500' }}>Notificações</Text>
              <Text style={{ fontSize: 12, color: '#6b7280' }}>Receber alertas e avisos</Text>
            </View>
            <Switch.Root checked={switchNotifs} onChange={setSwitchNotifs} aria-label="Notificações" />
          </View>
        </View>
      </DemoBlock>

      <SectionTitle>Select (nativo)</SectionTitle>
      <DemoBlock label="Seleção de opção">
        <View style={{ gap: 8 }}>
          {['Opção 1', 'Opção 2', 'Opção 3'].map((opt) => (
            <TouchableOpacity
              key={opt}
              onPress={() => setSelected(opt)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: selected === opt ? '#18736A' : '#e5e7eb',
                backgroundColor: selected === opt ? '#e5f4f3' : '#fff',
              }}
            >
              <View
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 9,
                  borderWidth: 2,
                  borderColor: selected === opt ? '#18736A' : '#d1d5db',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {selected === opt && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: '#18736A',
                    }}
                  />
                )}
              </View>
              <Text
                style={{
                  fontSize: 14,
                  color: selected === opt ? '#18736A' : '#374151',
                  fontWeight: selected === opt ? '500' : '400',
                }}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DemoBlock>

      <SectionTitle>Field compound</SectionTitle>
      <DemoBlock label="Componente Arbor — Field.native.tsx">
        <Field.Root>
          <Field.Label>Campo com helper</Field.Label>
          <TextInput
            placeholder="Digite aqui"
            placeholderTextColor="#9ca3af"
            style={{
              borderWidth: 1,
              borderColor: '#d1d5db',
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              color: '#111827',
              backgroundColor: '#fff',
              marginVertical: 4,
            }}
          />
          <Field.Description>Texto auxiliar explicando o campo acima.</Field.Description>
        </Field.Root>
      </DemoBlock>
    </ScreenWrapper>
  );
}
