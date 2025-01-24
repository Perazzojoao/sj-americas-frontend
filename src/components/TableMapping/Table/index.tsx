'use client'
import { table } from '../../../@types/index';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import UpdateTableForm from '@/components/Tables/TableForm/UpdateTableForm';
type TableProps = {
  table: table;
}
const Table = ({ table }: TableProps) => {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <DialogTrigger asChild>
            <TooltipTrigger
              key={table.id}
              className={
                `border border-primary w-5 sm:w-7 h-5 sm:h-7 flex items-center justify-center text-xs sm:text-sm rounded-sm ${!table.isTaken ? 'bg-background text-foreground' : table.isPaid ? 'bg-green-500 text-white' : 'bg-primary text-white'} transition-colors hover:bg-primary/80 hover:text-white dark:hover:bg-primary/70`
              }>
              {table.number}
            </TooltipTrigger>
          </DialogTrigger>
          <TooltipContent align='end' className='grid grid-cols-1 auto-rows-auto gap-2 p-2 sm:p-3'>
            <h4 className='font-semibold w-full text-start text-primary'>Mesa {table.number}</h4>
            <Separator />
            <div className='grid grid-cols-2 gap-2 auto-rows-auto'>
              <span className='text-end font-semibold'>Cadeiras:</span>
              <span>{table.seats}</span>
              <span className='text-end font-semibold'>Lote:</span>
              <span>{table.owner ? table.owner : '-'}</span>
              <span className='text-end font-semibold'>Status:</span>
              <span>{table.isTaken ? 'Reservado' : 'Vago'}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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