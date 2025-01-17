'use client'
import { table } from "@/@types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import UpdateTableForm from "../TableForm/UpdateTableForm"
import { useSelectedItems } from "@/hooks/useSelectedItems"
import { CheckedState } from "@radix-ui/react-checkbox"


export const columns: ColumnDef<table>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const { handleAllCheckboxChange } = useSelectedItems()

      function handleCheckboxChange(value: CheckedState) {
        table.toggleAllPageRowsSelected(!!value)
        handleAllCheckboxChange(!!value)
      }

      return (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => handleCheckboxChange(value) }
          aria-label="Select all"
        />
      )
    },
    cell: ({ row }) => {
      const { handleSingleCheckboxChange } = useSelectedItems()

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
    }
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
              <DialogTitle className="text-primary">Editar mesa {table.number}</DialogTitle>
            </DialogHeader>
            <UpdateTableForm {...table} />
          </DialogContent>
        </Dialog>
      )
    },
  }
]