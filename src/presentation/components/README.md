# Componentes VoxChain

Esta pasta contém todos os componentes reutilizáveis do sistema VoxChain, organizados em subpastas para facilitar a manutenção e identidade visual.

## Estrutura de Pastas

```
components/
├── layout/           # Componentes de layout (Header, Footer, Layout)
├── ui/              # Componentes de interface (botões, cards, loading, etc.)
├── forms/           # Componentes de formulário (inputs, form cards)
└── index.ts         # Exportações centralizadas
```

## Componentes de Layout

### Header
- Header reutilizável com logo e ações do usuário
- Suporte para botão de voltar
- Integração com contexto de autenticação

### Footer
- Footer padrão do sistema
- Informações de copyright

### Layout
- Wrapper principal para todas as páginas
- Configurável para mostrar/ocultar header e footer
- Suporte para diferentes backgrounds

## Componentes de UI

### GovButton
- Botão padrão do governo
- Variantes: primary, secondary
- Suporte para fullWidth e disabled

### Loading
- Spinner de carregamento
- Tamanhos: sm, md, lg
- Texto opcional

### StatusBadge
- Badge para status de eleições
- Cores automáticas baseadas no status

### Card
- Card reutilizável
- Suporte para hover effects
- Padding configurável

### EmptyState
- Estado vazio com ícone e texto
- Ação opcional

## Componentes de Formulário

### Input
- Input padronizado
- Suporte para labels, placeholders, validação
- Estados de erro

### FormCard
- Card para formulários
- Ícone, título e subtítulo
- Layout centralizado

## Como Usar

```tsx
import { Layout, GovButton, Card, Input } from '../components';

// Usar componentes
<Layout>
  <Card hover>
    <Input label="Nome" value={nome} onChange={setNome} />
    <GovButton onClick={handleSubmit}>
      Salvar
    </GovButton>
  </Card>
</Layout>
```

## Benefícios

1. **Consistência Visual**: Todos os componentes seguem o design system
2. **Reutilização**: Componentes podem ser usados em qualquer página
3. **Manutenibilidade**: Mudanças centralizadas nos componentes
4. **Organização**: Estrutura clara e intuitiva
5. **TypeScript**: Tipagem completa para melhor DX
