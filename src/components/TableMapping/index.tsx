'use client'
import { table } from "@/@types";
import { toast } from "@/hooks/use-toast";
import { useMemo } from "react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { MAP_LAYOUT } from "./layoutConfig";
import Table from "./Table";

type TablesProps = {
  tableList: table[];
  isPublic?: boolean;
}

const TableMapping = ({ tableList, isPublic }: TablesProps) => {
  const {
    topFourSeats,
    smallLeftTop,
    smallLeftBottom,
    largeRow1,
    largeRow2,
    largeRow3,
    fourSeatCount,
    eightSeatCount,
  } = useMemo(() => {
    const sortedByNumber = [...tableList].sort((left, right) => left.number - right.number);
    const fourSeatTables = sortedByNumber.filter((table) => table.seats <= 4);
    const eightSeatTables = sortedByNumber.filter((table) => table.seats > 4);

    const toLeftToRightOrder = (tables: table[]) => {
      const topRow = tables.filter((_, index) => index % 2 === 0);
      const bottomRow = tables.filter((_, index) => index % 2 !== 0);
      return [...topRow, ...bottomRow];
    };

    const reorderByIndexSequence = (tables: table[], sequence: number[]) => {
      const reordered = sequence
        .map((index) => tables[index])
        .filter((table): table is table => Boolean(table));

      const usedIds = new Set(reordered.map((table) => table.id));
      const remaining = tables.filter((table) => !usedIds.has(table.id));

      return [...reordered, ...remaining];
    };

    const mainFourSeatsRaw = fourSeatTables
      .filter((table) => table.number <= 68)
      .slice(0, 10);

    const halfLength = Math.ceil(mainFourSeatsRaw.length / 2);
    const smallLeftTopRaw = mainFourSeatsRaw.slice(0, halfLength);
    const smallLeftBottomRaw = mainFourSeatsRaw.slice(halfLength);
    const topFourSeatsRaw = fourSeatTables.filter((table) => table.number > 68);
    const largeRow1Raw = eightSeatTables.slice(0, 20);
    const largeRow2Raw = eightSeatTables.slice(20, 38);
    const largeRow3Raw = eightSeatTables.slice(38);

    const orderedSmallLeftTopForLabel = reorderByIndexSequence(smallLeftTopRaw, [0, 1, 3, 2, 4]);
    const orderedSmallLeftBottomForLabel = reorderByIndexSequence(smallLeftBottomRaw, [1, 3, 0, 2, 4]);

    const orderedFourSeatsForLabel = [
      ...orderedSmallLeftTopForLabel,
      ...orderedSmallLeftBottomForLabel,
      ...topFourSeatsRaw,
    ];

    const orderedEightSeatsForLabel = [
      ...toLeftToRightOrder(largeRow1Raw),
      ...toLeftToRightOrder(largeRow2Raw),
      ...toLeftToRightOrder(largeRow3Raw),
    ];

    const fourSeatLabelById = new Map<number, string>(
      orderedFourSeatsForLabel.map((table, index) => [table.id, `B${index + 1}`]),
    );

    const eightSeatLabelById = new Map<number, string>(
      orderedEightSeatsForLabel.map((table, index) => [table.id, String(index + 1)]),
    );

    const withDisplayLabel = (table: table): table => ({
      ...table,
      displayLabel: table.seats <= 4
        ? fourSeatLabelById.get(table.id)
        : eightSeatLabelById.get(table.id),
    });

    return {
      topFourSeats: topFourSeatsRaw.map(withDisplayLabel),
      smallLeftTop: smallLeftTopRaw.map(withDisplayLabel),
      smallLeftBottom: smallLeftBottomRaw.map(withDisplayLabel),
      largeRow1: largeRow1Raw.map(withDisplayLabel),
      largeRow2: largeRow2Raw.map(withDisplayLabel),
      largeRow3: largeRow3Raw.map(withDisplayLabel),
      fourSeatCount: fourSeatTables.length,
      eightSeatCount: eightSeatTables.length,
    };
  }, [tableList]);

  const tableBuckets = useMemo(() => {
    return {
      topFourSeats,
      smallLeftTop,
      smallLeftBottom,
      largeRow1,
      largeRow2,
      largeRow3,
    };
  }, [topFourSeats, smallLeftTop, smallLeftBottom, largeRow1, largeRow2, largeRow3]);

  const fourSeatTitle = fourSeatCount > 0 ? `${smallLeftTop[0]?.seats ?? 4} Cadeiras` : '4 Cadeiras';
  const eightSeatTitle = eightSeatCount > 0 ? `${largeRow1[0]?.seats ?? 8} Cadeiras` : '8 Cadeiras';


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
            <div className={MAP_LAYOUT.topSection.rowClassName}>
              {tableBuckets[MAP_LAYOUT.topSection.bucket].map((table) => (
                <Table key={table.id} table={table} isPublic={isPublic ? true : false} />
              ))}
            </div>
          </div>
        )}
        <Separator className="max-w-2xl" />
        <div className={MAP_LAYOUT.mainSection.wrapperClassName}>
          <h3 className={MAP_LAYOUT.mainSection.headers.smallClassName}>{fourSeatTitle}</h3>
          <h3 className={MAP_LAYOUT.mainSection.headers.largeClassName}>{eightSeatTitle}</h3>
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