import { table } from "@/@types";

/**
 * Obtém o nome de exibição da mesa com prefixo apropriado
 * Mesas de 4 lugares: B1, B2, B3...
 * Mesas de 8 lugares: 1, 2, 3...
 */
export function getTableDisplayName(table: table): string {
  if (table.seats <= 4) {
    return `B${table.number}`;
  }
  return `${table.number}`;
}

/**
 * Configuração de grupo de mesas para renderização em grid
 */
export type TableGroup = {
  id: string;
  label?: string;
  tables: table[];
  gridConfig: {
    rows?: number;
    cols?: number;
    flow?: 'row' | 'col';
    gap?: string;
    className?: string;
  };
  specialPositioning?: {
    [key: number]: string; // table.number -> className
  };
};

/**
 * Configuração de uma seção de mesas no mapa
 */
export type TableSection = {
  id: string;
  title?: string;
  groups: TableGroup[];
  containerClassName?: string;
};
