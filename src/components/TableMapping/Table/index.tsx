'use client'
import { table } from '../../../@types/index';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UpdateTableForm from '@/components/Tables/TableForm/UpdateTableForm';
type TableProps = {
  table: table;
}
const Table = ({ table }: TableProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          key={table.id}
          className={
            `border border-primary w-5 sm:w-7 h-5 sm:h-7 flex items-center justify-center text-xs sm:text-sm rounded-sm ${!table.isTaken ? 'bg-background text-foreground' : table.isPaid ? 'bg-green-500 text-white' : 'bg-primary text-white'} transition-colors hover:bg-primary/80 hover:text-white dark:hover:bg-primary/70`
          }>
          {table.number}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-w-[360px] rounded-lg bg-card">
        <DialogHeader>
          <DialogTitle className="text-primary">Editar mesa {table.number}</DialogTitle>
        </DialogHeader>
        <UpdateTableForm {...table} />
      </DialogContent>
    </Dialog>
  );
}

export default Table;