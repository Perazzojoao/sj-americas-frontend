'use client'
import { event, user } from "@/@types";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import useUserList from "@/hooks/useUserList";

const DeleteUserDialog = ({ id }: user) => {
  const { refetch } = useUserList();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        toast({
          title: "Falha ao deletar usuário",
          variant: "destructive"
        })
        return;
      } else {
        toast({
          title: "Usuário deletado com sucesso",
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
          usuário e todos seus dados relacionados.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>

  );
}

export default DeleteUserDialog;