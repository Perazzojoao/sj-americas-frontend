import { table } from "@/@types";
const TableInfo = ({ seats, owner, isTaken }: table) => {
  return (
    <div className="grid grid-cols-1 auto-rows-auto gap-2 p-2 sm:p-3">
      <div className='grid grid-cols-2 gap-2 auto-rows-auto'>
        <span className='text-end font-semibold'>Cadeiras:</span>
        <span>{seats}</span>
        <span className='text-end font-semibold'>Lote:</span>
        <span>{owner ? owner : '-'}</span>
        <span className='text-end font-semibold'>Status:</span>
        <span>{isTaken ? 'Reservado' : 'Vago'}</span>
      </div>
    </div>
  );
}

export default TableInfo;