'use client'
import { table } from "@/@types"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useSelectedItems } from "@/hooks/useSelectedItems"
import { CheckedState } from "@radix-ui/react-checkbox"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import UpdateTableForm from "../TableForm/UpdateTableForm"

const getTableLabel = (tableRow: table) => tableRow.displayLabel ?? String(tableRow.number)

const parseTableLabel = (label: string) => {
  const isFourSeat = label.startsWith('B')
  const numericPart = Number.parseInt(isFourSeat ? label.slice(1) : label, 10)

  return {
    group: isFourSeat ? 0 : 1,
    value: Number.isNaN(numericPart) ? Number.MAX_SAFE_INTEGER : numericPart,
  }
}

const compareTableLabels = (left: table, right: table) => {
  const leftParsed = parseTableLabel(getTableLabel(left))
  const rightParsed = parseTableLabel(getTableLabel(right))

  if (leftParsed.group !== rightParsed.group) {
    return leftParsed.group - rightParsed.group
  }

  return leftParsed.value - rightParsed.value
}


export const columns: ColumnDef<table>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const currentRows = table.getRowModel().rows
      const currentPageIds = currentRows.map((row) => row.original.id)
      const firstRowEventId = currentRows[0]?.original.eventId
      const { handleAllCheckboxChange } = useSelectedItems(firstRowEventId)

      function handleCheckboxChange(value: CheckedState) {
        table.toggleAllPageRowsSelected(!!value)
        handleAllCheckboxChange(!!value, currentPageIds)
      }

      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => handleCheckboxChange(value)}
          aria-label="Select all"
        />
      )
    },
    cell: ({ row }) => {
      const { handleSingleCheckboxChange } = useSelectedItems(row.original.eventId)

      function handleCheckboxChange(value: CheckedState) {
        const id = row.original.id

        row.toggleSelected(!!value)
        handleSingleCheckboxChange(id)
      }

      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => handleCheckboxChange(value)}
          aria-label="Select row"
        />
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "number",
    sortingFn: (rowA, rowB) => compareTableLabels(rowA.original, rowB.original),
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Número da mesa
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <div>{getTableLabel(row.original)}</div>
    },
  },
  {
    id: "cadeiras",
    accessorKey: "seats",
    header: "Cadeiras",
  },
  {
    accessorKey: "owner",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Lote
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    filterFn: 'weakEquals',
    cell: ({ row }) => {
      const owner = row.getValue("owner")
      const displayedData = owner ? `${owner}` : "-"

      return <div className="text-left font-medium">{displayedData}</div>
    },
  },
  {
    accessorKey: "isTaken",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isTakenValue = row.getValue("isTaken")
      const displayedData = isTakenValue ? "Reservado" : "Vago"

      return <div className="text-left font-medium">{displayedData}</div>
    },
  },
  {
    accessorKey: "isPaid",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pagamento
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const isTakenValue = row.getValue("isTaken")
      const isPaidValue = row.getValue("isPaid")
      const displayedData = isTakenValue ? (isPaidValue ? "Pago" : "Pendente") : "-"

      return <div className="text-left font-medium">{displayedData}</div>

    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const table = row.original
      const tableLabel = getTableLabel(table)

      return (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="flex items-center"
              aria-label="Actions"
            >
              Editar
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] max-w-[360px] rounded-lg bg-card">
            <DialogHeader>
              <DialogTitle className="text-primary">Editar mesa {tableLabel}</DialogTitle>
            </DialogHeader>
            <UpdateTableForm {...table} />
          </DialogContent>
        </Dialog>
      )
    },
  }
]