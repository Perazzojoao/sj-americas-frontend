# Sistema de Mapeamento de Mesas - Guia de Uso

## Visão Geral

O sistema de mapeamento de mesas foi refatorado para utilizar uma arquitetura baseada em configuração de grid, facilitando o posicionamento e adição de novas mesas ou fileiras de mesas.

## Numeração de Mesas

- **Mesas de 4 lugares**: Exibidas com prefixo "B" (B1, B2, B3, ..., B23, ...)
- **Mesas de 8 lugares**: Exibidas sem prefixo (1, 2, 3, ..., 58, ...)

A numeração interna (`table.number`) permanece a mesma no banco de dados. O prefixo é aplicado apenas na exibição através da função `getTableDisplayName()`.

## Estrutura do Sistema

### TableSection
Representa uma seção completa do mapa de mesas (ex: seção superior, seção principal).

```typescript
type TableSection = {
  id: string;                    // Identificador único da seção
  title?: string;                // Título opcional da seção
  groups: TableGroup[];          // Grupos de mesas na seção
  containerClassName?: string;   // Classes CSS do container da seção
};
```

### TableGroup
Representa um grupo de mesas com configuração de grid específica.

```typescript
type TableGroup = {
  id: string;                    // Identificador único do grupo
  label?: string;                // Label opcional do grupo
  tables: table[];               // Array de mesas do grupo
  gridConfig: {
    rows?: number;               // Número de linhas no grid
    cols?: number;               // Número de colunas no grid
    flow?: 'row' | 'col';        // Direção do fluxo (linha ou coluna)
    gap?: string;                // Classes de gap (ex: 'gap-2 sm:gap-4')
    className?: string;          // Classes CSS completas do grid
  };
  specialPositioning?: {
    [key: number]: string;       // table.number -> className especial
  };
};
```

## Como Adicionar Novas Mesas ou Fileiras

### Exemplo 1: Adicionar uma Nova Fileira de Mesas de 8 Lugares

```typescript
// No useMemo de tableSections:
{
  id: 'center-large-row4',  // Novo ID único
  tables: mainLgTables.slice(58, 68),  // Mesas 59-68
  gridConfig: {
    rows: 2,
    flow: 'col',
    gap: 'gap-2 sm:gap-4',
    className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit'
  }
}
```

### Exemplo 2: Adicionar Grupo de Mesas com Posicionamento Especial

```typescript
{
  id: 'special-tables',
  tables: specialTables,
  gridConfig: {
    rows: 3,
    flow: 'col',
    gap: 'gap-4',
    className: 'grid grid-rows-3 auto-cols-max grid-flow-col gap-4 w-fit ml-10'
  },
  specialPositioning: {
    15: 'row-span-2',           // Mesa 15 ocupa 2 linhas
    20: 'col-span-2'            // Mesa 20 ocupa 2 colunas
  }
}
```

### Exemplo 3: Criar Nova Seção de Mesas

```typescript
sections.push({
  id: 'vip-section',
  title: 'Mesas VIP',
  groups: [
    {
      id: 'vip-group-1',
      tables: vipTables,
      gridConfig: {
        flow: 'row',
        gap: 'gap-5',
        className: 'grid grid-flow-row gap-5 w-fit'
      }
    }
  ],
  containerClassName: 'flex flex-col gap-4 items-center'
});
```

## Renderização

A renderização é feita através da função `renderTableGroup()` que:
1. Itera sobre as mesas do grupo
2. Aplica classes especiais de posicionamento quando definidas
3. Renderiza cada mesa usando o componente `<Table />`

No JSX, basta mapear as seções e grupos:

```typescript
{tableSections.map((section) => (
  <div key={section.id} className={section.containerClassName}>
    {section.groups.map(renderTableGroup)}
  </div>
))}
```

## Vantagens do Novo Sistema

1. **Configuração Declarativa**: Toda a disposição é definida em uma estrutura de dados clara
2. **Fácil Reposicionamento**: Basta ajustar o gridConfig para mudar a disposição
3. **Escalável**: Adicionar novas mesas é simplesmente adicionar um novo grupo
4. **Manutenível**: A lógica de renderização está separada da configuração
5. **Flexível**: Suporta posicionamento especial de mesas individuais

## Arquivos Modificados

- `src/utils/tableDisplay.ts`: Utilitário com função de display e tipos
- `src/components/TableMapping/index.tsx`: Componente principal refatorado
- `src/components/TableMapping/Table/index.tsx`: Atualizado para usar display name
- `src/components/Tables/DataTable/columns.tsx`: Atualizado para usar display name
