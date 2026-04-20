# Migração: Modal → Dialog

O componente `Modal` foi depreciado em favor do novo `Dialog`, que usa as primitives comportamentais centralizadas (`Portal`, `FocusScope`, `DismissableLayer`) e expõe uma API compound com slots explícitos.

## O que mudou

| Antes (`Modal`) | Depois (`Dialog`) |
|---|---|
| Monolítico — tudo em uma prop | Compound — cada slot é um componente |
| Sem Portal | Portal — renderiza fora do DOM do trigger |
| Sem FocusScope | FocusScope trapped — Tab não sai do dialog |
| Sem DismissableLayer | DismissableLayer — Escape fecha automaticamente |
| `aria-label` com string | `aria-labelledby` linkado ao `Dialog.Title` |
| `role="presentation"` no overlay | `aria-hidden="true"` no overlay |

## Antes

```tsx
import { Modal } from 'arbor-ds';

function MyPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir</button>
      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Título"
        description="Descrição"
        footer={<button onClick={() => setOpen(false)}>OK</button>}
      >
        <p>Conteúdo do modal</p>
      </Modal>
    </>
  );
}
```

## Depois

```tsx
import { Dialog } from 'arbor-ds';

function MyPage() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root isOpen={open} onClose={() => setOpen(false)}>
      <Dialog.Trigger asChild>
        <button type="button">Abrir</button>
      </Dialog.Trigger>
      <Dialog.Overlay />
      <Dialog.Content size="md">
        <Dialog.Title>Título</Dialog.Title>
        <Dialog.Description>Descrição</Dialog.Description>
        <p>Conteúdo do dialog</p>
        <div>
          <Dialog.Close label="Fechar" />
          <button type="button" onClick={() => setOpen(false)}>OK</button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
}
```

## Sem trigger (controlado externamente)

```tsx
<Dialog.Root isOpen={open} onClose={() => setOpen(false)}>
  <Dialog.Overlay />
  <Dialog.Content>
    <Dialog.Title>Confirmação</Dialog.Title>
    <p>Tem certeza?</p>
    <Dialog.Close />
  </Dialog.Content>
</Dialog.Root>
```

## Mapeamento de props

| Modal prop | Dialog equivalente |
|---|---|
| `open` | `Dialog.Root isOpen` |
| `onOpenChange` | `Dialog.Root onClose` |
| `title` | `Dialog.Title` (slot) |
| `description` | `Dialog.Description` (slot) |
| `footer` | Filho direto de `Dialog.Content` |
| `size` | `Dialog.Content size` |
| `closeLabel` | `Dialog.Close label` |
| `closeOnOverlayClick` | Controlado via `Dialog.Overlay onClick` |
