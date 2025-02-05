'use client'
import { user } from "@/@types"
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
import { useSelectedItems } from "@/hooks/useSelectedItems"
import { CheckedState } from "@radix-ui/react-checkbox"
import UpdateUserForm from "../UsersForm/UpdateUserForm"

export const columns: ColumnDef<user>[] = [
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
          onCheckedChange={(value) => handleCheckboxChange(value)}
          aria-label="Select all"
        />
      )
    },
    cell: ({ row }) => {
      function handleCheckboxChange(value: CheckedState) {
        row.toggleSelected(!!value)
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
    accessorKey: "user_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome de usuário
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user_name: string = row.getValue("user_name")
      return <div className="text-left pl-4">{user_name}</div>
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Função
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const role: string = row.getValue("role")
      return <div className="text-left pl-4">{role}</div>
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Data de criação
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt: string = row.getValue("createdAt")
      const formattedDate = new Date(createdAt).toLocaleDateString('pt-BR')
      return <div className="text-left pl-4">{formattedDate}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

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
              <DialogTitle className="text-primary">Editar usuário: {user.user_name}</DialogTitle>
            </DialogHeader>
            <UpdateUserForm {...user} />
          </DialogContent>
        </Dialog>
      )
    },
  }
]