import { event } from "@/@types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


import EventForm from "./EventForm/updateEventForm";
import { MoreHorizontal } from "lucide-react";

const Event = (event: event) => {
  const { name, date, tableCount } = event;
  const year = new Date(date).getFullYear();
  const month = new Date(date).getMonth() + 1;
  const day = new Date(date).getUTCDate();

  return (
    <Card className="sm:max-w-sm text-primary shadow-md">
      <CardHeader className="flex flex-row justify-between ">
        <CardTitle>{name}</CardTitle>
        <CardDescription>{`${day}/${month}/${year}`}</CardDescription>
      </CardHeader>
      <CardContent className="font-semibold flex justify-between items-center">
        <div>
          Mesas: <span className="font-normal text-muted-foreground">{tableCount}</span>
        </div>
        <Dialog>
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreHorizontal className="bg-background rounded-full p-1 cursor-pointer hover:animate-jump animate-once animate-duration-[800ms] animate-delay-200 animate-ease-out" />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" >
                <DialogTrigger asChild>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <span className="text-primary font-semibold">Editar</span>
                  </DropdownMenuItem>
                </DialogTrigger>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem className="hover:cursor-pointer">
                    <span className="text-primary font-semibold">Deletar</span>
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-primary">Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação não pode ser desfeita. Isso excluirá permanentemente esse
                  evento e todos os dados relacionados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction>Deletar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <DialogContent className="sm:max-w-[425px] max-w-[360px] rounded-lg bg-white">
            <DialogHeader>
              <DialogTitle className="text-primary">Editar evento</DialogTitle>
            </DialogHeader>

            <EventForm {...event} />

          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>

  );
}

export default Event;