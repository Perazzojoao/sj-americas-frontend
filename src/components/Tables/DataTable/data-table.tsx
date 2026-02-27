"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useSelectedItems } from "@/hooks/useSelectedItems"
import { ArrowLeftToLine, ArrowRightToLine, FileBarChart, FileText, SheetIcon } from "lucide-react"
import { useState } from "react"
import UpdateMultipleTableForm from "../TableForm/UpdateMultipleTableForm"

// Imports para exportação de dados
import { table } from "@/@types"
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  eventId: number
}

export function DataTable<TData, TValue>({ columns, data, eventId }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const { filteredTableList } = useSelectedItems(eventId)

  const getRowTableLabel = (row: { original: TData }) => {
    const tableRow = row.original as table
    return tableRow.displayLabel ?? String(tableRow.number)
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  // Função para exportar para PDF
  const exportToPDF = () => {
    // Inicializa o PDF
    const doc = new jsPDF();

    // Define os cabeçalhos que queremos mostrar (na ordem desejada)
    const desiredHeaders = ["Nº mesa", "Cadeiras", "Lote", "Status", "Pagamento", "Ocupantes"];
    // Prepara os dados para a tabela (todas as linhas, ignorando paginação)
    const tableData = table.getFilteredRowModel().rows.map((row) => {
      const rowData = [];

      // Número da mesa
      rowData.push(getRowTableLabel(row));

      // Cadeiras
      rowData.push(String(row.getValue("cadeiras") || ''));

      // Lote
      const owner = row.getValue("owner");
      rowData.push(owner ? String(owner) : '-');

      // Status
      const isTaken = row.getValue("isTaken");
      rowData.push(isTaken ? "Reservado" : "Vago");

      // Pagamento
      const isPaid = row.getValue("isPaid");
      rowData.push(isTaken ? (isPaid ? "Pago" : "Pendente") : "-");

      // Ocupantes
      const guests = (row.original as table).guestNames ?? [];
      rowData.push(guests.length > 0 ? guests.join(', ') : '-');

      return rowData;
    });

    // Adiciona a tabela ao PDF
    autoTable(doc, {
      head: [desiredHeaders],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 16 },
        2: { cellWidth: 16 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 'auto' },
      },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    // Abre o PDF em uma nova aba
    window.open(URL.createObjectURL(doc.output('blob')), '_blank');
  };  // Função para exportar relatório agrupado por lote
  const exportReportPDF = () => {
    // Inicializa o PDF
    const doc = new jsPDF();

    // Define os cabeçalhos que queremos mostrar (na ordem desejada)
    const desiredHeaders = ["Nº mesa", "Cadeiras", "Status", "Pagamento", "Ocupantes"];

    // Obtém todos os dados filtrados das tabelas
    const allRows = table.getFilteredRowModel().rows;

    // Agrupa os dados por lote
    const groupedByLote: Record<string, typeof allRows> = {};

    allRows.forEach(row => {
      const owner = row.getValue("owner") as string | null;
      const loteKey = owner || "Sem lote";

      if (!groupedByLote[loteKey]) {
        groupedByLote[loteKey] = [];
      }

      groupedByLote[loteKey].push(row);
    });

    // Define posição inicial no PDF
    let yPos = 10;
    let pageCount = 1;

    // Itera sobre cada grupo (lote) para criar tabelas separadas
    Object.entries(groupedByLote).forEach(([lote, rows]) => {
      // Verifica se há espaço suficiente para a tabela + título na página atual
      // Se não houver, cria uma nova página
      if (yPos > 230) {
        doc.addPage();
        yPos = 10;
        pageCount++;
      }

      // Adiciona título para o lote atual
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Lote: ${lote}`, 14, yPos);
      yPos += 7;

      // Prepara os dados para a tabela deste lote
      const tableData = rows.map((row) => {
        const rowData = [];

        // Número da mesa
        rowData.push(getRowTableLabel(row));

        // Cadeiras
        rowData.push(String(row.getValue("cadeiras") || ''));

        // Status
        const isTaken = row.getValue("isTaken");
        rowData.push(isTaken ? "Reservado" : "Vago");

        // Pagamento
        const isPaid = row.getValue("isPaid");
        rowData.push(isTaken ? (isPaid ? "Pago" : "Pendente") : "-");

        // Ocupantes
        const guests = (row.original as table).guestNames ?? [];
        rowData.push(guests.length > 0 ? guests.join(', ') : '-');

        return rowData;
      });

      // Adiciona a tabela ao PDF usando autoTable
      autoTable(doc, {
        startY: yPos,
        head: [desiredHeaders],
        body: tableData,
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
          0: { cellWidth: 16 },
          1: { cellWidth: 16 },
          2: { cellWidth: 20 },
          3: { cellWidth: 20 },
          4: { cellWidth: 'auto' },
        },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
      });

      // Atualiza a posição Y para a próxima tabela
      // @ts-expect-error - erro esperado, pois lastAutoTable pode não existir
      yPos = doc.lastAutoTable.finalY + 15;
    });

    // Adiciona o número de páginas no rodapé
    const totalPages = pageCount;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(`Página ${i} de ${totalPages}`, doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    // Abre o PDF em uma nova aba
    window.open(URL.createObjectURL(doc.output('blob')), '_blank');
  };

  // Função para exportar para CSV
  const exportToCSV = () => {
    // Define os cabeçalhos que queremos mostrar (na ordem desejada)
    const desiredHeaders = ["Número da mesa", "Cadeiras", "Lote", "Status", "Pagamento", "Ocupantes"];
    // Prepara os dados para a tabela no mesmo formato que o PDF (todas as linhas, ignorando paginação)
    const tableData = table.getFilteredRowModel().rows.map((row) => {
      const rowObject: Record<string, string> = {};

      // Número da mesa
      rowObject[desiredHeaders[0]] = getRowTableLabel(row);

      // Cadeiras
      rowObject[desiredHeaders[1]] = String(row.getValue("cadeiras") || '');

      // Lote
      const owner = row.getValue("owner");
      rowObject[desiredHeaders[2]] = owner ? String(owner) : '-';

      // Status
      const isTaken = row.getValue("isTaken");
      rowObject[desiredHeaders[3]] = isTaken ? "Reservado" : "Vago";

      // Pagamento
      const isPaid = row.getValue("isPaid");
      rowObject[desiredHeaders[4]] = isTaken ? (isPaid ? "Pago" : "Pendente") : "-";

      // Ocupantes
      const guests = (row.original as table).guestNames ?? [];
      rowObject[desiredHeaders[5]] = guests.length > 0 ? guests.join(', ') : '-';

      return rowObject;
    });

    // Converte para CSV
    const csv = Papa.unparse(tableData);

    // Cria um blob e inicia o download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `tabela_evento_${eventId}_${new Date().toISOString().split('T')[0]}.csv`);
  };

  // Função para exportar relação de convidados por lote
  const exportGuestListPDF = () => {
    const doc = new jsPDF();

    const compareTableLabels = (leftLabel: string, rightLabel: string) => {
      const leftNormalized = leftLabel.trim();
      const rightNormalized = rightLabel.trim();

      const leftStartsWithB = leftNormalized.toUpperCase().startsWith("B");
      const rightStartsWithB = rightNormalized.toUpperCase().startsWith("B");

      if (leftStartsWithB !== rightStartsWithB) {
        return leftStartsWithB ? -1 : 1;
      }

      const leftNumeric = Number(leftNormalized.replace(/\D/g, ""));
      const rightNumeric = Number(rightNormalized.replace(/\D/g, ""));

      if (!Number.isNaN(leftNumeric) && !Number.isNaN(rightNumeric) && leftNumeric !== rightNumeric) {
        return leftNumeric - rightNumeric;
      }

      return leftNormalized.localeCompare(rightNormalized, "pt-BR", {
        numeric: true,
        sensitivity: "base",
      });
    };

    const guestRows = table
      .getFilteredRowModel()
      .rows
      .flatMap((row) => {
        const ownerValue = row.getValue("owner");
        const owner = ownerValue ? Number(ownerValue) : null;
        const tableLabel = getRowTableLabel(row);
        const guests = (row.original as table).guestNames ?? [];

        return guests.map((guestName) => ({
          owner,
          ownerLabel: owner ? String(owner) : "Sem lote",
          tableLabel,
          guestName,
        }));
      })
      .sort((left, right) => {
        if (left.owner === null && right.owner === null) {
          const tableComparison = compareTableLabels(left.tableLabel, right.tableLabel);

          if (tableComparison !== 0) {
            return tableComparison;
          }

          return left.guestName.localeCompare(right.guestName, "pt-BR");
        }

        if (left.owner === null) return 1;
        if (right.owner === null) return -1;

        if (left.owner !== right.owner) {
          return left.owner - right.owner;
        }

        const tableComparison = compareTableLabels(left.tableLabel, right.tableLabel);

        if (tableComparison !== 0) {
          return tableComparison;
        }

        return left.guestName.localeCompare(right.guestName, "pt-BR");
      });

    if (guestRows.length === 0) {
      doc.setFontSize(12);
      doc.text("Nenhum convidado encontrado para os filtros atuais.", 14, 20);
      window.open(URL.createObjectURL(doc.output('blob')), '_blank');
      return;
    }

    autoTable(doc, {
      head: [["Lote", "Mesa", "Convidado"]],
      body: guestRows.map((row) => [row.ownerLabel, row.tableLabel, row.guestName]),
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 16 },
        2: { cellWidth: 'auto' },
      },
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    window.open(URL.createObjectURL(doc.output('blob')), '_blank');
  };

  return (
    <section>
      <div className="flex items-center py-4 gap-3">
        <Input
          placeholder="Filtrar lotes"
          value={(table.getColumn("owner")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("owner")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-card"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="ml-auto"
              aria-label="Actions"
              disabled={filteredTableList.length === 0}
            >
              Editar marcadas
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[360px] rounded-lg bg-card">
            <DialogHeader>
              <DialogTitle className="text-primary">Editar mesas</DialogTitle>
            </DialogHeader>
            <UpdateMultipleTableForm
              eventId={eventId}
              filteredTableList={filteredTableList}
            />
          </DialogContent>
        </Dialog>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">Exportar tabela</DropdownMenuTrigger>          <DropdownMenuContent>
            <DropdownMenuItem className="cursor-pointer" onClick={exportReportPDF}>
              <FileBarChart /> Relatório
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={exportGuestListPDF}>
              <FileText /> Relação de convidados
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={exportToPDF}>
              <FileText /> PDF
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={exportToCSV}>
              <SheetIcon /> CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table className="bg-card rounded-lg">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} íten(s) selecionados.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <ArrowLeftToLine className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          <ArrowRightToLine className="h-4 w-4" />
        </Button>
      </div>
    </section>
  );
}
