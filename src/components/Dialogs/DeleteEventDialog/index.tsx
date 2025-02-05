'use client'
import { event } from "@/@types";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import useEventList from "@/hooks/useEventList";

const DeleteEventDialog = ({ id }: event) => {
  const { refetch } = useEventList();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        toast({
          title: "Falha ao deletar evento",
          variant: "destructive"
        })
        return;
      } else {
        toast({
          title: "Evento deletado com sucesso",
        })
      }

      refetch();
    } catch (error) {
      console.log("error:", error);
    }
  }
  return (
    <AlertDialogContent className="bg-card">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-primary">Você tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>
          Essa ação não pode ser desfeita. Isso excluirá permanentemente esse
          evento e todos os dados relacionados.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>

  );
}

export default DeleteEventDialog;