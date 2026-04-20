# Migração: Família Field — v0 → v1

## Contexto

A fase 8 introduz o componente `Field` como anatomia unificada para todos os campos de formulário. A principal mudança é que a responsabilidade de label, helper text e mensagens de erro passa a ser do `Field.Root`, em vez de props individuais de cada componente.

---

## `Input` (TextInput)

### Antes (v0)

```tsx
import { TextInput } from 'arbor-ds';

<TextInput
  label="E-mail"
  helperText="Use seu e-mail corporativo"
  error={errors.email}
  size="md"
  variant="default"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

### Depois (v1) — com Field compound

```tsx
import { Field, TextInput } from 'arbor-ds';

<Field.Root isInvalid={!!errors.email} isRequired>
  <Field.Label>E-mail</Field.Label>
  <Field.Control>
    <TextInput
      size="md"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
  </Field.Control>
  <Field.Description>Use seu e-mail corporativo</Field.Description>
  <Field.Error>{errors.email}</Field.Error>
</Field.Root>
```

**Benefícios:**
- `id` e `htmlFor` conectados automaticamente
- `aria-describedby`, `aria-invalid`, `aria-errormessage`, `aria-required` injetados automaticamente
- `Field.Error` só renderiza quando `isInvalid=true`

### Compatibilidade retroativa

O `TextInput` com props `label`, `error`, `helperText` continua funcionando. Nenhuma alteração obrigatória.

---

## `Checkbox`

### Antes (v0)

```tsx
import { Checkbox } from 'arbor-ds';

<Checkbox
  label="Aceito os termos"
  description="Leia os termos antes de aceitar"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
  disabled={isLoading}
/>
```

### Depois (v1) — anatomia compound

```tsx
import { Checkbox } from 'arbor-ds';

<Checkbox.Root
  checked={accepted}
  onChange={setAccepted}
  disabled={isLoading}
>
  <Checkbox.Indicator />
  <span>
    <Checkbox.Label>Aceito os termos</Checkbox.Label>
    <Checkbox.Description>Leia os termos antes de aceitar</Checkbox.Description>
  </span>
</Checkbox.Root>
```

### Com Field (v1)

```tsx
import { Field, Checkbox } from 'arbor-ds';

<Field.Root isRequired>
  <Field.Control>
    <Checkbox.Root checked={accepted} onChange={setAccepted}>
      <Checkbox.Indicator />
      <Checkbox.Label>Aceito os termos</Checkbox.Label>
    </Checkbox.Root>
  </Field.Control>
  <Field.Error>Você precisa aceitar os termos</Field.Error>
</Field.Root>
```

### Compatibilidade retroativa

O `<Checkbox label="..." checked={...} onChange={...} />` ainda funciona, mas está marcado como `@deprecated`.

---

## `RadioCard` → `Radio`

O `RadioCard` permanece sem alterações. Um novo componente `Radio` foi criado com anatomia compound e suporte nativo a `FieldContext`.

### Antes (usando RadioCard, ainda válido)

```tsx
import { RadioCard } from 'arbor-ds';

<RadioCard
  label="Opção A"
  description="Detalhes da opção A"
  value="a"
  name="options"
  checked={selected === 'a'}
  onCheckedChange={(checked, val) => setSelected(val)}
/>
```

### Depois (usando Radio)

```tsx
import { Radio } from 'arbor-ds';

<Radio value="a" name="options" checked={selected === 'a'} onCheckedChange={(_, val) => setSelected(val)}>
  <span style={{ flex: 1 }}>
    <Radio.Label>Opção A</Radio.Label>
    <Radio.Description>Detalhes da opção A</Radio.Description>
  </span>
  <Radio.Indicator />
</Radio>
```

---

## `Switch` (novo)

```tsx
import { Switch } from 'arbor-ds';

// Simples
<Switch
  checked={enabled}
  onChange={setEnabled}
  aria-label="Ativar notificações"
/>

// Com label ao lado
<Switch checked={enabled} onChange={setEnabled} aria-label="Notificações">
  <span>Ativar notificações</span>
</Switch>

// Com Field
<Field.Root>
  <Field.Label>Notificações</Field.Label>
  <Field.Control>
    <Switch checked={enabled} onChange={setEnabled} aria-label="Notificações" />
  </Field.Control>
</Field.Root>
```

---

## `Select` (novo componente compound)

O antigo `Select` de `input/core/select.tsx` foi substituído por um novo componente compound em `src/components/select/`.

### Antes (v0)

```tsx
import { Select } from 'arbor-ds';

<Select
  label="País"
  options={[
    { value: 'br', label: 'Brasil' },
    { value: 'us', label: 'EUA' },
  ]}
  value={country}
  onChange={setCountry}
/>
```

### Depois (v1)

```tsx
import { Select, Field } from 'arbor-ds';

<Field.Root>
  <Field.Label>País</Field.Label>
  <Field.Control>
    <Select value={country} onValueChange={setCountry}>
      <Select.Trigger>
        <Select.Value placeholder="Selecione um país" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="br">Brasil</Select.Item>
        <Select.Item value="us">EUA</Select.Item>
      </Select.Content>
    </Select>
  </Field.Control>
</Field.Root>
```

---

## Mudanças de import

Nenhuma mudança de import obrigatória. Todos os componentes continuam exportados de `arbor-ds`.

Os novos componentes `Field`, `Radio`, `Switch`, `Select` foram adicionados ao bundle principal.

```ts
import { Field, Radio, Switch, Select } from 'arbor-ds';
// ou individualmente de cada módulo:
import { Field } from 'arbor-ds/components/field';
```

---

## Checklist de migração

- [ ] Substituir props `label`/`error`/`helperText` no `TextInput` por `Field.Root` quando precisar de a11y completa
- [ ] Migrar `<Checkbox label="...">` para `<Checkbox.Root><Checkbox.Indicator/><Checkbox.Label/></Checkbox.Root>`
- [ ] Substituir `RadioCard` por `Radio` em novos componentes
- [ ] Implementar `Switch` em lugar de soluções customizadas de toggle
- [ ] Substituir `Select` legado pelo novo compound `Select.Root/Trigger/Value/Content/Item`
