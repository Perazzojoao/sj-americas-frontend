'use client'
import { table } from "@/@types";
import { useMemo } from "react";
import Table from "./Table";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { TableGroup, TableSection } from "@/utils/tableDisplay";

/**
 * Sistema de Mapeamento de Mesas baseado em Grid
 * 
 * Este componente utiliza um sistema de configuração baseado em grid para facilitar
 * o posicionamento e organização das mesas no mapa.
 * 
 * Estrutura:
 * - TableSection: Representa uma seção completa do mapa (ex: seção superior, seção principal)
 * - TableGroup: Representa um grupo de mesas dentro de uma seção com sua configuração de grid
 * 
 * Como adicionar novas mesas/fileiras:
 * 1. Defina um novo TableGroup com as mesas e configuração de grid desejada
 * 2. Adicione o grupo à seção apropriada no array sections
 * 3. Configure o gridConfig com rows, cols, flow, gap e className conforme necessário
 * 4. Use specialPositioning para mesas com posicionamento especial (ex: row-span-2)
 * 
 * Numeração:
 * - Mesas de 4 lugares são exibidas com prefixo "B" (B1, B2, B3...)
 * - Mesas de 8 lugares são exibidas sem prefixo (1, 2, 3...)
 */

type TablesProps = {
  tableList: table[];
  isPublic?: boolean;
}

const TableMapping = ({ tableList, isPublic }: TablesProps) => {
  // Configuração do mapa de mesas baseado em grid
  const tableSections = useMemo((): TableSection[] => {
    // Reproduzir a lógica original de filtragem
    const lgTableList = tableList.filter((table) => table.seats > 4 || table.number > 68);
    const smTableList = tableList.filter((table, i) => table.seats <= 4 && i < 10);
    
    const halfLength = Math.ceil(smTableList.length / 2);
    const firstHalfSmTables = smTableList.slice(0, halfLength);
    const secondHalfSmTables = smTableList.slice(halfLength);
    
    // Remove os últimos 10 elementos do lgTableList para renderização
    const displayLgTableList = tableList.length <= 68 
      ? lgTableList 
      : lgTableList.slice(0, lgTableList.length - 10);
    
    // Mesas do topo (após lgTableList quando tableList.length > 68)
    const topSmTableList = tableList.length <= 68 
      ? [] 
      : tableList.slice(lgTableList.length);
    
    // Configurações de seções
    const sections: TableSection[] = [];

    // Seção superior: mesas pequenas do topo
    if (topSmTableList.length > 0) {
      sections.push({
        id: 'top-small-section',
        title: 'Mesas Topo 4 cadeiras',
        groups: [{
          id: 'top-small-group',
          tables: topSmTableList,
          gridConfig: {
            flow: 'col',
            gap: 'gap-2 sm:gap-4',
            className: 'grid grid-flow-col col-span-full col-start-2 gap-2 sm:gap-4 w-fit justify-start items-center grow'
          }
        }],
        containerClassName: 'grid grid-cols-5 gap-1 sm:gap-5 max-w-[560px] pl-3 sm:pl-5 lg:pl-6'
      });
    }

    // Seção principal
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
        // Coluna esquerda: primeira metade das mesas pequenas (4 cadeiras)
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
          tables: displayLgTableList.slice(0, 20),
          gridConfig: {
            rows: 2,
            flow: 'col',
            gap: 'gap-2 sm:gap-4',
            className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit'
          }
        },
        {
          id: 'center-large-row2',
          tables: displayLgTableList.slice(20, 38),
          gridConfig: {
            rows: 2,
            flow: 'col',
            gap: 'gap-2 sm:gap-4',
            className: 'grid grid-rows-2 auto-cols-max grid-flow-col gap-2 sm:gap-4 w-fit ml-7 sm:ml-11'
          }
        },
        {
          id: 'center-large-row3',
          tables: displayLgTableList.slice(38),
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
    const smTableList = tableList.filter((table, i) => table.seats <= 4 && i < 10);
    const lgTableList = tableList.filter((table) => table.seats > 4 || table.number > 68);
    return {
      smTableSeats: smTableList[0]?.seats || 4,
      lgTableSeats: lgTableList[0]?.seats || 8
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
