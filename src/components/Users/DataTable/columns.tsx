'use client'
import { CreatedBy, user } from "@/@types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import UpdateUserForm from "../UsersForm/UpdateUserForm"
import DeleteUserDialog from "@/components/Dialogs/DeleteUserDialog"
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog"

export const columns: ColumnDef<user>[] = [
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
    accessorKey: "createdBy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Criado por
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdBy: CreatedBy = row.getValue("createdBy")
      return <div className="text-left pl-4">{createdBy?.user_name ? createdBy.user_name : '-'}</div>
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
        <div className="flex items-center justify-end space-x-3">
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="flex items-center"
                aria-label="Actions"
                variant={"destructive"}
              >
                <Trash2 className="cursor-pointer" />
              </Button>
            </AlertDialogTrigger>
            <DeleteUserDialog {...user} />
          </AlertDialog>
        </div>
      )
    },
  }
]