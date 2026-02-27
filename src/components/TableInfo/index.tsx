import { table } from "@/@types";
import { Separator } from "../ui/separator";
const TableInfo = ({ seats, owner, isTaken, guestNames }: table) => {
  const tableGuestNames = guestNames ?? []

  return (
    <div className='grid grid-cols-1 auto-rows-auto gap-4 p-2 sm:p-3'>
      <div className='grid grid-cols-2 gap-2 auto-rows-auto'>
        <span className='text-end font-semibold'>Cadeiras:</span>
        <span>{seats}</span>
        <span className='text-end font-semibold'>Lote:</span>
        <span>{owner ? owner : '-'}</span>
        <span className='text-end font-semibold'>Status:</span>
        <span>{isTaken ? 'Reservado' : 'Vago'}</span>
      </div>

      <Separator />
      <div className='h-fit'>
        <h3 className='text-sm font-semibold mb-2'>Nomes na mesa</h3>

        <span className='text-xs text-muted-foreground block mt-2'>
          {tableGuestNames.length}/{seats} nomes
        </span>

        <div className='mt-2.5 max-h-48 overflow-auto'>
          {tableGuestNames.length === 0 ? (
            <span className='text-xs text-muted-foreground'>Nenhum nome adicionado</span>
          ) : (
            <ul className='space-y-2'>
              {tableGuestNames.map((name: string, index: number) => (
                <li
                  key={`${name}-${index}`}
                  className='flex items-center justify-between gap-2 text-sm border rounded-sm px-2 py-1'
                >
                  <span className='truncate'>{name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default TableInfo;