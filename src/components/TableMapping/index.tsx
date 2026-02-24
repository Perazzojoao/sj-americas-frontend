'use client'
import { table } from "@/@types";
import { useMemo } from "react";
import Table from "./Table";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { TableGroup, TableSection } from "@/utils/tableDisplay";

type TablesProps = {
  tableList: table[];
  isPublic?: boolean;
}

const TableMapping = ({ tableList, isPublic }: TablesProps) => {
  // Configuração do mapa de mesas baseado em grid
  const tableSections = useMemo((): TableSection[] => {
    // Separar mesas por tipo
    const smallTables = tableList.filter((table) => table.seats <= 4);
    const largeTables = tableList.filter((table) => table.seats > 4);
    
    // Configurações de seções
    const sections: TableSection[] = [];

    // Seção superior: mesas pequenas após a posição 68 (topSmTableList)
    const topSmTables = tableList.slice(68); // Mesas após índice 68
    if (topSmTables.length > 0) {
      sections.push({
        id: 'top-small-section',
        title: 'Mesas Topo 4 cadeiras',
        groups: [{
          id: 'top-small-group',
          tables: topSmTables,
          gridConfig: {
            flow: 'col',
            gap: 'gap-2 sm:gap-4',
            className: 'grid grid-flow-col col-span-full col-start-2 gap-2 sm:gap-4 w-fit justify-start items-center grow'
          }
        }],
        containerClassName: 'grid grid-cols-5 gap-1 sm:gap-5 max-w-[560px] pl-3 sm:pl-5 lg:pl-6'
      });
    }

    // Seção principal com 3 colunas
    // Primeira coluna: mesas pequenas divididas em duas metades
    const mainSmTables = smallTables.slice(0, 10); // Primeiras 10 mesas pequenas
    const halfLength = Math.ceil(mainSmTables.length / 2);
    const firstHalfSmTables = mainSmTables.slice(0, halfLength);
    const secondHalfSmTables = mainSmTables.slice(halfLength);

    // Segunda coluna: mesas grandes em 3 fileiras
    const mainLgTables = tableList.length <= 68 
      ? largeTables 
      : largeTables.slice(0, largeTables.length - 10);

    sections.push({
      id: 'main-section',
      groups: [
        // Grupo de cabeçalhos
        {
          id: 'headers',
          tables: [],
          gridConfig: {
            className: 'grid col-span-2 row-span-1 gap-1 sm:gap-5 justify-center items-center'
          }
        },
        // Coluna esquerda: mesas pequenas (4 cadeiras)
        {
          id: 'left-small-first-half',
          tables: firstHalfSmTables,
          gridConfig: {
            rows: 2,
            flow: 'col',
            gap: 'gap-2 sm:gap-4',
            className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit'
          },
          specialPositioning: {
            1: 'row-span-2' // Mesa B1 ocupa 2 linhas
          }
        },
        {
          id: 'left-small-second-half',
          tables: secondHalfSmTables,
          gridConfig: {
            rows: 2,
            flow: 'col',
            gap: 'gap-2 sm:gap-4',
            className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit'
          },
          specialPositioning: {
            6: 'row-span-2 row-start-2 row-end-2' // Mesa B6 ocupa 2 linhas começando na linha 2
          }
        },
        // Coluna central: mesas grandes (8 cadeiras) em 3 fileiras
        {
          id: 'center-large-row1',
          tables: mainLgTables.slice(0, 20),
          gridConfig: {
            rows: 2,
            flow: 'col',
            gap: 'gap-2 sm:gap-4',
            className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit'
          }
        },
        {
          id: 'center-large-row2',
          tables: mainLgTables.slice(20, 38),
          gridConfig: {
            rows: 2,
            flow: 'col',
            gap: 'gap-2 sm:gap-4',
            className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit ml-7 sm:ml-11'
          }
        },
        {
          id: 'center-large-row3',
          tables: mainLgTables.slice(38),
          gridConfig: {
            rows: 2,
            flow: 'col',
            gap: 'gap-2 sm:gap-4',
            className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit'
          }
        }
      ],
      containerClassName: 'grid col-span-2 row-span-3 gap-1 sm:gap-5 justify-center items-center'
    });

    return sections;
  }, [tableList]);

  // Obter informações sobre os tipos de mesa para os cabeçalhos
  const { smTableSeats, lgTableSeats } = useMemo(() => {
    const smTable = tableList.find((table) => table.seats <= 4);
    const lgTable = tableList.find((table) => table.seats > 4);
    return {
      smTableSeats: smTable?.seats || 4,
      lgTableSeats: lgTable?.seats || 8
    };
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

  // Renderizar um grupo de mesas
  const renderTableGroup = (group: TableGroup) => {
    if (group.tables.length === 0) return null;

    return (
      <div key={group.id} className={group.gridConfig.className}>
        {group.tables.map((table) => {
          const specialClass = group.specialPositioning?.[table.number] || '';
          return (
            <div key={table.id} className={specialClass}>
              <Table table={table} isPublic={isPublic ? true : false} />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="py-4">
      <div className="flex justify-between items-center mb-3 py-2">
        <h2 className="sm:text-2xl font-semibold text-primary dark:text-white">Mapa de mesas</h2>
        <Button onClick={shareMap}>Compartilhar</Button>
      </div>
      <div className="flex flex-col items-center justify-center gap-10 bg-card dark:border rounded-lg px-4 py-4 sm:py-16">
        {tableSections.map((section) => (
          <div key={section.id}>
            {section.id === 'top-small-section' ? (
              <>
                <div className={section.containerClassName}>
                  <h3 className="grid-flow-row col-span-full col-start-2 text-center border-b-2 border-primary text-xs sm:text-lg pb-2 mb-2 sm:mb-0 grow">
                    {section.title}
                  </h3>
                  {section.groups.map(renderTableGroup)}
                </div>
                <Separator className="max-w-2xl mt-10"/>
              </>
            ) : (
              <div className={section.containerClassName}>
                {/* Cabeçalhos */}
                <h3 className="text-center border-b-2 border-primary text-xs sm:text-lg pb-2 mb-2 sm:mb-0">
                  {smTableSeats} Cadeiras
                </h3>
                <h3 className="text-center border-b-2 border-primary text-xs sm:text-lg pb-2 mb-2 sm:mb-0">
                  {lgTableSeats} Cadeiras
                </h3>
                
                {/* Coluna esquerda: mesas pequenas */}
                <div className="flex flex-col justify-between items-center gap-[66px] sm:gap-[104px] col-start-1 row-start-2 col-end-1 row-end-2">
                  {renderTableGroup(section.groups[1])} {/* firstHalfSmTables */}
                  {renderTableGroup(section.groups[2])} {/* secondHalfSmTables */}
                </div>
                
                {/* Coluna central: mesas grandes */}
                <div className="flex flex-col gap-2 sm:gap-4 items-center col-start-2 row-start-2 col-end-2 row-end-2">
                  {renderTableGroup(section.groups[3])} {/* row1 */}
                  {renderTableGroup(section.groups[4])} {/* row2 */}
                  {renderTableGroup(section.groups[5])} {/* row3 */}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

export default TableMapping;
