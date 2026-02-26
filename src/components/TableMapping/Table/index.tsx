'use client'
import TableInfo from '@/components/TableInfo';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from "@/components/ui/separator";
import { table } from '../../../@types/index';
import UpdateTableForm from '../../Tables/TableForm/UpdateTableForm';
type TableProps = {
  table: table;
  isPublic?: boolean;
}
const Table = ({ table, isPublic }: TableProps) => {
  const tableLabel = table.displayLabel ?? table.number;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          key={table.id}
          className={
            `border border-primary w-6 sm:w-8 h-6 sm:h-8 flex items-center justify-center text-xs sm:text-sm rounded-sm ${!table.isTaken ? 'bg-background text-foreground' : table.isPaid ? 'bg-green-500 text-white' : 'bg-primary text-white'} transition-colors hover:bg-primary/80 hover:text-white dark:hover:bg-primary/70`
          }>
          {tableLabel}
        </button>
      </DialogTrigger>
      {isPublic ?
        <DialogContent className='max-w-[260px] rounded-lg bg-card'>
          <DialogHeader hidden>
            <DialogTitle className="text-primary">Mesa {tableLabel}</DialogTitle>
          </DialogHeader>
          <Separator />
          <TableInfo {...table} />
        </DialogContent> :
        <DialogContent className="sm:max-w-[760px] max-w-[360px] rounded-lg bg-card">
          <DialogHeader>
            <DialogTitle className="text-primary">Editar mesa {tableLabel}</DialogTitle>
          </DialogHeader>
          <UpdateTableForm {...table} />
        </DialogContent>
      }
    </Dialog>
  );
}

export default Table;