'use client'
import { table } from "@/@types";
import { toast } from "@/hooks/use-toast";
import { buildTableLayout } from "@/lib/tableLayout";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { MAP_LAYOUT } from "./layoutConfig";
import Table from "./Table";

type TablesProps = {
  tableList: table[];
  isPublic?: boolean;
}

const TableMapping = ({ tableList, isPublic }: TablesProps) => {
  const { buckets } = useMemo(() => buildTableLayout(tableList), [tableList]);

  const tableBuckets = useMemo(() => {
    return {
      topFourSeats: buckets.topFourSeats,
      mainTopFourSeats: buckets.mainTopFourSeats,
      smallLeftTop: buckets.smallLeftTop,
      smallLeftBottom: buckets.smallLeftBottom,
      largeRow1: buckets.largeRow1,
      largeRow2: buckets.largeRow2,
      largeRow3: buckets.largeRow3,
    };
  }, [buckets]);

  const topSectionRows = useMemo(() => {
    const chunkSize = 10;

    return Array.from({ length: Math.ceil(buckets.topFourSeats.length / chunkSize) }, (_, index) => {
      const start = index * chunkSize;
      return buckets.topFourSeats.slice(start, start + chunkSize);
    });
  }, [buckets.topFourSeats]);


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
        {tableBuckets.topFourSeats.length > 0 && (
          <div className={MAP_LAYOUT.topSection.wrapperClassName}>
            <h3 className={MAP_LAYOUT.topSection.titleClassName}>{MAP_LAYOUT.topSection.title}</h3>
            {topSectionRows.map((row, rowIndex) => (
              <div key={`top-row-${rowIndex}`} className={MAP_LAYOUT.topSection.rowClassName}>
                {row.map((table) => (
                  <Table key={table.id} table={table} isPublic={isPublic ? true : false} />
                ))}
              </div>
            ))}
          </div>
        )}
        <div className={MAP_LAYOUT.mainSection.wrapperClassName}>
          <h3 className={MAP_LAYOUT.mainSection.headers.smallClassName} />
          <h3 className={MAP_LAYOUT.mainSection.headers.largeClassName} />
          <div className={MAP_LAYOUT.mainSection.smallColumnClassName}>
            {MAP_LAYOUT.mainSection.smallRows.map((row) => (
              <div key={row.id} className={row.className}>
                {tableBuckets[row.bucket].map((table) => (
                  <div key={table.id} className={row.itemClassName?.(table) ?? ''}>
                    <Table table={table} isPublic={isPublic ? true : false} />
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={MAP_LAYOUT.mainSection.largeColumnClassName}>
            {tableBuckets.mainTopFourSeats.length > 0 && (
              <div className="grid grid-flow-col gap-2 sm:gap-4 w-fit justify-start items-center">
                {tableBuckets.mainTopFourSeats.map((table) => (
                  <Table key={table.id} table={table} isPublic={isPublic ? true : false} />
                ))}
              </div>
            )}
            {MAP_LAYOUT.mainSection.largeRows.map((row) => (
              <div key={row.id} className={row.className}>
                {tableBuckets[row.bucket].map((table) => (
                  <Table key={table.id} table={table} isPublic={isPublic ? true : false} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default TableMapping;