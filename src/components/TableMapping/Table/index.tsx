import { Button } from '@/components/ui/button';
import { table } from '../../../@types/index';
type TableProps = {
  table: table;
}
const Table = ({ table }: TableProps) => {
  return (
    <button
      key={table.id}
      className={
        `border border-primary w-5 sm:w-7 h-5 sm:h-7 flex items-center justify-center text-xs sm:text-sm rounded-sm ${table.isTaken ? 'bg-primary text-white hover:bg-primary/80' : 'bg-background text-foreground hover:bg-background/0 dark:hover:bg-zinc-600'} transition-colors`
      }>
      {table.number}
    </button>
  );
}

export default Table;