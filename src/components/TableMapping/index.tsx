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
    const lgTableList = tableList.filter((table) => table.seats > 4 || table.number > 68);
    const smTableList = tableList.filter((table, i) => table.seats <= 4 && i < 10);
    const halfLength = Math.ceil(smTableList.length / 2);
    const firstHalfSmTables = smTableList.slice(0, halfLength);
    const secondHalfSmTables = smTableList.slice(halfLength);
    return { lgTableList, smTableList, firstHalfSmTables, secondHalfSmTables };
  }, [tableList]);

  // Remove os últimos 10 elementos do lgTableList para renderização
  const displayLgTableList = useMemo(() => {
    if (tableList.length <= 68) return lgTableList;
    return lgTableList.slice(0, lgTableList.length - 10);
  }, [lgTableList]);

  const topSmTableList = useMemo(() => {
    if (tableList.length <= 68) return [];
    return tableList.slice(lgTableList.length);
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
      <div className="flex flex-col items-center justify-center gap-10 bg-card dark:border rounded-lg px-4 py-4 sm:py-16">
        {topSmTableList.length > 0 && (
          <div className="grid grid-cols-5 gap-1 sm:gap-5 max-w-[560px] pl-3 sm:pl-5 lg:pl-6">
            <h3 className="grid-flow-row col-span-full col-start-2 text-center border-b-2 border-primary text-xs sm:text-lg pb-2 mb-2 sm:mb-0 grow">Mesas Topo</h3>
            <div className="grid grid-flow-col col-span-full col-start-2 gap-2 sm:gap-4 w-fit justify-start items-center grow">
              {topSmTableList.map((table) => (
                <Table key={table.id} table={table} />
              ))}
            </div>
          </div>
        )}
        <div className="grid col-span-2 row-span-3 gap-1 sm:gap-5 justify-center items-center">
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
              {displayLgTableList.slice(0, 20).map((table) => (
                <Table key={table.id} table={table} />
              ))}
            </div>
            <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit ml-7 sm:ml-11">
              {displayLgTableList.slice(20, 38).map((table) => (
                <Table key={table.id} table={table} />
              ))}
            </div>
            <div className="grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit">
              {displayLgTableList.slice(38).map((table) => (
                <Table key={table.id} table={table} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TableMapping;