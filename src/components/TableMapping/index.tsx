'use client'
import { table } from "@/@types";
import { useMemo } from "react";
import Table from "./Table";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";

type TablesProps = {
  tableList: table[];
}

const TableMapping = ({ tableList }: TablesProps) => {
  const { lgTableList, smTableList, firstHalfSmTables, secondHalfSmTables } = useMemo(() => {
    const lgTableList = tableList.filter((table) => table.seats > 4);
    const smTableList = tableList.filter((table) => table.seats <= 4);
    const halfLength = Math.ceil(smTableList.length / 2);
    const firstHalfSmTables = smTableList.slice(0, halfLength);
    const secondHalfSmTables = smTableList.slice(halfLength);
    return { lgTableList, smTableList, firstHalfSmTables, secondHalfSmTables };
  }, [tableList]);

  function shareMap() {
    if (typeof window === 'undefined') return;

    const currentPath = window.location.pathname;
    const id = currentPath.split('/').pop();
    const shareUrl = `${window.location.origin}/mapa/${id}`;

    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Link copiado',
      description: 'O link do mapa foi copiado para a área de transferência',
    })
  }

  return (
    <section className="py-4">
      <div className="flex justify-between items-center mb-3 py-2">
        <h2 className="sm:text-2xl font-semibold text-primary dark:text-white">Mapa de mesas</h2>
        <Button onClick={shareMap}>Compartilhar</Button>
      </div>
      <div className="grid col-span-2 row-span-3 gap-1 sm:gap-5 justify-center items-center bg-card dark:border rounded-lg px-4 py-4 sm:py-16">
        <h3 className="text-center border-b-2 border-primary text-xs sm:text-lg pb-2 mb-2 sm:mb-0">{smTableList[0]?.seats} Cadeiras</h3>
        <h3 className="text-center border-b-2 border-primary text-xs sm:text-lg pb-2 mb-2 sm:mb-0">{lgTableList[0]?.seats} Cadeiras</h3>
        <div className="flex flex-col justify-between items-center gap-[66px] sm:gap-[104px] col-start-1 row-start-2 col-end-1 row-end-2">
          <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit">
            {firstHalfSmTables.map((table, index) => (
              <div key={index} className={`${table.number === 1 ? 'row-span-2' : ''}`}>
                <Table key={table.id} table={table} />
              </div>
            ))}
          </div>
          <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit">
            {secondHalfSmTables.map((table, index) => (
              <div key={index} className={`${table.number === 6 ? 'row-span-2 row-start-2 row-end-2' : ''}`}>
                <Table key={table.id} table={table} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:gap-4 items-center col-start-2 row-start-2 col-end-2 row-end-2">
          <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit">
            {lgTableList.slice(0, 20).map((table) => (
              <Table key={table.id} table={table} />
            ))}
          </div>
          <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit ml-7 sm:ml-11">
            {lgTableList.slice(20, 38).map((table) => (
              <Table key={table.id} table={table} />
            ))}
          </div>
          <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit">
            {lgTableList.slice(38).map((table) => (
              <Table key={table.id} table={table} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TableMapping;